firebase.initializeApp(firebaseConfig);

// Call the dataTables jQuery plugin
// $(document).ready(function() {
//   $('#dataTable').DataTable();
// });
var table;
$(document).ready(function () {
  table = $("#dataTable").DataTable({
    "columnDefs": [{
      "targets": -1,
      "data": null,
      "render": function (data, type, row, meta) {
        if (data[4] == true) {
          return '<button type="button" id="unblockBtn" class="btn-unblock btn btn-success btn-sm">Unblock</button>';
        } else {
          return '<button type="button" id="blockBtn" class="btn-block btn btn-danger btn-sm">Block</button>';
        }



        //  var uid = data[0];
        //  var database = firebase.database();
        //  var ref = database.ref("Blocked");
        //  ref.orderByChild('uid').startAt(uid).endAt(uid).once('value', function (snap) {
        //    // fetching email from database 
        //    var childData = snap.val();
        //    var childKey;
        //    for (x in childData) {
        //      childKey = x;
        //      childData = childData[x];
        //    }
        //    if (childData != null) {
        //      if (childData['block'] == true) {
        //        return '<button type="button" id="unblockBtn" class="btn-unblock btn btn-success btn-sm">Unblock</button>';
        //      } else {
        //        return '<button type="button" id="blockBtn" class="btn-block btn btn-danger btn-sm">Block</button>';
        //      }
        //    } else {
        //      return '<button type="button" id="blockBtn" class="btn-block btn btn-danger btn-sm">Block</button>';
        //    }

        //  });
      }
    }]
  });
  // Handle click on "View" button
  $("#dataTable tbody").on("click", ".btn-block", function (e) {
    var data = table.row($(this).parents("tr")).data();

    var uid = data[0];
    var database = firebase.database();
    var ref = database.ref("Users/" + uid);

    var block = true;

    var data = {
      block: block
    };

    ref.once('value', function (snap) {
      // fetching email from database 
      var childData = snap.val();
      if (childData['block'] != null) {
        ref.update(data);
      } else {
        ref.update(data);
      }
      window.location.reload();
    });

  });

  // Handle click on "Delete" button
  $("#dataTable tbody").on("click", ".btn-unblock", function (e) {
    var data = table.row($(this).parents("tr")).data();

    var uid = data[0];
    var block = false;
    var data = {
      block: block
    };
    var database = firebase.database();

    var ref = database.ref("Users/" + uid);
    ref.once('value', function (snap) {
      // fetching email from database 
      var childData = snap.val();
      if (childData['block'] != null) {
        ref.update(data);
      } else {
        ref.update(data);
      }
      window.location.reload();
    });
  });
});

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
var ref = database.ref("Users");

ref.once("value", function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // ...
    var key = childKey;
    var name = childData["Name"];
    var email = childData["Email"];
    var phoneNumber = childData["Phone Number"];
    var block = childData['block'];
    if (phoneNumber == undefined) {
      phoneNumber = "NA";
    }
    var dataSet = [key, name, email, phoneNumber, block];
    table.row.add(dataSet).draw();
  });
});