/*

createQueue.js
----------------
createQueue.js is designed to handle all technical aspects of creating a queue

*/

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

/* QUEUE HANDLING */

// queue variable
// [{peerId: "12345", name: "Bob", conn: conn}]
var queue = []

// create peer object and connect to the queue server using an https connection
var peer = new Peer({host: "queue-system-server.herokuapp.com", port: "443", secure: true, key: "peerjs"});
// when we open the connection set the id on users screen
peer.on('open', function(id) {
	document.getElementById("queue-id").innerHTML = "ID: " + id
});

// when a client connects
peer.on('connection', function(conn) { 
	// when the connection is opened
	conn.on('open', function(data) {
		// send "host" to client to confirm they are connecting to a host and not a client
		conn.send("host")
		// add the users info to the queue array
		queue.push({peerId: conn.peer, name: conn.metadata.name, conn: conn})
		// update queue
		updateQueue()
	})

	// on data recieved
	conn.on('data', function(data) {
		// if user is leaving
		if (data == "leaving") {
			// if leaving member is first in queue leave in place so that nothing weird happens
			if (!(queue[0].peerId == conn.peer)) {
				queue.splice(queue.map(client => client.peerId).indexOf(conn.peer), 1) // cool array stuff | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice (if you put nothing in the third argument it will remove the element)
			}
			// update queue
			updateQueue()
		}
	})
});

// update queue and send data to all peers
function updateQueue() {
	// get list
	let list = document.getElementById("list");
	// empty list
	list.innerHTML = ""

	// for every member we add a li element
	queue.forEach(member => {
		list.innerHTML += `<li ${queue.indexOf(member) == 0 ? 'class="first"' : ''} id="${member.peerId}" onclick="kick('${member.peerId}')" data-kick="0">${member.name}</li>`
	})

	// if its empty after we add *placeholder text*
	if (list.innerHTML == "") {
		list.innerHTML = "<li style='text-decoration: none !important'><em>It's quiet in here...</em></li>"
	}
	// send position data to each user
	// for ever member we take the actual member and their index
	queue.forEach((member, index) => {
		// send the member their index + 1 as well as queue length
		member.conn.send(index + 1 + "/" + queue.length)
	})
}

// this function runs when host requests the next user
function next() {
	// remove first user and set them to a variable
	let removed = queue.splice(0, 1)
	// sends message saying they were removed from queue
	removed[0].conn.send("removed")
	// update queue
	updateQueue()
}

// saves queue
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

// this functions goes through the kick process for the specified id
function kick(id) {
	// get the user from queue list
	let listItem = document.getElementById(id)
	/*
	Kick Statuses:
	0. Normal User In Queue
	1. First press, lasts 2 seconds
	2. Second press, kicks user
	*/
	// if pressed while user isnt being kicked
	if (listItem.dataset.kick == 0) {
		// add confirm delete class so the text appears
		listItem.classList.add("confirmDelete")
		// set status to 1
		listItem.dataset.kick = 1

		// wait 2 seconds
		setTimeout(() => {
			// if after 2 seconds status has changed to 2 we can kick user
			if (listItem.dataset.kick == 2) {
				// remove user from the queue using splice and set the removed user to a variable
				let kicked = queue.splice(queue.map(client => client.peerId).indexOf(id), 1);
				// take the connection of the kicked user and send "kicked" to them so that the client knows it has been kicked
				kicked[0].conn.send("kicked")
				// update queue
				updateQueue()
			} else {
				// remove delete class
				listItem.classList.remove("confirmDelete");
				// set kick status back to 0
				listItem.dataset.kick = 0;
			}
		}, 2000)
	} else if (listItem.dataset.kick == 1) { // if user is in first stage
		// set kick status to 2
		listItem.dataset.kick = 2
		// remove confirm delete class
		listItem.classList.remove("confirmDelete")
		// change text and style of the element as we wait for timeout to finish
		listItem.innerHTML = "Removing..."
		listItem.style = "color: red !important;text-decoration: none !important;"
	}
}

// immediatly update empty queue
updateQueue()