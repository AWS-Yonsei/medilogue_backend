# 당뇨병 예측 모델

이 디렉토리에는 당뇨병 예측 모델을 구현하고 테스트하는 데 필요한 여러 파일들이 포함되어 있습니다.
모델의 사용 목적은 환자의 라벨링된 생체 데이터를 입력 받으면, 그 값을 이용하여 환자가 당뇨병일 확률을 예측하고, 어떤 특성이 그런 판단에 영향을 많이 주었는지 알 수 있어야 합니다.
이에 여러 분류 모델 중 앞선 두 가지 특성을 모두 만족할 수 있는 모델인 XGBOOST를 이용하여 머신러닝을 진행하였습니다.

## 데이터 포맷

당뇨병 예측 모델을 학습하고 테스트하는 데 사용되는 데이터는 다음과 같은 형식을 가지고 있습니다.

| Field Name          | Input(json) | Output(json) | Ouput Code |
|---------------------|-------------|--------------|------------|
| uid                 | str         | str          | -          |
| Gender              | int         | -            | 0          |
| AGE                 | int         | -            | 1          |
| Urea                | float       | -            | 2          |
| Cr                  | float       | -            | 3          |
| HbA1c               | float       | -            | 4          |
| Chol                | float       | -            | 5          |
| TG                  | float       | -            | 6          |
| HDL                 | float       | -            | 7          |
| LDL                 | float       | -            | 8          |
| VLDL                | float       | -            | 9          |
| BMI                 | float       | -            | 10         |
| timestamp           | str         | -            | -          |
| predicted_label     | -           | int          | -          |
| probability         | -           | list(float)  | -          |
| Max contrib feature | -           | list(int)    | -          |


**Probability**는 당뇨병 발병 가능성을 나타내는 확률을 나타내고, 
당뇨병이 아닌 경우 0, 주의해야할 경우 1, 당뇨병일 경우 2의 index에 각각의 확률이 저장됩니다.

**Max contrib feature**는 예측에 가장 큰 영향을 미친 특성을 나타냅니다.
0 ~ 10으로 표현되며, 총 3가지의 상위 특성이 저장됩니다.


## 파일 구성

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