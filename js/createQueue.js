/*

createQueue.js
----------------
createQueue.js is designed to handle all technical aspects of creating a queue

*/

// handle closing queue
document.getElementById("close-button").addEventListener('click', () => {
	document.getElementById("confirmation").classList.toggle("hidden")
})

document.getElementById("confirm-stay").addEventListener('click', () => {
	document.getElementById("confirmation").classList.toggle('hidden')
})

document.getElementById("confirm-close").addEventListener('click', () => {
	window.location.href = "index.html"
})

/* QUEUE HANDLING */

// queue variable
// [{peerId: "12345", name: "Bob", conn: conn}]
var queue = []

// peer object
var peer = new Peer({host: "queue-system-server.herokuapp.com", port: "443", secure: true, key: "peerjs"});
peer.on('open', function(id) {
	document.getElementById("queue-id").innerHTML = "ID: " + id
});

peer.on('connection', function(conn) { 
	conn.on('open', function(data) {
		conn.send("host")
		console.log(conn.metadata.name + " has joined the queue")
		queue.push({peerId: conn.peer, name: conn.metadata.name, conn: conn})
		updateQueue()
	})

	// get leave message
	conn.on('data', function(data) {
		if (data == "leaving") {
			console.log("leaving")
			console.log(conn.metadata.name + " has left the queue")
			// if leaving member is first in queue leave in place
			if (!(queue[0].peerId == conn.peer)) {
				queue.splice(queue.map(client => client.peerId).indexOf(conn.peer), 1) // cool array stuff | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice (if you put nothing in the third argument it will remove the element)
			}
			updateQueue()
		}
	})
});

// update queue and send data to all peers
function updateQueue() {
	// update ui
	let list = document.getElementById("list");
	list.innerHTML = ""

	queue.forEach(member => {
		list.innerHTML += `<li ${queue.indexOf(member) == 0 ? 'class="first"' : ''} id="${member.peerId}" onclick="kick(${member.peerId})" data-kick="0">${member.name}</li>`
	})
	// send position data
	queue.forEach((member, index) => {
		member.conn.send(index + 1 + "/" + queue.length)
	})
}

// this function runs when host requests the next user
function next() {
	let removed = queue.splice(0, 1)
	// sends message saying they were removed from queue
	removed[0].conn.send("kicked")
	updateQueue()
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

function kick(id) {
	let listItem = document.getElementById(id)
	 if (listItem.dataset.kick == 0) {
		listItem.classList.add("confirmDelete")
		listItem.dataset.kick = 1

		setTimeout(() => {
			if (listItem.dataset.kick == 2) {
				listItem.dataset.kick = 0;
				let kicked = queue.splice(queue.map(client => client.peerId).indexOf(id), 1);
				kicked[0].conn.send("kicked")
				updateQueue()
			} else {
				listItem.classList.remove("confirmDelete");
			}
		}, 2000)
	 } else if (listItem.dataset.kick == 1) {
		 listItem.dataset.kick = 2
		 listItem.classList.remove("confirmDelete")
		 listItem.innerHTML = "Removing..."
		 listItem.style = "color: red !important;text-decoration: none !important;"
	 }
}