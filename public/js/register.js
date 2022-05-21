// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var table = $('#dataTable').DataTable();

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
const currentdate = new Date();
const date = new Date((currentdate.getMonth() + 1) +
  "/" +
  currentdate.getDate() +
  "/" +
  currentdate.getFullYear());

var numberOfActiveJobs = 0,
  totalJobs = 0;

ref.once('value', function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    var applyingDateFrom = new Date(childData['applyDateFrom']);
    var applyingDateTo = new Date(childData['applyDateTo']);

    if (date.getTime() < applyingDateTo.getTime() && date.getTime() > applyingDateFrom.getTime()) {
      numberOfActiveJobs = numberOfActiveJobs + 1;
    }
    totalJobs = totalJobs + 1;
  });
  document.getElementById("activeJobs").innerHTML = numberOfActiveJobs;
  document.getElementById("inActiveJobs").innerHTML = totalJobs - numberOfActiveJobs;
});



function logout() {
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    window.location.replace("login.html");
  }).catch(function (error) {
    // An error happened.
    window.location.replace("404.html");
  });
}

var activeJobAfterClick = document.getElementById('activeJobAfterClick');
var inActiveJobAfterClick = document.getElementById('inActiveJobAfterClick');
var blockedUserAfterClick = document.getElementById('blockedUserAfterClick');
var pendingRequestsAfterClick = document.getElementById('pendingRequestsAfterClick');

function activeJobs() {
  table.clear().draw();
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
      var applyingDateFromDate = new Date(childData['applyDateFrom']);
      var applyingDateToDate = new Date(childData['applyDateTo']);

      if (date.getTime() < applyingDateToDate.getTime() && date.getTime() > applyingDateFromDate.getTime()) {
        var dataSet = [key, jobTitle, requiredSkills, jobCTC, applyingDateFrom, applyingDateTo];

        table.row.add(dataSet).draw();
      }
    });
  });

  document.getElementById('information').style.display = "block";
  activeJobAfterClick.classList.add("selected");
  inActiveJobAfterClick.classList.remove("selected");
  pendingRequestsAfterClick.classList.remove("selected");
  blockedUserAfterClick.classList.remove("selected");
}

function inActiveJobs() {
  table.clear().draw();
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
      var applyingDateFromDate = new Date(childData['applyDateFrom']);
      var applyingDateToDate = new Date(childData['applyDateTo']);

      if (date.getTime() < applyingDateToDate.getTime() && date.getTime() > applyingDateFromDate.getTime()) {

      } else {
        var dataSet = [key, jobTitle, requiredSkills, jobCTC, applyingDateFrom, applyingDateTo];
        table.row.add(dataSet).draw();
      }
    });
  });
  document.getElementById('information').style.display = "block";

  inActiveJobAfterClick.classList.add("selected");
  activeJobAfterClick.classList.remove("selected");
  pendingRequestsAfterClick.classList.remove("selected");
  blockedUserAfterClick.classList.remove("selected");
}

function users() {
  document.getElementById('information').style.display = "none";
  activeJobAfterClick.classList.remove("selected");
  inActiveJobAfterClick.classList.remove("selected");
  blockedUserAfterClick.classList.add("selected");
  pendingRequestsAfterClick.classList.remove("selected");

}

function pendingRequests() {
  activeJobAfterClick.classList.remove("selected");
  inActiveJobAfterClick.classList.remove("selected");
  blockedUserAfterClick.classList.remove("selected");
  pendingRequestsAfterClick.classList.add("selected");
  document.getElementById('information').style.display = "none";

}