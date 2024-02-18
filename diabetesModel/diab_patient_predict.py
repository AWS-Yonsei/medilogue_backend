import json
import pickle
import numpy as np
import pandas as pd
import shap
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from datetime import datetime


# 모델 불러오기
with open('model/diab_model.pkl', 'rb') as f:
    diab_model = pickle.load(f)
#diab_model = pickle.load(open('model/diab_xgboost_model.h5', 'rb'))

# 테스트 데이터 로드
df = pd.read_csv('data/diab_patient_testcase.csv')
X = df[['Gender', 'AGE', 'Urea', 'Cr', 'HbA1c', 'Chol', 'TG', 'HDL', 'LDL', 'VLDL', 'BMI']]
patient_ids = df[['ID']]

# 데이터 스케일링
sc = StandardScaler()
x_input = sc.fit_transform(X)

# 테스트 데이터에 대한 예측 클래스 값 계산
x_pred = diab_model.predict(x_input)

# 테스트 데이터에 대한 각 클래스별 예측 확률 계산
x_pred_proba = diab_model.predict_proba(x_input)

# 테스트 데이터에 대한 각 클래스별 예측 확률 중 가장 큰 값의 인덱스 찾기
max_proba_index = np.argmax(x_pred_proba, axis=1)
print(x_pred_proba)
print(max_proba_index[0])

# 퍼센트 확률 형태로 변환하고 리스트에 저장
percentage_proba = []
for proba in x_pred_proba:
    percentage_proba.append([round(float(p) * 100, 3) for p in proba])

# SHAP Explainer 객체 생성
explainer = shap.Explainer(diab_model)

# 테스트 데이터에 대한 SHAP 값 계산
shap_values = explainer.shap_values(x_input)
print(shap_values)


# 테스트 데이터의 클래스 중 예측 확률이 가장 큰 클래스에 대해 큰 SHAP 값을 가진 특성 3개 이름 찾기
max_contrib_features = np.argsort(shap_values[0], axis=1)[:, -3:]

max_influ_features = []
for influence in max_contrib_features:
    max_influ_features.append([int(k) for k in influence])

result = {
    'patient_id': int(patient_ids.values[0][0]),  # convert ndarray to list
    'predicted_label': int(x_pred[0]),
    'probability': percentage_proba[0],
    'Max contrib feature': max_influ_features[0]
    # max_contrib_features[0].tolist()#.tolist()  # convert ndarray to list
}
print(type(int(patient_ids.values[0][0])), int(patient_ids.values[0][0]))
print(type(int(x_pred[0])), int(x_pred[0]))
print(type(percentage_proba[0]), percentage_proba[0])
print(type(max_influ_features[0]), max_influ_features[0])
print(result)
# 실제 클래스 값과 예측 클래스 값, 그리고 각 클래스별 예측 확률 비교
# for i, (pred, proba, max_contrib_feature) in enumerate(zip(x_pred, percentage_proba, max_contrib_features)):
#    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # 현재 시간을 문자열로 변환
#    result = {
#        'patient_id': int(patient_ids.values[i][0]),  # convert ndarray to list
#        'timestamp': timestamp,  # timestamp 추가
#        'predicted_label': pred,
#        'probability': proba,
#        'Max contrib feature': max_contrib_feature.tolist()  # convert ndarray to list
#    }

# 결과를 JSON 파일로 저장
with open('patient_predictions.json', 'w') as f:
    json.dump(result, f)

print("Prediction results are saved as predictions.json")

