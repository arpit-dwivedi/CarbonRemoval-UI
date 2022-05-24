// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref("Farmer");

function register() {
    const signUpForm = document.querySelector("#signUp_form");
    const email = signUpForm["exampleInputEmail"].value;
    const password = signUpForm["exampleInputPassword"].value;
    const phoneNo = signUpForm["examplePhoneNo"].value;
    const adharNo = signUpForm["exampleAdharNo"].value;
    const address = signUpForm["exampleAddress"].value;
    const name =
        signUpForm["exampleFirstName"].value +
        " " +
        signUpForm["exampleLastName"].value;
    var userCreateds = true;



    // if (userCreateds && email != "" && password != "") {
    if (email != "" && password != "") {
        // checking if the user is allowed to register (start of ref)
        ref.orderByChild('EmailId').startAt(email).endAt(email).once('value', function (snap) {
            // fetching email from database 
            var childData = snap.val();
            for (x in childData) {
                childData = childData[x];
            }
            console.log(childData);
            if (childData == null) {
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

                if (userCreateds) {
                    // onAuthStateChanged starts here...
                    firebase.auth().onAuthStateChanged(function (user) {
                        alert("Registration Successfull...");
                        if (user) {
                            ref.push({
                                FullName: name,
                                EmailId: email,
                                PhoneNumber: phoneNo,
                                Address: address,
                                AdharNo: adharNo
                            });
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
                else {
                    window.location.reload();
                }
            }
            else {
                alert("You are already registered !!!");
                window.location.href = "login.html";
            }
        });
        // end of ref

    }
}

//function google() {
//  firebase.auth().onAuthStateChanged(function (user) {
//    if (user) {
//      // User is signed in.
//      window.location.replace("register.html");
//    } else {
//      // No user is signed in.
//      var provider = new firebase.auth.GoogleAuthProvider();
//      firebase
//        .auth()
//        .signInWithPopup(provider)
//        .then(function (result) {
//          // This gives you a Google Access Token. You can use it to access the Google API.
//          var token = result.credential.accessToken;
//          // The signed-in user info.
//          var user = result.user;
//          // ...
//        })
//        .catch(function (error) {
//          // Handle Errors here.
//          var errorCode = error.code;
//          var errorMessage = error.message;
//          // The email of the user's account used.
//          var email = error.email;
//          // The firebase.auth.AuthCredential type that was used.
//          var credential = error.credential;
//          // ...
//        });
//    }
//  });
//}

//function facebook() {
//  firebase.auth().onAuthStateChanged(function (user) {
//    if (user) {
//      // User is signed in.
//      window.location.replace("register.html");
//    } else {
//      // No user is signed in.
//      // alert('Please try Signing Again...');

//      var provider = new firebase.auth.FacebookAuthProvider();
//      firebase
//        .auth()
//        .signInWithPopup(provider)
//        .then(function (result) {
//          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//          var token = result.credential.accessToken;
//          // The signed-in user info.
//          var user = result.user;
//          // ...
//        })
//        .catch(function (error) {
//          // Handle Errors here.
//          var errorCode = error.code;
//          var errorMessage = error.message;
//          // The email of the user's account used.
//          var email = error.email;
//          // The firebase.auth.AuthCredential type that was used.
//          var credential = error.credential;
//          // ...
//        });
//    }
//  });
//}