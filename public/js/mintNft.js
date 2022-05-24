firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        if (user.emailVerified) {
            document.getElementById('loggedInUserId').innerText = user.email;

            $('.UserIsFarmer').show();
            $('.NotAlreadyRegistered').hide();
        }
        else {
            confirm('You need to verify your email before accessing this feature !!!');
            window.location.replace("index.html");
        }
    } else {
        confirm('You need to be logged in to perform this activity !!!');
        window.location.replace("index.html");
    }
});

// Get a reference to the database service
var database = firebase.database();
var ref = database.ref("MintNFT");

function mintNft() {
    console.log("-------------")
    const mintNFTForm = document.querySelector("#mintNFT_form");
    const nftTitle = mintNFTForm["nftTitle"].value;
    const longitude = mintNFTForm["longitude"].value;
    const latitude = mintNFTForm["latitude"].value;
    const image = mintNFTForm["image"].value;
    
    if (
        nftTitle != "" &&
        longitude != "" &&
        latitude != "" &&
        image != ""
    ) {
        var data = {
            nftTitle: nftTitle,
            longitude: longitude,
            latitude: latitude,
            image: image
        };
        ref.push(data);
        window.location.replace("mintNft.html");
    } else {
        alert("Fill in all the places to post...");
    }
}