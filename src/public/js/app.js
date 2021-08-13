const socket = new WebSocket(`ws:${window.location.host}`); // socket은 서버로의 연결을 뜻함

socket.addEventListener("open", () => {
	console.log("Connected to Server");
});

socket.addEventListener("message", message => {
	console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
	console.log("Disconnected to Server");
});

setTimeout(() => {
	socket.send("hello from the browser!");
}, 5000);