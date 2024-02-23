from __future__ import print_function
import boto3
import logging
import time
import json
import os
import openai
import requests


def lambda_handler(event, context):
    """Process new document uploaded to S3 using Amazon Transcribe service"""
    BUCKET_NAME = event['Records'][0]['s3']['bucket']['name']
    OBJECT_NAME = event['Records'][0]['s3']['object']['key']

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Amazon Transcribe 서비스를 사용하여 음성 파일을 텍스트로 변환
    transcribe_client = boto3.client('transcribe')

    file_name = OBJECT_NAME.split('/')[-1]

    current_time = int(time.time())
    job_name = f'stt-job-{file_name}-{current_time}'
    job_path = f's3://{BUCKET_NAME}/{OBJECT_NAME}'

    try:
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=f'{job_name}',
            # Specialty='PRIMARYCARE',
            # Type='CONVERSATION,'
            Media={'MediaFileUri': job_path},
            MediaFormat='mp3',
            LanguageCode='ko-KR',  # 음성 파일의 언어 코드 (한국어: ko-KR)
            OutputBucketName='ysu-team-001-voice-record',
            OutputKey=f'stt-processed/{file_name}.json'
        )
        logger.info(f"transcribe successfully: {response}")
    except Exception as e:
        logger.info(f"Error starting transcription job: {e}")

    # S3에서 JSON 파일을 가져옵니다.
    s3 = boto3.client('s3')
    data = s3.get_object(Bucket=BUCKET_NAME, Key=f'stt-processed/{file_name}.json')
    transcript = json.loads(data['Body'].read().decode('utf-8'))
    logger.info("did")

    # 파일 이름에서 doctor_id와 patient_id를 추출합니다.
    file_name_without_extension = os.path.splitext(file_name)[0]
    doctor_id = str(file_name_without_extension.split('-')[0])
    patient_id = str(file_name_without_extension.split('-')[1])
    logger.info("%s %s", doctor_id, patient_id)

    # JSON 파일에서 텍스트를 추출합니다.
    user_message = transcript['results']['transcripts'][0]['transcript']

    # OpenAI API 키를 설정합니다.
    openai.api_key = os.getenv('OPENAI_SECRET_KEY')
    # openai.organization = os.getenv('OPENAI_ORGANIZATION')

    try:
        # 추출한 텍스트를 OpenAI의 GPT 모델에 보냅니다.
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "I am a medical professional who speaks Korean very fluently. When see colloquial writing that has become strange due to breaks or slurred pronunciation, I am good at replacing it with very well-organized writing."
                },
                {
                    "role": "user",
                    "content": f"In this case, the patient and doctor had a video consultation, and since they talked for a long time, there were a lot of topics, so I don't remember the details exactly. This is what it is about.{user_message} Could you organize it so it's easier to see? In particular, it would be nice to organize it by dividing it into categories such as symptoms, follow-up prescriptions, etc. Please interpret words with incorrect pronunciation according to the surrounding context."
                },
                {"role": "system", "content": "Give me the transcript"},
                {"role": "user", "content": f"Summarize this {user_message}, as well-organized article."}
            ],
            max_tokens=300,
            temperature=0.75
        )
        logger.info("send")
        ai_response = completion['choices'][0]['message']['content']
        logger.info("AI response: %s", ai_response)

        s3_client = boto3.client('s3')
        bucket_name = 'ysu-team-001-voice-record'
        key = f'output/{file_name}.json'

        payload = {
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "content": [ai_response]  # GPT 모델의 응답을 content에 추가합니다.
        }
        # Convert the payload to JSON
        payload_json = json.dumps(payload)

        # Save the JSON file to the 'output' folder in the S3 bucket
        s3_client.put_object(Body=payload_json, Bucket=bucket_name, Key=key)

        logger.info(f"Saved payload to {bucket_name}/{key}")
        ## clinic/stt API로 응답을 보냅니다.
        # api_endpoint = "http://localhost:8080/clinic/stt"
        # headers = {"Content-Type": "application/json"}
        # payload = {
        #    "doctor_id": doctor_id,
        #    "patient_id": patient_id,
        #    "content": [ai_response]  # GPT 모델의 응답을 content에 추가합니다.
        # }
        #
        # response = requests.post(api_endpoint, headers=headers, json=payload)
        # logger.info("Response from clinic/stt API: %s", response.text)
        #
        # return {
        #    'statusCode': response.status_code,
        #    'body': response.text
        # }
    except Exception as e:
        logger.error('Error from OpenAI API: %s', e)
        return {
            'statusCode': 500,
            'body': 'Unable to get response from OpenAI API.'
        }
