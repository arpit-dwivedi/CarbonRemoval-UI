firebase.initializeApp(firebaseConfig);

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

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

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.location.replace("login.html");
    }).catch(function (error) {
        // An error happened.
        alert(error.message);
    });
}

// Get a reference to the database service
$(document).on('click', '.buyNowNftIndex', function () {
    alert('We are working hard to make it work!!!');
});


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

};

const loadMarketplaceData = async (nft, nftAbi, nftContractAddress, marketPlace, marketPlaceAbi, marketPlaceContractAddress) => {
    let items = []
    marketPlace.methods.itemCount().call().then(function (itemCount) {
        //console.log(itemCount);


        for (let i = 1; i <= itemCount; i++) {
            marketPlace.methods.items(i).call().then(function (item) {
                //console.log(item);

                if (!item.sold) {
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

                                    if (isMetaMaskInstalled) {
                                        ethereum.request({ method: 'eth_accounts' }).then(function (accounts) {
                                            if (item.buyer == accounts[0]) {
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

                                            }
                                            document.getElementById('loaderDiv').hidden = true;
                                            document.getElementById('textInfoDiv').hidden = false;

                                            // minNft(accounts[0], nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress, uri, nft, marketPlace, price);
                                        });
                                    }
                                    else {
                                        document.getElementById('loaderDiv').hidden = true;
                                        document.getElementById('textInfoDiv').hidden = false;
                                    }

                                });
                            });
                    });
                }
            });
        }

    });
};

function loadNftIntoMarketPlace(item, j) {
    var childDiv = `<div class="card col-md-3 col-sm-3" style="margin:5px;">
                      <img class="img-fluid img-thumbnail" src="${item.image}" alt="Card image cap">
                      <div class="card-body">
                        <h5 class="card-title">Carbon Emission : ${item.itemId}</h5>
                        <p class="card-text">Longitude: <strong>${item.location.longitude}  </strong> Latitude: <strong>${item.location.latitude} </strong></p>
                        <p class="card-text">Price :<strong>${item.totalPrice} </strong></p>
                        <button type="button" class="btn btn-primary buyNowNftIndex" style="float:right;margin-bottom:10px; font-size:12px;">Buy Now</button>
                      </div>
                    </div>`;

    document.getElementById('bodyForCards').innerHTML += childDiv;
    document.getElementById('loaderDiv').hidden = true;
}

//Call the initiatie process for loading all NFT
callContractForLoading();