/*

joinQueue.js
----------------
handles all notfications because my brain cant handle it all in one script

*/

// set notfication object


// if permission is default, request permission
if (Notification.permission == "default") {
	setTimeout(() => {
		alert("To be notified when it's your turn, allow notifications!")
		Notification.requestPermission()	
	}, 200)
}


// send notification that its your turn 
function sendNotification(text="It's your turn!") {
	new Notification(text, {requireInteraction: true})
}