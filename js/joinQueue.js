/*

joinQueue.js
----------------
designed to handle the networking for joining a queue as well as displaying relevant information

*/

var join = new Audio('assets/joinqueue.wav');
var leave = new Audio('assets/leavequeue.wav');
var yourturn = new Audio('assets/yourturn.wav');

function turn() {
    document.getElementById("turn").classList.toggle("hidden")
    document.getElementById("in-queue").classList.toggle("hidden")
    yourturn.play()
}

// when join queue button is pressed switch to queue page
document.getElementById("join-queue-button").addEventListener("click", () => {
    // for now just switch to queue screen
    document.getElementById("join-queue").classList.toggle("hidden")
    document.getElementById("in-queue").classList.toggle("hidden")
    join.play()
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
