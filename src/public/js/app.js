const socket = io(); // 브라우저에 설치한 io를 사용

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = message;
	ul.appendChild(li);
}

function handleMessageSubmit(event) {
	event.preventDefault();
	const input = room.querySelector("#msg input");
	const value = input.value;
	socket.emit("new_message", input.value, roomName, () => { // 백엔드로 message를 보냄
		addMessage(`You: ${value}`);
	}); 
	input.value = "";
}

function handleNicknameSubmit(event) {
	event.preventDefault();
	const input = room.querySelector("#name input");
	socket.emit("nickname", input.value);
}

function showRoom() {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName}`;
	const msgForm = room.querySelector("#msg");
	const nameForm = room.querySelector("#name");
	msgForm.addEventListener("submit", handleMessageSubmit);
	nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
	event.preventDefault();
	const input = form.querySelector("input");
	socket.emit("enter_room", input.value, showRoom); // event를 보냄
	roomName = input.value;
	input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	addMessage(`${left} left T^T`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
	const roomList = welcome.querySelector("ul");
	roomList.innerHTML = ""; // 방을 나가면 목록에서 삭제
	rooms.forEach(room => {
		const li = document.createElement("li");
		li.innerText = room;
		roomList.append(li);
	});
});