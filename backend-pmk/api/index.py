from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from io import BytesIO
import pickle
import pandas as pd
import sqlite3
import datetime
import os

app = Flask(__name__)
CORS(app)

# Bypass ngrok browser warning untuk request dari JavaScript
@app.after_request
def add_ngrok_header(response):
    response.headers["ngrok-skip-browser-warning"] = "true"
    return response

# ── Load model & artefak ───────────────────────────────────────────────────────
cnn_model = tf.keras.models.load_model('./fmd_cnn_best_model.h5')
ann_model = tf.keras.models.load_model('./model_pmk_ann.h5')

with open('./kolom_fitur_pmk.pkl', 'rb') as f:
    kolom_fitur = pickle.load(f)

# ── Scaling constants (dari notebook) ─────────────────────────────────────────
AGE_MEAN,  AGE_STD  = 8.0079083,    4.31365651
TEMP_MEAN, TEMP_STD = 102.27137907, 1.40024469

# ── Database setup ─────────────────────────────────────────────────────────────
DB_PATH = 'riwayat_pmk.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS riwayat (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            tanggal         TEXT    NOT NULL,
            hasil_prediksi  TEXT    NOT NULL,
            confidence_score REAL   NOT NULL,
            cnn_prob_sakit  REAL    NOT NULL,
            ann_prob_sakit  REAL    NOT NULL,
            suhu_input      REAL,
            age_input       REAL,
            jumlah_gejala   INTEGER
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def simpan_riwayat(hasil_prediksi, confidence_score, cnn_prob, ann_prob, suhu, age, jumlah_gejala):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
        INSERT INTO riwayat
            (tanggal, hasil_prediksi, confidence_score, cnn_prob_sakit, ann_prob_sakit, suhu_input, age_input, jumlah_gejala)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        hasil_prediksi,
        confidence_score,
        cnn_prob,
        ann_prob,
        suhu,
        age,
        jumlah_gejala
    ))
    conn.commit()
    conn.close()

# ── Adapter: camelCase frontend → nama kolom CSV ───────────────────────────────
FIELD_MAP = {
    'age':                      'Age',
    'temperature':              'Temperature',
    'blistersOnGums':           'blisters on gums',
    'blistersOnMouth':          'blisters on mouth',
    'blistersOnTongue':         'blisters on tongue',
    'soresOnGums':              'sores on gums',
    'soresOnMouth':             'sores on mouth',
    'soresOnTongue':            'sores on tongue',
    'blistersOnHooves':         'blisters on hooves',
    'soresOnHooves':            'sores on hooves',
    'difficultyWalking':        'difficulty walking',
    'lameness':                 'lameness',
    'cracklingSound':           'crackling sound',
    'lossOfAppetite':           'loss of appetite',
    'fatigue':                  'fatigue',
    'depression':               'depression',
    'chills':                   'chills',
    'sweats':                   'sweats',
    'shortnessOfBreath':        'shortness of breath',
    'chestDiscomfort':          'chest discomfort',
    'painlessLumps':            'painless lumps',
    'swellingInNeck':           'swelling in neck',
    'swellingInAbdomen':        'swelling in abdomen',
    'swellingInLimb':           'swelling in limb',
    'swellingInExtremities':    'swelling in extremities',
    'swellingInMuscle':         'swelling in muscle',
}

BOOLEAN_KEYS = [k for k in FIELD_MAP if k not in ('age', 'temperature')]

def build_ann_input(form):
    row = {col: 0.0 for col in kolom_fitur}

    for fe_key, csv_col in FIELD_MAP.items():
        raw = form.get(fe_key, '0')
        try:
            row[csv_col] = float(raw)
        except (ValueError, TypeError):
            row[csv_col] = 0.0

    # Konversi suhu Celsius → Fahrenheit (dataset training pakai Fahrenheit)
    row['Temperature'] = row['Temperature'] * 9/5 + 32

    df = pd.DataFrame([row]).reindex(columns=kolom_fitur, fill_value=0.0)

    # Scale manual Age & Temperature
    df['Age']         = (df['Age']         - AGE_MEAN)  / AGE_STD
    df['Temperature'] = (df['Temperature'] - TEMP_MEAN) / TEMP_STD

    return df

# ── POST /predict ──────────────────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict_pmk():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Tidak ada file gambar yang diunggah'}), 400

        file = request.files['file']

        # CNN
        img       = image.load_img(BytesIO(file.read()), target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        cnn_raw        = float(cnn_model.predict(img_array)[0][0])
        cnn_prob_sakit = 1.0 - cnn_raw   # label CNN: 0=Sakit, 1=Sehat

        # ANN
        df_input       = build_ann_input(request.form)
        ann_raw        = float(ann_model.predict(df_input)[0][0])
        ann_prob_sakit = ann_raw          # label ANN: 1=Sakit, 0=Sehat

        # Late fusion
        skor_akhir   = (cnn_prob_sakit + ann_prob_sakit) / 2.0
        status_akhir = "Terindikasi PMK" if skor_akhir >= 0.5 else "Sapi Sehat"

        # Hitung jumlah gejala yang aktif
        jumlah_gejala = sum(
            1 for k in BOOLEAN_KEYS
            if request.form.get(k, '0') == '1'
        )

        # Simpan ke database
        suhu_input = float(request.form.get('temperature', 0))
        age_input  = float(request.form.get('age', 0))
        simpan_riwayat(
            status_akhir,
            round(skor_akhir * 100, 2),
            round(cnn_prob_sakit * 100, 2),
            round(ann_prob_sakit * 100, 2),
            suhu_input,
            age_input,
            jumlah_gejala
        )

        return jsonify({
            'status':           'success',
            'hasil_prediksi':   status_akhir,
            'confidence_score': round(skor_akhir * 100, 2),
            'detail': {
                'cnn_prob_sakit': round(cnn_prob_sakit * 100, 2),
                'ann_prob_sakit': round(ann_prob_sakit * 100, 2),
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /riwayat ───────────────────────────────────────────────────────────────
@app.route('/riwayat', methods=['GET'])
def get_riwayat():
    try:
        conn   = sqlite3.connect(DB_PATH)
        cursor = conn.execute('''
            SELECT id, tanggal, hasil_prediksi, confidence_score,
                   cnn_prob_sakit, ann_prob_sakit, suhu_input, age_input, jumlah_gejala
            FROM riwayat
            ORDER BY id DESC
            LIMIT 50
        ''')
        rows = cursor.fetchall()
        conn.close()

        data = [
            {
                'id':               r[0],
                'tanggal':          r[1],
                'hasil_prediksi':   r[2],
                'confidence_score': r[3],
                'cnn_prob_sakit':   r[4],
                'ann_prob_sakit':   r[5],
                'suhu_input':       r[6],
                'age_input':        r[7],
                'jumlah_gejala':    r[8],
            }
            for r in rows
        ]

        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── DELETE /riwayat/<id> ───────────────────────────────────────────────────────
@app.route('/riwayat/<int:id>', methods=['DELETE'])
def delete_riwayat(id):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute('DELETE FROM riwayat WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': f'Riwayat #{id} dihapus'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return 'Backend API Running'

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)