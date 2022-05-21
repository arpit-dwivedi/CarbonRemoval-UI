firebase.initializeApp(firebaseConfig);

// Call the dataTables jQuery plugin
// $(document).ready(function() {
//   $('#dataTable').DataTable();
// });
var table = $('#dataTable').DataTable();

// var rootRef = firebase.database().ref("Users");
firebase.auth().onAuthStateChanged(function (user) {
  if (user != null) {
    document.getElementById("userEmailId").innerHTML = user.email;
    document.getElementById("userProfile").src = user.photoURL;
  } else {
    window.location.replace("index.html");
  }
});



var database = firebase.database();
var ref = database.ref("Company");

ref.once('value', function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // ...
    var key = childKey;
    var jobTitle = childData['jobTitle'];
    var requiredSkills = childData['requiredSkills'];
    var jobCTC = childData['jobCtc'];
    var applyingDateFrom = childData['applyDateFrom'];
    var applyingDateTo = childData['applyDateTo'];
    var dataSet = [key, jobTitle, requiredSkills, jobCTC, applyingDateFrom, applyingDateTo];
    table.row.add(dataSet).draw();
  });
});