// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref("admin");

function login() {
  const signInForm = document.querySelector('#signIn_form');
  const email = signInForm['exampleInputEmail'].value;
  const password = signInForm['exampleInputPassword'].value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
    // ...
    window.location.href.replace("login.html");
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user.emailVerified) {
      // User is signed in.
      if (email != "" && password != "") {
        // checking if the user is allowed to register (start of ref)
        ref.orderByChild('email').startAt(email).endAt(email).once('value', function (snap) {
          // fetching email from database 
          var childData = snap.val();
          for (x in childData) {
            childData = childData[x];
          }
          if (childData != null) {
            // storing data from database and verifying it from entered data
            var emailDb = childData['email'];
            var userNameDb = childData['userName'];
            if (email == emailDb) {
              window.location.replace("register.html");
            } else {
              alert("Sorry, you are not registered");
              window.location.reload();
            }
          } else {
            alert("Sorry, you are not registered!!!");
            window.location.reload();
          }
        });
      }

    } else {
      // No user is signed in.
      confirm('Please verify your Email and then try again...');
    }
  });
}