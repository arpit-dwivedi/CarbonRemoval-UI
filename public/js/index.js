$(function () {
    $("#includedContent").load("navBarHeader.html");
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

//handles user auth
firebase.auth().onAuthStateChanged(function (user) {
    if (isMetaMaskInstalled) {
        ethereum.request({ method: 'eth_accounts' }).then(function (accounts) {
            document.getElementById('loadWalletAccount').innerText = accounts[0] || 'Connect Wallet';
        });
    }
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

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
    window.location.href = "index.html";
    $('#loaderDivModal').show();
    document.getElementById('resultTextMintNft').textContent = '';
}

const web3 = AlchemyWeb3.createAlchemyWeb3("https://eth-ropsten.alchemyapi.io/v2/qRiwHS9t7GVkOSDQJCXocuGu84EsYVwZ");

const callContractForLoading = () => {

    fetch("./contractsData/Marketplace.json")
        .then(response => {
            return response.json();
        })
        .then(marketPlaceAbi => {

            fetch("./contractsData/Marketplace-address.json")
                .then(response => {
                    return response.json();
                })
                .then(marketPlaceContractAddress => {
                    fetch("./contractsData/NFT.json")
                        .then(response => {
                            return response.json();
                        })
                        .then(nftAbi => {

                            fetch("./contractsData/NFT-address.json")
                                .then(response => {
                                    return response.json();
                                })
                                .then(nftContractAddress => {
                                    loadContractData(nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress);
                                });
                        });
                });
        });

};


const loadContractData = (nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress) => {

    const nft = new web3.eth.Contract(nftAbi.abi, nftContractAddress.address);

    const marketPlace = new web3.eth.Contract(marketPlaceAbi.abi, marketPlaceContractAddress.address);

    loadMarketplaceData(nft, nftAbi, nftContractAddress, marketPlace, marketPlaceAbi, marketPlaceContractAddress);

    //Event handler for buy nft
    $(document).on('click', '.buyNowNftIndex', function () {

        var dataId = $(this).data("id").split(" ");

        var itemId = dataId[0];
        var totalPrice = dataId[1];

        //console.log(itemId, totalPrice);
        if (isMetaMaskInstalled) {
            ethereum.request({ method: 'eth_accounts' }).then(function (accounts) {
                if (accounts[0]) {
                    document.getElementById("myModal").style.display = "block";

                    marketPlace.methods.purchaseItem(itemId).send({ from: accounts[0], value: totalPrice }).then(function (response) {
                        $('#loaderDivModal').hide();
                        document.getElementById('resultTextMintNft').textContent = response;
                        //console.log(response);
                    }).catch(error => {
                        $('#loaderDivModal').hide();
                        document.getElementById('resultTextMintNft').textContent = error.message;
                    });
                }
                else {
                    alert("Please connect to the Wallet!");
                    window.location.replace("connectMetamask.html");
                }


            }).catch(error => {
                $('#loaderDivModal').hide();
                document.getElementById('resultTextMintNft').textContent = error.message;
            });
        }


    });
};

const loadMarketplaceData = (nft, nftAbi, nftContractAddress, marketPlace, marketPlaceAbi, marketPlaceContractAddress) => {
    let items = []

    if (isMetaMaskInstalled) {

        ethereum.request({ method: 'eth_accounts' }).then(function (accounts) {
            if (accounts[0]) {
                marketPlace.methods.itemCount().call().then(function (itemCount) {
                    //console.log(itemCount);
                    if (itemCount > 0) {
                        for (let i = 1; i <= itemCount; i++) {
                            marketPlace.methods.items(i).call().then(function (item) {
                                //console.log(item);
                                if (!item.sold && item?.seller && item.seller.toLowerCase() != accounts[0]?.toLowerCase()) {
                                    // get uri url from nft contract

                                    nft.methods.tokenURI(item.tokenId).call().then(uri => {
                                        fetch(uri)
                                            .then(response => {
                                                return response.json();
                                            })
                                            .then(metadata => {
                                                //console.log(metadata);

                                                marketPlace.methods.getTotalPrice(item.itemId).call().then(function (totalPrice) {
                                                    //console.log(totalPrice);
                                                    items.push({
                                                        totalPrice,
                                                        itemId: item.itemId,
                                                        seller: item.seller,
                                                        name: metadata.name,
                                                        location: metadata.geocodedLocation,
                                                        image: metadata.image
                                                    })
                                                    console.log(items);

                                                    loadNftIntoMarketPlace(items[items.length - 1], items.length - 1);

                                                });
                                            });
                                    });
                                }
                                else {
                                    document.getElementById('loaderDiv').hidden = true;
                                    document.getElementById('textInfoDiv').hidden = false;
                                }

                            });
                        }

                    }
                    else {
                        document.getElementById('loaderDiv').hidden = true;
                        document.getElementById('textInfoDiv').hidden = false;
                    }

                });

            }

            else {
                alert("Please connect to the Wallet!");
                window.location.replace("connectMetamask.html");
            }

        });
    }
    else {
        alert("Please connect to the Wallet!");
        window.location.replace("connectMetamask.html");
    }


};

function loadNftIntoMarketPlace(item, j) {
    var childDiv = `<div class="card col-md-3 col-sm-3" style="margin:5px;">
                      <img class="img-fluid img-thumbnail" src="${item.image}" alt="Card image cap">
                      <div class="card-body">
                        <h5 class="card-title">Carbon Emission : ${item.itemId}</h5>
                        <p class="card-text">Longitude: <strong>${item.location.longitude}  </strong> Latitude: <strong>${item.location.latitude} </strong></p>
                        <p class="card-text">Price :<strong>${item.totalPrice} </strong></p>
                        <button type="button" class="btn btn-primary buyNowNftIndex" data-id="${item.itemId} ${item.totalPrice}" style="float:right;margin-bottom:10px; font-size:12px;">Buy Now</button>
                      </div>
                    </div>`;

    document.getElementById('bodyForCards').innerHTML += childDiv;
    document.getElementById('loaderDiv').hidden = true;
}

//Call the initiatie process for loading all NFT
callContractForLoading();
