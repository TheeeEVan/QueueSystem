/*

joinQueue.js
----------------
designed to handle the networking for joining a queue as well as displaying relevant information

*/

var join = new Audio('assets/joinqueue.wav');
var leave = new Audio('assets/leavequeue.wav');
var yourturn = new Audio('assets/yourturn.wav');

var conn // this will keep conection in main scope

let kicked = false // stop user from sending leave message when kicked

/* QUEUE HANDLING */
var peer = new Peer({host: "queue-system-server.herokuapp.com", port: "443", secure: true, key: "peerjs"});
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
});


function turn() {
    if (document.getElementById("turn").classList.contains("hidden")) {
        document.getElementById("turn").classList.toggle("hidden")
        document.getElementById("in-queue").classList.toggle("hidden")
        yourturn.play()
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
    leave.play()
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
        // for now just switch to queue screen
        document.getElementById("join-queue").classList.toggle("hidden")
        document.getElementById("in-queue").classList.toggle("hidden")
        join.play()
    })

    // if connection gets closed leave
    conn.on('close', function() {
        // leave queue
        leave.play()
        setTimeout(() => {window.location.href = "index.html"}, 1500)
    })

    conn.on('data', function(data) {
        console.log(data)
        document.getElementById("current-position").innerHTML = "Current Position: " + data

        if (data.startsWith("1/")) {
            turn()
        }

        if (data.startsWith("kicked")) {
            // leave queue
            kicked = true
            leave.play()
            setTimeout(() => {window.location.href = "index.html"}, 1500)
        }
    })
}

window.onbeforeunload = function(){
    // Do something
    if (!kicked) {
        conn.send("leaving");
    }
}

