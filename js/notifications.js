/*

joinQueue.js
----------------
handles all notfications because my brain cant handle it all in one script

*/

// if permission is default, request permission after 200ms to allow the page to load
if (Notification.permission == "default") {
	setTimeout(() => {
		alert("To be notified when it's your turn, allow notifications!")
		Notification.requestPermission()	
	}, 200)
}


// send notification that its your turn, or the provided text
function sendNotification(text="It's your turn!") {
	new Notification(text, {requireInteraction: true})
}