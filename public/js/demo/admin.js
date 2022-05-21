firebase.initializeApp(firebaseConfig);

// Call the dataTables jQuery plugin
// $(document).ready(function() {
//   $('#dataTable').DataTable();
// });
var table = $('#dataTable').DataTable();
firebase.auth().onAuthStateChanged(function (user) {
  if (user != null) {
    document.getElementById("userEmailId").innerHTML = user.email;
    document.getElementById("userProfile").src = user.photoURL;
  } else {
    window.location.replace("index.html");
  }
});


// var rootRef = firebase.database().ref("Users");


var database = firebase.database();
var ref = database.ref("admin");

ref.once('value', function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // ...
    var key = childKey;
    var name = childData['userName'];
    var email = childData['email'];
    var dataSet = [key, name, email];
    table.row.add(dataSet).draw();
  });
});