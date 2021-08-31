import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// 이렇게 하면 http서버와 webSocket서버 둘 다 사용 가능
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms() {
	// const sids = wsServer.sockets.adapter.sids;
	// const rooms = wsServer.sockets.adapter.rooms;
	// 위와 같다
	const {sockets: {adapter: {sids, rooms}}} = wsServer;
	const publicRooms = [];
	rooms.forEach((_, key) => { // set으로 되어 있음
		if (sids.get(key) === undefined) {
			publicRooms.push(key);
		}
	});
	return publicRooms;
}

function countRoom(roomName) {
	return wsServer.sockets.adapter.rooms.get(roomName)?.size;
	/* 
		if(wsServer.sockets.adapter.rooms.get(roomName)){
		return wsServer.sockets.adapter.rooms.get(roomName).size
		} else {
		return undefined;
		}
	*/
}

wsServer.on("connection", socket => {
	socket["nickname"] = "anonymous";
	socket.onAny((event) => { // onAny는 어느 event에서든 log를 볼 수 있음
		console.log(`Socket Event: ${event}`);
	});
	socket.on("enter_room", (roomName, done) => {
		socket.join(roomName); // 방에 참가 
		done(); // done을 호출하면 front의 showRoom 실행
		socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); // 방에 있는 모든 사람에게(본인제외) emit
		wsServer.sockets.emit("room_change", publicRooms());
	});
	socket.on("disconnecting", () => { // client가 접속을 중단하지만 아직 방을 완전히 나가지 않음
		socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)); // 접속한 방에 메시지를 보냄
	});
	socket.on("disconnect", () => {
		wsServer.sockets.emit("room_change", publicRooms());
	});
	socket.on("new_message", (msg, room, done) => {
		socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
		done();
	});
	socket.on("nickname", nickname => socket["nickname"] = nickname);
});

/* 
const wss = new WebSocket.Server({server}); // http서버 위에 webSocket 서버를 만든다
const sockets = [];
wss.on("connection", socket => { // socket은 연결된 브라우저를 뜻함
	sockets.push(socket);
	socket["nickname"] = "Anon";
	console.log("Connected to Browser");
	socket.on("close", () => console.log("Disconnected from browser")); // 브라우저가 연결을 끊음(창 닫기)
	socket.on("message", (msg) => { // 브라우저로부터 메시지를 받음
		const message = JSON.parse(msg);
		switch (message.type) {
			case "new_message":
				sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
			case "nickname":
				socket["nickname"] = message.payload;
		}
	});
}); */
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);