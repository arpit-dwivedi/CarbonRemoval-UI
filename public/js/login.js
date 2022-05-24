// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var ref = database.ref("Farmer");

function login() {
    const signInForm = document.querySelector('#signIn_form');
    const email = signInForm['exampleInputEmail'].value;
    const password = signInForm['exampleInputPassword'].value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        console.log('Success');
        firebase.auth().onAuthStateChanged(function (user) {
            if (user.emailVerified) {
                // User is signed in.
                if (email != "" && password != "") {
                    // checking if the user is allowed to register (start of ref)
                    ref.orderByChild('EmailId').startAt(email).endAt(email).once('value', function (snap) {
                        // fetching email from database 
                        var childData = snap.val();
                        for (x in childData) {
                            childData = childData[x];
                        }
                        if (childData != null) {
                            // storing data from database and verifying it from entered data
                            var emailDb = childData['EmailId'];

                            if (email == emailDb) {
                                window.location.replace("index.html");
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

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        window.location.reload();
    });
}