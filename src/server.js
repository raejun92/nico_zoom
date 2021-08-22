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

wsServer.on("connection", socket => {
	console.log(socket);
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