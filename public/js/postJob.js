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
  if (user != null) {
    document.getElementById("userEmailId").innerHTML = user.email;
    document.getElementById("userProfile").src = user.photoURL;
  } else {
    window.location.replace("index.html");
  }
});


// Get a reference to the database service
var database = firebase.database();
var ref = database.ref("Company");

function postJob() {
  const postJobForm = document.querySelector("#postJob_form");
  const jobTitle = postJobForm["jobTitle"].value;
  const jobDescription = postJobForm["jobDescription"].value;
  const jobResponsibility = postJobForm["jobResponsibility"].value;
  const requiredSkills = postJobForm["requiredSkills"].value;
  const elegibilityCriteria = postJobForm["elegibilityCriteria"].value;
  const elegibleBranch = postJobForm["elegibleBranch"].value;
  const jobCtc = postJobForm["jobCtc"].value;
  const link = postJobForm["link"].value;
  const linkLogo = postJobForm["linkLogo"].value;
  const applyDateFrom = postJobForm["applyDateFrom"].value;
  const applyDateTo = postJobForm["applyDateTo"].value;

  const currentdate = new Date();
  const datetime =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  if (
    jobTitle != "" &&
    jobDescription != "" &&
    jobResponsibility != "" &&
    jobCtc != "" &&
    requiredSkills != "" &&
    elegibilityCriteria != "" &&
    elegibleBranch != "" &&
    applyDateFrom != "" &&
    applyDateTo != ""
  ) {
    var data = {
      jobTitle: jobTitle,
      jobDescription: jobDescription,
      jobResponsibility: jobResponsibility,
      requiredSkills: requiredSkills,
      elegibilityCriteria: elegibilityCriteria,
      elegibleBranch: elegibleBranch,
      jobCtc: jobCtc,
      applyDateFrom: applyDateFrom,
      applyDateTo: applyDateTo,
      linkLogo: linkLogo,
      link: link,
      datetime: datetime,
    };
    ref.push(data);
    window.location.replace("postjob.html");
  } else {
    alert("Fill in all the places to post...");
  }
}