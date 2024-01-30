const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const v4 = require("uuid").v4;
const ioc = require("socket.io-client");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const User = require("./model/user");
const Room = require("./model/chatRoom");
const Message = require("./model/message");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ extended: false }));
const connect = require("./db");
connect();

const api = require("./routes/index.js");
app.use("/", api);

const port = 8080;

//Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);



app.get("/", (req, res) => res.send("Hi Claire Welcome to Node.js"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//socket
function countRoom(roomName) {
  // 방에 사람이 몇명이 있는지 계산하는 함수(set의 size를 이용)
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
  console.log("user connected");
  //접속 시 이전에 속해있던 채팅방들이 있는지 확인함.
  // data : 각종 정보를 담고 있는 payload object
  // data.room message를 보내는 room의 이름 (귓을 위해서는 socket_id를 room으로 사용하면 된다.)
  // data.token message를 보내는 user의 token
  // data.message message : 메시지의 본문.
  socket.on("reload", async (data) => {
    const user_data = utils.parseJWTPayload(data.token);
    let rooms= await Room.find({
      users: { $elemMatch: { uid: user_data.user.uid } }
    });
    for(let i=0; i<rooms.length; i++){
      socket.join(rooms[i].room_id);
      socket.to(rooms[i].room_id).emit("reload", data);
    }
    //현재 들어가있는 방을 표시 (기본적으로 User와 Server 사이에 private room이 1개 있음)
    console.log(socket.rooms);
  });

  socket.on("join_room", async (data) => {
    const user_data = utils.parseJWTPayload(data.token);
    let uid = user_data.user.uid;
    let user = await User.findOne({ uid: uid });
    let room_id = data.room;

    if (data.room == undefined || countRoom(data.room) == 0) {
      //방이 처음 만들어짐.
      //피드와 연결해서 초기 톡방 설정 구현
      //톡방 title과 썸네일의 경우 생성 페이지에서 받아와야함.
      let newRoom = new Room({
        room_id: v4(), //uuid v4를 이용해서 random unique id 얻어냄.
      });
      newRoom.users.push({
        uid: uid,
        name: user_data.user.name,
      });

      await newRoom.save((err) => {
        if (err) {
          console.log(err);
        }
      });

      room_id = newRoom.room_id;
    } else {
      // user를 room에 push하면 된다.
      let room = await Room.findOne({ room_id: room_id });
      let find_user = await Room.findOne({
        users: { $elemMatch: { uid: uid } },
        room_id: room_id,
      });
      console.log(find_user);
      if (find_user == undefined) {
        room.users.push({
          uid: uid,
          name: user_data.user.name,
          profileImg: user_data.user.profileImg,
        });
        room.save();
      }
    }
    socket.join(room_id);
    socket.to(room_id).emit("welcome", data);
    //현재 들어가있는 방을 표시 (기본적으로 User와 Server 사이에 private room이 1개 있음)
    console.log(socket.rooms);
  });

  socket.on("leave_room", async (data) => {
    //TODO : 삭제가 되지 않는 오류 수정
    const user_data = utils.parseJWTPayload(data.token);
    await Room.updateOne(
      { room_id: data.room },
      { $pull: { users: { uid: user_data.user.uid } } }
    );
    socket.to(data.room).emit("bye", data);
    socket.leave(data.room);
    console.log(socket.rooms);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  //socket.emit : 앱에서 기존 메시지를 읽을 수 있도록 서버가 채팅 기록을 불러와야 함. (emit : send의 역할을 함)
  //socket.on("message" : 내가 앱에서 채팅을 쳤을 때 (on : receive의 역할을 함.)
  socket.on("new_message", async (data) => {
    const user_data = utils.parseJWTPayload(data.token);
    let newMessage = new Message({
      user: user_data.user.nickname,
      content: data.content,
      createdAt: new Date(),
      room_id: data.room,
    });
    await newMessage.save((err) => {
      if (err) console.log(err);
    });
    // Sending the new message to call the connected clients
    console.log("newMessage : ", newMessage);
    io.to(data.room).emit("new_message", newMessage);
    //TODO: room에 있는 모든 유저들에게 notice를 발송해야 함.
    //room에 있는 유저들의 목록을 얻은 다음에 for문을 돌려가면서 notice를 만들고,
    let room = await Room.findOne({ room_id: data.room });
    console.log(room)
  });
});