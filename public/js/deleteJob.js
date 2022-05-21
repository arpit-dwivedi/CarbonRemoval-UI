firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
// var database = firebase.database();
// var ref = database.ref("Company");
firebase.auth().onAuthStateChanged(function (user) {
	if (user != null) {
		document.getElementById("userEmailId").innerHTML = user.email;
		document.getElementById("userProfile").src = user.photoURL;
	} else {
		window.location.replace("index.html");
	}
});



function deleteJob() {
	// body...
	const deleteJobForm = document.querySelector("#deleteJob_form");
	const jobKey = deleteJobForm["jobKey"].value.trim();
	if (jobKey) {
		firebase.database().ref("Company/" + jobKey).once('value', function (snap) {
			if (snap.val() != null) {
				document.getElementById("search").style.display = "none";

				var childData = snap.val();
				var key = jobKey;
				var jobTitle = childData['jobTitle'];
				var requiredSkills = childData['requiredSkills'];
				var jobCTC = childData['jobCtc'];
				var applyingDateFrom = childData['applyDateFrom'];
				var applyingDateTo = childData['applyDateTo'];
				var dataSet = [key, jobTitle, requiredSkills, jobCTC, applyingDateFrom, applyingDateTo];
				$("#myTable tbody").append(
					"<tr>" +
					"<td>" + dataSet[0] + "</td>" +
					"<td>" + dataSet[1] + "</td>" +
					"<td>" + dataSet[2] + "</td>" +
					"<td>" + dataSet[3] + "</td>" +
					"<td>" + dataSet[4] + "</td>" +
					"<td>" + dataSet[5] + "</td>" +
					"</tr>");
			} else {
				$("#myTable tbody").append(
					"<tr>" +
					"<td>Sorry, No Data Found</td>" +
					"</tr>");
				document.getElementById("delete").style.display = "none";
				document.getElementById("cancel").style.display = "none";
			}

			document.getElementById('information').style.display = "block";
		});
	} else {
		alert("Please Enter the key!!!");
	}
}

function cancel() {
	window.location.reload();
}

function deleteJobFromDb() {

	var t = confirm("Do you really want to Delete?");
	if (t == true) {
		const deleteJobForm = document.querySelector("#deleteJob_form");
		const jobKey = deleteJobForm["jobKey"].value.trim();
		firebase.database().ref("Company/" + jobKey).remove();
		window.location.reload();
	}
}