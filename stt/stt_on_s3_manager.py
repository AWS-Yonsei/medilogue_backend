from __future__ import print_function
import boto3
import datetime
import time


def lambda_handler(event, context):
    """Process new document uploaded to S3 using Amazon Transcribe service"""
    BUCKET_NAME = event['Records'][0]['s3']['bucket']['name']
    OBJECT_NAME = event['Records'][0]['s3']['object']['key']

    # Amazon Transcribe 서비스를 사용하여 음성 파일을 텍스트로 변환
    transcribe_client = boto3.client('transcribe')

    file_name = OBJECT_NAME.split('/')[-1]

    current_time = int(time.time())
    job_name = f'stt-job-{file_name}-{current_time}'
    job_path = f's3://{BUCKET_NAME}/{OBJECT_NAME}'

    try:
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=f'{job_name}',
            Media={'MediaFileUri': job_path},
            MediaFormat='mp3',
            LanguageCode='ko-KR',  # 음성 파일의 언어 코드 (한국어: ko-KR)
            OutputBucketName='ysu-team-001-voice-record',
            OutputKey=f'stt-processed/{file_name}.json'
        )
        print("transcribe successfully")
    except Exception as e:
        print(f"Error starting transcription job: {e}")


def string_converter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()
