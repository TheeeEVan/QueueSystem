/*

joinQueue.js
----------------
designed to handle the networking for joining a queue as well as displaying relevant information

*/

let conn // this will keep conection in main scope

let properConnection = false // changes when a proper connection is confirmed

let kicked = false // stop user from sending leave message when kicked

if (typeof io == 'undefined') {
	alert("The server is currently down. Please try again later.")
	window.location.href = "/"
}

// connect to socket
const socket = io("https://queue-system-server.herokuapp.com/", {
	extraHeaders: {
		"type": "client"
	}
})

// this function runs when its the users turn
function turn() {
	// if the turn isn't already shown from previous update
    if (document.getElementById("turn").classList.contains("hidden")) {
		// send default notifcation (notifications.js)
		sendNotification();
		// toggle both the turn screen and in queue screen so they switch
        document.getElementById("turn").classList.toggle("hidden")
        document.getElementById("in-queue").classList.toggle("hidden")
    }
}

// when join queue button is pressed switch to queue page
document.getElementById("join-queue-button").addEventListener("click", () => {
	joinQueue()
})

// when leave queue button is pressed open confirmation modal
document.getElementById("leave-button").addEventListener("click", () => {
    document.getElementById("confirmation").classList.toggle("hidden")
})

// if confirmation modal is confirmed leave queue
document.getElementById("confirm-leave").addEventListener("click", () => {
    // leave queue
    window.location.href = "/"
})

// if confirmation modal is cancelled close modal
document.getElementById("confirm-stay").addEventListener("click", () => {
    document.getElementById("confirmation").classList.toggle("hidden")
})

function joinQueue() {
	let leave = false
	// check for id
	if (document.getElementById("connection-id").value.trim().length != 4) 
	{
		document.getElementById("connection-id").style = "border-color: red;"
		leave = true
		setTimeout(() => {document.getElementById("connection-id").style = ""}, 2000)
	} 

	// check for name
	if (document.getElementById("name").value.trim().length == 0)
	{
		document.getElementById("name").style = "border-color: red;"
		leave = true
		setTimeout(() => {document.getElementById("name").style = ""}, 2000)
	}

	// if name or id is empty we dont join queue
	if (leave) return;
	
	socket.emit("join-queue", {id: document.getElementById("connection-id").value, name: document.getElementById("name").value})
}

socket.on("join-status", (data) => {
	if (data.status == 1) {
		// remove join queue screen
		document.getElementById("join-queue").classList.toggle("hidden")
		document.getElementById("in-queue").classList.toggle("hidden")
	} else {
		document.getElementById("error").innerHTML = data.reason
		document.getElementById("error").style = "display: block"

		if (data.reason == "That name is being used!") {
			document.getElementById("name").style = "border-color: red;"
			setTimeout(() => {document.getElementById("name").style = ""}, 2000)
		} else if (data.reason == "Invalid queue code!") {
			document.getElementById("connection-id").style = "border-color: red;"
			setTimeout(() => {document.getElementById("connection-id").style = ""}, 2000)
		}
	}
})

socket.on("position", (data) => {
	if (data.current == 1) {
		turn()
	} else {
		document.getElementById("current-position").innerHTML = `Current position: ${data.current}/${data.total}`
	}
})

socket.on("disconnected", (data) => {
	if (data.reason != "first") {
		sendNotification(data.reason);
	}
	window.location.href = "/"
})


