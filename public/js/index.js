// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//handles user auth
firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        if (user.emailVerified) {
            document.getElementById('loggedInUserId').innerText = user.email;

            $('.UserIsFarmer').show();
            $('.NotAlreadyRegistered').hide();
        }
        else {
            confirm('You need to verify your email before accessing this feature !!!');
            window.location.replace("login.html");
        }
    }
    else {
        $('.UserIsFarmer').hide();
        $('.NotAlreadyRegistered').show();

    }
});

//handles the logic for logout
function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.location.replace("login.html");
    }).catch(function (error) {
        // An error happened.
        alert(error.message);
    });
}

//loading of nft starts here
var itemsInMarketPlace = [];
var ref = firebase.database().ref('Company');

ref.once('value', function (snap) {
    snap.forEach(function (childData) {
        var item = {
            images: childData.val().image,
            latitude: childData.val().latitude,
            longitude: childData.val().longitude
        }
        itemsInMarketPlace.push(item);
    })
    var j = 0;
    for (var i = 0; i <= itemsInMarketPlace.length / 3; ++i) {
        let childDiv = "";
        let content = "";
        for (let x = 0; x < 3 && j < itemsInMarketPlace.length; ++x, ++j) {
            childDiv += `
                            <div class="w3-third img-thumbnail w3-container w3-margin-bottom"><img src="${itemsInMarketPlace[j].images}" alt="Norway" style="width:100%" class="w3-hover-opacity">
                                <div class="w3-container w3-white"">
                                    <p><strong>Carbon Emission : </strong></p>
                                    <span>Longitude: <strong>${itemsInMarketPlace[j].longitude} </strong></span>
                                    <span>Latitude: <strong>${itemsInMarketPlace[j].latitude} </strong></span>
                                    <div>
                                        <p style="float:left"><strong>Price : </strong></p>
                                         <button type="button" class="btn btn-primary buyNowNftIndex" style="float:right;margin-bottom:10px; font-size:12px;">Buy Now</button>
                                    </div>
                                 </div>
                            </div>`
        }
        content = `<div class="w3-row-padding">` + childDiv + `</div>`;
        document.getElementById('main-div').innerHTML += content;
    }
});

//Event handler for buy nft
$(document).on('click', '.buyNowNftIndex', function () {
    alert('We are working hard to make it work!!!');
});