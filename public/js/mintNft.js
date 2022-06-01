firebase.initializeApp(firebaseConfig);

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

$(function () {
    $("#includedContent").load("navBarHeader.html");
});

firebase.auth().onAuthStateChanged(function (user) {
    if (isMetaMaskInstalled) {
        ethereum.request({ method: 'eth_accounts' }).then(function (accounts) {
            document.getElementById('loadWalletAccount').innerText = accounts[0] || 'Connect Wallet';
            if (!accounts[0]) {
                alert("Please connect to the Wallet!");
                window.location.replace("connectMetamask.html");
            }
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
            window.location.replace("index.html");
        }
    } else {
        confirm('You need to be logged in to perform this activity !!!');
        window.location.replace("index.html");
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

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
    window.location.href = "mintNft.html";
    $('#loaderDiv').show();
    document.getElementById('resultTextMintNft').textContent = '';
}


var database = firebase.database();
var ref = database.ref("MintNFT");

function mintNft() {
    //console.log("-------------")
    const mintNFTForm = document.querySelector("#mintNFT_form");
    const nftTitle = mintNFTForm["nftTitle"].value;
    const longitude = mintNFTForm["longitude"].value;
    const latitude = mintNFTForm["latitude"].value;
    const image = mintNFTForm["image"].value;
    const price = mintNFTForm["price"].value;

    if (
        nftTitle != "" &&
        longitude != "" &&
        latitude != "" &&
        image != "" &&
        price != ""
    ) {
        var data = {
            geocodedLocation: {
                latitude: latitude,
                longitude: longitude
            },
            image: '',
            name: nftTitle,

        };

        document.getElementById("myModal").style.display = "block";
        
        readFile(data, price);
    } else {
        alert("Fill in all the places to post...");
    }
}

function readFile(data, price) {
    //Gets files from document element
    var files = document.getElementById('image').files;
    //Selects first File and assigns it to file
    var file = files[0];

    //console.log(files, file);

    if (file.type == "image/jpeg") {
        //console.log("file is okay");
        callPinataIpfs(file, data, price);

    }
    else {
        alert('Please select img file only!!!');
    }
}

const callPinataIpfs = (file, data, price) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiOWEwYmJlYy1hOTdkLTQ1N2YtOTQ5NS1lMjkyN2Q2ODU1ZDMiLCJlbWFpbCI6ImFzaHNpaHM0MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlfSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODk2MjcwZjAyZmM3ZWZhNGJjMmEiLCJzY29wZWRLZXlTZWNyZXQiOiJiMmJhNWFjNDQwNGY0NDgzNGYyZWEzZTI3ZjVjNDgwNWIwMmEzZjQ5ZDAxYzQ1ZDFhMzYzYTZkMGY3ZjE4YWE5IiwiaWF0IjoxNjUzMjQyMDg0fQ.hhupKEvtdxZAyZ2O7KM4NSL9lrUPcy6F5_eB_9EZBbY");

    var formdata = new FormData();
    formdata.append("file", file);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", requestOptions)
        .then(response => response.json())
        .then(result => {
            //console.log(result);
            if (!result.isDuplicate) {
                data.image = "https://gateway.pinata.cloud/ipfs/" + result.IpfsHash;
                uploadPinataImageWithMetaDeta(data, price);
            }
            else {
                $('#loaderDiv').hide();
                document.getElementById('resultTextMintNft').textContent='Please use different image as this  already being used!!!';
            }

        })
        .catch(error => {
            //console.log('error', error)
        });
}

const uploadPinataImageWithMetaDeta = (data, price) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiOWEwYmJlYy1hOTdkLTQ1N2YtOTQ5NS1lMjkyN2Q2ODU1ZDMiLCJlbWFpbCI6ImFzaHNpaHM0MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlfSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODk2MjcwZjAyZmM3ZWZhNGJjMmEiLCJzY29wZWRLZXlTZWNyZXQiOiJiMmJhNWFjNDQwNGY0NDgzNGYyZWEzZTI3ZjVjNDgwNWIwMmEzZjQ5ZDAxYzQ1ZDFhMzYzYTZkMGY3ZjE4YWE5IiwiaWF0IjoxNjUzMjQyMDg0fQ.hhupKEvtdxZAyZ2O7KM4NSL9lrUPcy6F5_eB_9EZBbY");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.isDuplicate) {
                callContractForLoading("https://gateway.pinata.cloud/ipfs/" + result.IpfsHash, price)
            }
            else {
                $('#loaderDiv').hide();
                document.getElementById('resultTextMintNft').textContent = 'Metadeta already Exist, please provide different to proceed!!!';
            }
        })
        .catch(error => console.log('error', error));
}

const web3 = AlchemyWeb3.createAlchemyWeb3("https://eth-ropsten.alchemyapi.io/v2/qRiwHS9t7GVkOSDQJCXocuGu84EsYVwZ");

const callContractForLoading = (uri, price) => {

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
                                    loadContractData(nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress, uri, price);
                                });
                        });
                });
        });

};

const loadContractData = (nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress, uri, price) => {

    const nft = new web3.eth.Contract(nftAbi.abi, nftContractAddress.address);

    const marketPlace = new web3.eth.Contract(marketPlaceAbi.abi, marketPlaceContractAddress.address);

    if (isMetaMaskInstalled) {

        ethereum.request({ method: 'eth_accounts' }).then(function (accounts) {
            //console.log(accounts[0], uri);
            minNft(accounts[0], nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress, uri, nft, marketPlace, price);
        });
    }


};

const minNft = (account, nftAbi, nftContractAddress, marketPlaceAbi, marketPlaceContractAddress, uri, nft, marketPlace, price) => {
    nft.methods.mint(uri).send({ from: account }).then(function (result) {
        //console.log(result);

        nft.methods.tokenCount().call().then(id => {
            //console.log("tokenCount " + id)
            nft.methods.setApprovalForAll(marketPlaceContractAddress.address, true).send({ from: account }).then(function (result) {
                //console.log("result : ");
                //console.log(result);
                const listingPrice = web3.utils.toWei(price);

                marketPlace.methods.makeItem(nftContractAddress.address, id, listingPrice).send({ from: account }).then(function (data) {
                    $('#loaderDiv').hide();

                    document.getElementById('resultTextMintNft').textContent = 'NFT Minted Successfully';
                }).catch(error => {
                    $('#loaderDiv').hide();
                    document.getElementById('resultTextMintNft').textContent = error.message;
                    console.log(error.message)
                });

            });
        });
    }).catch(error => {
        $('#loaderDiv').hide();
        document.getElementById('resultTextMintNft').textContent = error.message;
        console.log(error.message)
    });;

};
