/*

createQueue.js
----------------
createQueue.js is designed to handle all technical aspects of creating a queue

*/
document.getElementById("close-button").addEventListener('click', () => {
	document.getElementById("confirmation").classList.toggle("hidden")
})

document.getElementById("confirm-stay").addEventListener('click', () => {
	document.getElementById("confirmation").classList.toggle('hidden')
})

document.getElementById("confirm-close").addEventListener('click', () => {
	window.location.href = "index.html"
})