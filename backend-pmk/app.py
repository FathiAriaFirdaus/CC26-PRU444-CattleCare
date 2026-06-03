from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from io import BytesIO
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# ── Load model & artefak ───────────────────────────────────────────────────────
cnn_model = tf.keras.models.load_model('fmd_cnn_best_model.h5')
ann_model = tf.keras.models.load_model('model_pmk_ann.h5')

with open('kolom_fitur_pmk.pkl', 'rb') as f:
    kolom_fitur = pickle.load(f)

# ── Nilai scaling dari notebook (Cell 5: scaler.fit_transform) ────────────────
# scaler.mean_  = [8.0079083, 102.27137907]  → Age (tahun), Temperature (Fahrenheit)
# scaler.scale_ = [4.31365651, 1.40024469]
AGE_MEAN,  AGE_STD  = 8.0079083,    4.31365651
TEMP_MEAN, TEMP_STD = 102.27137907, 1.40024469

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

    # Scale manual Age & Temperature (bypass scaler karena versi sklearn beda)
    df['Age']         = (df['Age']         - AGE_MEAN)  / AGE_STD
    df['Temperature'] = (df['Temperature'] - TEMP_MEAN) / TEMP_STD

    return df

# ── Endpoint prediksi ──────────────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict_pmk():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Tidak ada file gambar yang diunggah'}), 400

        file = request.files['file']

        # CNN — label: 0=Sakit, 1=Sehat → balik
        img       = image.load_img(BytesIO(file.read()), target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        cnn_raw        = float(cnn_model.predict(img_array)[0][0])
        cnn_prob_sakit = 1.0 - cnn_raw

        # ANN — label: 1=Sakit, 0=Sehat → TIDAK dibalik (sesuai notebook Cell 3)
        df_input       = build_ann_input(request.form)
        ann_raw        = float(ann_model.predict(df_input)[0][0])
        ann_prob_sakit = ann_raw  # langsung pakai, tidak dibalik

        # Late fusion (rata-rata)
        skor_akhir   = (cnn_prob_sakit + ann_prob_sakit) / 2.0
        status_akhir = "Terindikasi PMK" if skor_akhir >= 0.5 else "Sapi Sehat"

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


if __name__ == '__main__':
    app.run(debug=True, port=5000)