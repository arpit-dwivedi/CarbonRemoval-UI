$(function () {
  $("#applyDateFrom").datepicker({
    defaultDate: new Date(),
  });
});
$(function () {
  $("#applyDateTo").datepicker({
    defaultDate: new Date(),
  });
});

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
  // if (user != null) {
  //   document.getElementById("userEmailId").innerHTML = user.email;
  //   document.getElementById("userProfile").src = user.photoURL;
  // } else {
  //   window.location.replace("index.html");
  // }
});


// Get a reference to the database service
var database = firebase.database();
var ref = database.ref("MintNFT");

function postJob() {
  console.log("-------------")
  const mintNFTForm = document.querySelector("#mintNFT_form");
  const nftTitle = mintNFTForm["nftTitle"].value;
  const longitude = mintNFTForm["longitude"].value;
  const latitude = mintNFTForm["latitude"].value;
  const image = mintNFTForm["image"].value;
  // const elegibilityCriteria = postJobForm["elegibilityCriteria"].value;
  // const elegibleBranch = postJobForm["elegibleBranch"].value;
  // const jobCtc = postJobForm["jobCtc"].value;
  // const link = postJobForm["link"].value;
  // const linkLogo = postJobForm["linkLogo"].value;
  // const applyDateFrom = postJobForm["applyDateFrom"].value;
  // const applyDateTo = postJobForm["applyDateTo"].value;

  // const currentdate = new Date();
  // const datetime =
  //   currentdate.getDate() +
  //   "-" +
  //   (currentdate.getMonth() + 1) +
  //   "-" +
  //   currentdate.getFullYear() +
  //   " " +
  //   currentdate.getHours() +
  //   ":" +
  //   currentdate.getMinutes() +
  //   ":" +
  //   currentdate.getSeconds();

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
    window.location.replace("postjob.html");
  } else {
    alert("Fill in all the places to post...");
  }
}