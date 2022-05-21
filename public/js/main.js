const admin = require(['./node_modules/firebase-admin'], function (params) {

});
const serviceAccount = require(["./serviceAccountKey.json"], function (params) {

});
const data = require(["./data.json"], function (params) {

});
const collectionKey = "students"; //name of the collection
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://placement-success.firebaseio.com/"
});
console.log(data);
const firestore = admin.firestore();
const settings = {
    timestampsInSnapshots: true
};
firestore.settings(settings);
if (data && (typeof data === "object")) {
    Object.keys(data).forEach(docKey => {
        firestore.collection(collectionKey).doc(docKey).set(data[docKey]).then((res) => {
            console.log("Document " + docKey + " successfully written!");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    });
}