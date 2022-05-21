firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var ref = database.ref("Farmer");

var data = {
    All: "answer"
};
ref.push(data);
console.log();