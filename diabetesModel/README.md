# 당뇨병 예측 모델

이 디렉토리에는 당뇨병 예측 모델을 구현하고 테스트하는 데 필요한 여러 파일들이 포함되어 있습니다.

## 파일

### `diabetes_contribu_measure_xgboost_model.py`

이 파일은 XGBoost 모델을 사용하여 당뇨병 예측 모델을 학습하고 테스트 한 후, 모델을 파일로 저장하는 코드를 포함하고 있습니다.

### `diab_patient_predict.py`

이 파일은 학습된 모델을 사용하여 환자의 당뇨병 발병 가능성을 예측하는 코드를 포함하고 있습니다. json 형식의 환자 건강 데이터를 입력으로 받아, 예측 결과를 json으로 출력합니다. output의 포맷은 다음과 같습니다.
    
    {'uid': str,'predicted_label': int,'probability': list(float),'Max contrib feature': list(int)}

### `model/diab_data_scaler.pkl`
이 파일은 학습된 모델에 사용된 데이터 스케일러를 저장하고 있습니다. diab_patient_predict.py에서 input된 json을 scaling하는데에 사용됩니다.

### `model/diab_model.pkl`
이 파일은 학습된 모델을 저장하고 있습니다. diab_patient_predict.py에서 input된 데이터에 대해 클래스 예측에 사용됩니다.

### `temp_test_data/patient_health_testdata.json`

이 파일은 모델 테스트 용도로 사용할 환자의 건강 데이터를 포함하고 있습니다.

### `train_dataset/Diabetes_Dataset_kaggle.csv`

이 파일은 당뇨병 예측 모델을 학습하는 데 사용되는 데이터 세트를 포함하고 있습니다. 각 환자의 정보와 당뇨병 발병 여부를 나타내는 여러 특징들이 포함되어 있습니다.

### `requirements.txt`

이 파일은 이 프로젝트에서 필요한 Python 패키지를 나열하고 있습니다. 이 파일을 사용하여 필요한 패키지를 한 번에 설치할 수 있습니다.

### `.gitignore`

이 파일은 Git 버전 관리 시스템에서 무시해야 하는 파일 또는 디렉토리를 지정합니다. `.venv` 디렉토리가 무시되도록 설정되어 있습니다.

## 설치

### 실행환경 설정

```bash
pip install --upgrade pip
pip install -r requirements.txt
```
### 사용법

모델을 학습하려면 다음 명령을 실행하세요:
```bash
python diabetes_contribu_measure_xgboost_model.py
```
환자의 당뇨병 발병 가능성을 예측하려면 다음 명령을 실행하세요:
```bash
python diab_patient_predict.py
```