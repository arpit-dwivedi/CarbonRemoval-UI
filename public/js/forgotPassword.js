// Initialize Firebase
firebase.initializeApp(firebaseConfig);



function forgot() {
	var auth = firebase.auth();
	var emailAddress = document.getElementById('exampleInputEmail').value;

	auth.sendPasswordResetEmail(emailAddress).then(function () {
		// Email sent.
		alert("Please check your reset password Email Sent Successfully...");
		window.location.replace('login.html');
	}).catch(function (error) {
		// An error happened.
		window.location.replace('404.html');
	});
}