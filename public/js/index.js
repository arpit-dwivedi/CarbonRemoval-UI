// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref("admin");

console.log("I am running");

function register() {
  const signUpForm = document.querySelector("#signUp_form");
  const email = signUpForm["exampleInputEmail"].value;
  const password = signUpForm["exampleInputPassword"].value;
  const name =
    signUpForm["exampleFirstName"].value +
    " " +
    signUpForm["exampleLastName"].value;
  var userCreateds = true;



  // if (userCreateds && email != "" && password != "") {
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
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              alert(errorMessage);
              userCreateds = false;
              // ...
            });
          // onAuthStateChanged starts here...
          firebase.auth().onAuthStateChanged(function (user) {
            alert("Registration Successfull...");
            if (user) {
              // User is signed in.
              user.sendEmailVerification().then(function () {
                // Email sent.
                confirm('Verification Email sent...');
                window.location.href = "login.html";
              }).catch(function (error) {
                // An error happened.
                alert(error.message);
              });
            } else {
              // No user is signed in.
            }
          });
          // onAuthStateChanged ends
        }

      } else {
        alert("Please contact DBA at placementsuccess73@gmail.com");
        window.location.reload();
      }
    });
    // end of ref

  }
}

function google() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      window.location.replace("register.html");
    } else {
      // No user is signed in.
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }
  });
}

function facebook() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      window.location.replace("register.html");
    } else {
      // No user is signed in.
      // alert('Please try Signing Again...');

      var provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }
  });
}