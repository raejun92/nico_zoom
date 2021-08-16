const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws:${window.location.host}`); // socket은 서버로의 연결을 뜻함

socket.addEventListener("open", () => { // 서버에 연결
	console.log("Connected to Server");
});

socket.addEventListener("message", message => { // 서버로부터 메시지를 받음
	console.log("New message: ", message.data);
});

socket.addEventListener("close", () => { // 서버가 연결을 종료
	console.log("Disconnected to Server");
});

function handleSubmit(event) {
	event.preventDefault();
	const input = messageForm.querySelector("input");
	socket.send(input.value);
	input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);