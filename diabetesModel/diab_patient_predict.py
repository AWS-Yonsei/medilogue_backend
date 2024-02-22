import numpy as np
import pandas as pd
import json
import pickle
import shap
import requests

# 서버에서 JSON 데이터 수신
response = requests.get('http://localhost:8080/analyze')
patient_health_data = response.json()['data']
print(patient_health_data)

# with open('temp_test_data/patient_health_testdata.json', 'r') as j:
#     patient_health_data = json.load(j)-

# 모델 불러오기
with open('model/diab_model.pkl', 'rb') as f:
    diab_model = pickle.load(f)

with open('model/diab_data_scaler.pkl', 'rb') as s:
    diab_sc = pickle.load(s)

# 테스트 데이터 로드
df = pd.json_normalize(patient_health_data)
X = df[['Gender', 'AGE', 'Urea', 'Cr', 'HbA1c', 'Chol', 'TG', 'HDL', 'LDL', 'VLDL', 'BMI']]
uid = df['uid']

# 데이터 스케일링
data_input = diab_sc.transform(X)

# 테스트 데이터에 대한 예측 클래스 값 계산
x_pred = diab_model.predict(data_input)

# 테스트 데이터에 대한 각 클래스별 예측 확률 계산
x_pred_proba = diab_model.predict_proba(data_input)

# 퍼센트 확률 형태로 변환하고 리스트에 저장
percentage_proba = []
for proba in x_pred_proba:
    percentage_proba.append([round(float(p) * 100, 3) for p in proba])

# 리스트 percentage_proba의 띄어쓰기 없애기
percentage_proba = [str(i).replace(' ', '') for i in percentage_proba]

# SHAP Explainer 객체 생성
explainer = shap.Explainer(diab_model)

# 테스트 데이터에 대한 SHAP 값 계산
shap_values = explainer.shap_values(data_input)

# 각 SHAP 클래스에 대한 SHAP값들을 가중평균(.35, .3, .35)하여 하나의 SHAP값으로 만들기
avg_shap_values = np.average(shap_values, axis=0, weights=[0.35, 0.3, 0.35])

# 테스트 데이터의 클래스 중 예측 확률이 가장 큰 클래스에 대해 큰 SHAP 값을 가진 특성 3개 이름 찾고 리스트에 저장
max_contrib_features = np.argsort(avg_shap_values, axis=1)[:, -3:]
max_influ_features = []
for influence in max_contrib_features:
    max_influ_features.append([int(k) for k in influence])

# 리스트 max_influ_features의 띄어쓰기 없애기
max_influ_features = [str(i).replace(' ', '') for i in max_influ_features]

result = {
    'uid': str(uid.values[0]),
    'predicted_label': int(x_pred[0]),
    'probability': percentage_proba[0],
    'features': max_influ_features[0]
}
print(result)

url = 'http://localhost:8080/analyze'
response = requests.post(url, json=result)

print(response.status_code)
print(response.text)

