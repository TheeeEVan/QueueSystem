/*

darkmode.js
----------------
darkmode.js is a simple script that toggles the darkmode class on the body element. also checks for system dark mode, and stores setting in cookies

*/

/* if dark mode is on set switch to on */
if (document.body.classList.contains("dark-mode")) {
	document.getElementById("dark-mode-toggle").checked = "checked"
}

/* listen for user click on switch */
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
	document.body.classList.toggle("dark-mode")
	document.cookie = "dark-mode=" + (document.body.classList.contains("dark-mode") ? "1" : "0")
})