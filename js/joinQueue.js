/*

joinQueue.js
----------------
designed to handle the networking for joining a queue as well as displaying relevant information

*/

let conn // this will keep conection in main scope

let properConnection = false // changes when a proper connection is confirmed

let kicked = false // stop user from sending leave message when kicked

/* QUEUE HANDLING */
// connect to queue server using an https connection
var peer = new Peer({host: "queue-system-server.herokuapp.com", port: "443", secure: true, key: "peerjs"});
// when an id is revieved, log it for debugging purposes
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
});

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
    setTimeout(() => {window.location.href = "index.html"}, 1500)
})

// if confirmation modal is cancelled close modal
document.getElementById("confirm-stay").addEventListener("click", () => {
    document.getElementById("confirmation").classList.toggle("hidden")
})

function joinQueue() {
	let leave = false
	// check for id
	if (document.getElementById("connection-id").value.trim().length != 5) 
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
	
	// join queue based on the id and name provided
	conn = peer.connect(document.getElementById("connection-id").value, {metadata: {name: document.getElementById("name").value}});
	// on connection open
	conn.on('open', function() {
		// remove join queue screen
		document.getElementById("join-queue").classList.toggle("hidden")

		// wait 500ms for host authentication
		setTimeout(() => {
			if (properConnection)
			{
				// if authenticated show in queue screen
				document.getElementById("in-queue").classList.toggle("hidden")
			} else {
				// else alert user and reload page
				alert("Invalid Queue ID")
				document.location.reload()
			}
		}, 500)
	})

	// if connection gets closed leave
	conn.on('close', function() {
		// leave page after 1500ms to finish any data transfers
		setTimeout(() => {window.location.href = "index.html"}, 1500)
	})

	// on data
	conn.on('data', function(data) {
		// this is our "authentication"
		if (data == "host") {
			properConnection = true
		} else {
			// any other data will be a position so we show the user this data
			document.getElementById("current-position").innerHTML = "Current Position: " + data

			// if data starts with "1/" the its the user's turn so we run turn function
			if (data.startsWith("1/")) {
				turn()
			}

			// if user is kicked or removed they will be removed from page after 1500ms
			// uif user was kicked they will also be notified
			if (data.startsWith("kicked") || data.startsWith("removed")) {
				// leave queue
				kicked = true
				setTimeout(() => { if (data.startsWith("kicked")) {sendNotification("You've been kicked from the queue.")};window.location.href = "index.html"}, 1500)
			}
		}
	})
}

// if user closes window
window.onbeforeunload = function(){
    // if not kicked, send leaving
    if (!kicked || !removed) {
        conn.send("leaving");
    }
}

