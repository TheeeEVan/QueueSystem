/*

darkmode.js
----------------
darkmode.js is a simple script that toggles the darkmode class on the body element. also checks for system dark mode, and stores setting in cookies

*/

/* check for dark mode in cookies */
if (document.cookie.split("=")[0] == "dark-mode") {
	if (document.cookie.split("=")[1] == "1")
	{
		document.body.classList.toggle("dark-mode")
		document.getElementById("dark-mode-toggle").checked = "checked"
	}
}
/* checks if dark mode is on in os settings */
/* https://stackoverflow.com/a/57795495 */
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode on
	document.body.classList.toggle("dark-mode")
	document.getElementById("dark-mode-toggle").checked = "checked"
}

/* listen for user click on switch */
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
	document.body.classList.toggle("dark-mode")
	document.cookie = "dark-mode=" + (document.body.classList.contains("dark-mode") ? "1" : "0")
})