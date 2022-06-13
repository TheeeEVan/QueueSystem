/*

createQueue.js
----------------
createQueue.js is designed to handle all technical aspects of creating a queue

*/

// saves queue for saving to txt
let queue = []

// when close button is pressed open confirmation
document.getElementById("close-button").addEventListener('click', () => {
	document.getElementById("confirmation").classList.toggle("hidden")
})

// when confirmation is denied remove confirmation
document.getElementById("confirm-stay").addEventListener('click', () => {
	document.getElementById("confirmation").classList.toggle('hidden')
})

// when confirmation is confirmed return to home page
document.getElementById("confirm-close").addEventListener('click', () => {
	window.location.href = "index.html"
})

if (typeof io == 'undefined') {
	alert("The server is currently down. Please try again later.")
	window.location.href = "/"
}

// connect to socket
const socket = io("https://queue-system-server.herokuapp.com/", {
	extraHeaders: {
		"type": "host"
	}
})

// when we receive an id
socket.on("id", (data) => {
	// expose id to user
	document.getElementById("queue-id").innerHTML = `ID: ${data.toUpperCase()}`
	// immediatly request to make queues
	socket.emit("create-queue", { duplicates: false })
})

// on disconnect alert user and redirect to homepage
socket.on("disconnect", () => {
	alert("Lost connection to server...")
	window.location.href = "/"
})

socket.on("update", (data) => {
	queue = data
	document.getElementById("list").innerHTML = ""
	document.getElementById("queue-members").innerHTML = `Total Queue Members: ${data.length}`
	if (data.length == 0) document.getElementById("list").innerHTML = "<li style=\"text-decoration: none !important;\"><em>It's quiet in here...</em></li>"
	else {
		data.forEach((user, index) => {
			let name = user.name
			document.getElementById("list").innerHTML += `<li ${index == 0 ? 'class="first "' : ''}id=${name} onclick="kick('${name}')">${name}</li>`
		})
	}
})

function next() {
	socket.emit("next")
}

function close() {
	window.location.href = "/"
}

function kick(name) {
	socket.emit("kick", name)
}

function save() {
	// save queue to text file
	let text = ""
	queue.forEach(member => {
		text += member.name + "\n"
	})

	// save text to file
	let textFile = new Blob([text], {type: 'text/plain'});
	saveAs(textFile, "queue.txt")
}