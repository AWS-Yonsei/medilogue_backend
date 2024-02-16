# Medilogue_backend component
---
# 📋 메디로그
![메디로그 소개](https://user-images.githubusercontent.com/18081105/137470716-273ad6a5-bb46-4c86-84a0-f6114e129834.png)

---
## ▶ 프로젝트 소개
![메디로그 소개2](https://user-images.githubusercontent.com/18081105/137470874-4235e53d-1d2a-470d-8112-53f0a1c83f0a.png)

## 💡 기능
 - 전체적인 기능에 대한 UI outline은 아래의 XD를 통해 확인할 수 있다.
 - **[기능 보기](https://xd.adobe.com/view/8cd76f98-f4e2-4b65-98dc-7de299e81dc4-d984/grid)**

 
## ✅ 구성 안내
 - backend의 개발 환경은 window11, node v18.12.1에서 진행되었다.
 
 - 데이터베이스로는 mongoDB를 사용하고 있으며, 각각의 schema에 대한 정보는 model 폴더에서 확인할 수 있다.
 
 - test data는 data 폴더에서 확인할 수 있으며, 데이터 초기화는 mongodb shell을 설치한 이후 window의 경우 ABM_back component에서 ```set_data.bat```을 실행하고, 이외의 mac, linux의 경우 ```set_data.sh``` 를 실행해서 초기화 할 수 있다.
 
 - backend API 문서는 backend component를 실행하고, ```http://localhost:3000/api-docs``` URL에서 확인할 수 있다.
 
 - 백엔드 자체적으로 데이터 검증/테스트를 할 경우에는 POSTMAN을 주로 사용하여 테스트하였고, front-end와의 연동하여 테스트를 할 경우에는 front component도 실행하여 에뮬레이터에서 테스트하였다.

## ⚡️ 설치/실행 안내 (Installation/Run Process)
- ```git clone https://github.com/AWS-Yonsei/medilogue_backend.git```를 활용해서 backend component를 다운로드 받는다.

- backend component의 설치가 완료되었으면 ```npm install```을 통해서 backend 개발에 필요한 dependency를 설치한다.

- ```node index.js```를 통해서 backend component를 실행한다.

- open web browser and connect ```localhost:3000```
