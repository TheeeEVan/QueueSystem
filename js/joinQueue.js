/*

joinQueue.js
----------------
designed to handle the networking for joining a queue as well as displaying relevant information

*/

let conn // this will keep conection in main scope

let properConnection = false

let kicked = false // stop user from sending leave message when kicked

/* QUEUE HANDLING */
var peer = new Peer({host: "queue-system-server.herokuapp.com", port: "443", secure: true, key: "peerjs"});
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
});


function turn() {
    if (document.getElementById("turn").classList.contains("hidden")) {
		sendNotification();
        document.getElementById("turn").classList.toggle("hidden")
        document.getElementById("in-queue").classList.toggle("hidden")
    }
}

// when join queue button is pressed switch to queue page
document.getElementById("join-queue-button").addEventListener("click", () => {
    joinQueue()
	setTimeout(() => {
		if (!properConnection) {
			alert("Invalid Queue ID")
		}
	}, 500)
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
    // join queue
    conn = peer.connect(document.getElementById("connection-id").value, {metadata: {name: document.getElementById("name").value}});
    conn.on('open', function() {
        console.log("connected")
		
		// remove join queue screen
        document.getElementById("join-queue").classList.toggle("hidden")

		// wait 500ms for host authentication
		setTimeout(() => {
			if (properConnection)
			{
				document.getElementById("in-queue").classList.toggle("hidden")
			} else {
				alert("Invalid Queue ID")
				document.location.reload()
			}
		}, 500)
    })

    // if connection gets closed leave
    conn.on('close', function() {
        // leave queue
        setTimeout(() => {window.location.href = "index.html"}, 1500)
    })

    conn.on('data', function(data) {
		// this is our "authentication"
		if (data == "host") {
			properConnection = true
		} else {
		
	        console.log(data)
	        document.getElementById("current-position").innerHTML = "Current Position: " + data
	
	        if (data.startsWith("1/")) {
	            turn()
	        }
	
	        if (data.startsWith("kicked") || data.startsWith("removed")) {
	            // leave queue
	            kicked = true
	            setTimeout(() => {sendNotification("You've been kicked from the queue.");window.location.href = "index.html"}, 1500)
	        }
		}
    })
}

window.onbeforeunload = function(){
    // Do something
    if (!kicked) {
        conn.send("leaving");
    }
}

