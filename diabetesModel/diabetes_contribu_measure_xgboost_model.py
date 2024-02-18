import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
import numpy as np
import pickle
import shap
from xgboost import XGBClassifier

# 데이터 로드
df = pd.read_csv('data/Diabetes_Dataset_kaggle.csv')

# 데이터 전처리
X = df[['Gender', 'AGE', 'Urea', 'Cr', 'HbA1c', 'Chol', 'TG', 'HDL', 'LDL', 'VLDL', 'BMI']]
y = df['CLASS']
id = df[['ID', 'No_Pation']]

# 데이터를 학습 데이터와 테스트 데이터로 분리
X_train, X_test, y_train, y_test, id_train, id_test = train_test_split(X, y, id, test_size=0.3,
                                                                                 random_state=5)

# 데이터 스케일링
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# 데이터를 DMatrix 형태로 변환
# dtrain = xgb.DMatrix(X_train, label=y_train)
# dtest = xgb.DMatrix(X_test, label=y_test)

# 파라미터 설정
# param = {'eta': 0.2, 'reg_alpha': 5, 'objective': 'multi:softprob', 'eval_metric': 'mlogloss', 'num_class': 3,
#         'device': 'cuda'}

# 모델 학습
# model = XGBClassifier(param)


# XGBoost 모델 학습
model = XGBClassifier(
    eta=0.05,
    n_estimators=462,
    num_leaves=29,
    max_depth=7,
    min_child_weight=1,
    gamma=5,
    reg_alpha=20,
    objective='multi:softprob',
    eval_metric='mlogloss',
    num_class=3,
)
model.fit(X_train, y_train)


# 테스트 데이터에 대한 예측 클래스 값 계산
y_pred = model.predict(X_test)

# 테스트 데이터에 대한 각 클래스별 예측 확률 계산
y_pred_proba = model.predict_proba(X_test)

# 퍼센트 확률 형태로 변환하고 리스트에 저장
percentage_proba = []

for proba in y_pred_proba:
    percentage_proba.append([round(p * 100, 3) for p in proba])

# SHAP Explainer 객체 생성
explainer = shap.Explainer(model)

# 테스트 데이터에 대한 SHAP 값 계산
shap_values = explainer.shap_values(X_test)

# 각 데이터 포인트에 대해 큰 SHAP 값을 가진 특성 3개 이름 찾기
max_contrib_features = np.argsort(shap_values[1], axis=1)[:, -3:]

# 각 데이터 포인트에 대해 가장 크게 기여한 특성 3개와 그 기여도 출력 및 실제 클래스 값과 예측 클래스 값, 그리고 각 클래스별 예측 확률 비교
for i, (id_index, true, pred, proba, max_contrib_feature) in enumerate(
        zip(id_test, y_test, y_pred, percentage_proba, max_contrib_features)):
    print(
        f"Test data {i} (original index {id_index}): True = {true}, Predicted = {pred}, Probability = {proba}, Max contrib feature = {max_contrib_feature}")

# 모델 정확도 계산
accuracy = model.score(X_test, y_test)

print("Accuracy:", accuracy)

# 모델을 파일로 저장
with open('model/diab_model.pkl', 'wb') as f:
    pickle.dump(model, f)
