const jwt = require("jsonwebtoken");
const { Configuration, OpenAIApi } = require("openai");     /* openai 모듈을 불러옵니다.*/
require('dotenv').config();

function parseJWTPayload(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) throw err;
    return decoded;
  });
}

const callGpt35 = async (prompt) => {                   
  const configiration = new Configuration({         
    apiKey: process.env.OPENAI_SECRET_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
  });
  try {
    const openai = new OpenAIApi(configiration);            /* openai에서 발급 받은 비밀키, 조직ID로 객체를 생성합니다 */

    const response = await openai.createChatCompletion({    /* 생성된 객체로 openAI의 여러가지 모델 중 하나인 gpt-3.5-turbo에 요청을 보냅니다. */
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return response.data.choices[0].message;

  } catch (error) {
      console.error('callGpt35() error >>> ', error);
      return null;
  }
};

module.exports = {parseJWTPayload, callGpt35};