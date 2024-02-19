# `stt`
이 폴더는 S3 + AWS Lambda 환경에서 Event trigger로 Amazon Transcribe 서비스를 이용하는 기능이 구현되어 있습니다. 
Amazon Transcribe는 음성 파일을 텍스트로 변환합니다.

## `stt_on_s3_manager.py`

이 파일은 AWS S3의 지정된 디렉토리에 업로드된 새로운 음성파일을 처리하는 데 사용됩니다. Amazon Transcribe 서비스를 사용하여 음성 파일을 텍스트로 변환하는 것입니다.

### `def lambda_handler`

지정된 디렉토리에서 이벤트가 발생하여 이 함수를 호출했을 때 실행됩니다.
이 함수는 S3 버킷의 이름과 객체의 키를 이벤트에서 가져옵니다.
그런 다음, 객체의 키에서 파일 이름을 추출하고, 현재 시간을 기반으로 작업 이름을 생성합니다.
이 작업 이름과 파일 경로를 사용하여 Transcribe 서비스를 시작합니다.
이 서비스는 음성 파일을 텍스트로 변환하고, 변환된 텍스트를 지정된 S3 버킷에 JSON 형식으로 저장합니다.

### `def string_converter`

이 함수는 datetime 객체를 문자열로 변환하는 데 사용됩니다.