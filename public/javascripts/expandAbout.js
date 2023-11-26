const reqOne = document.getElementById("reqOne");
const reqTwo = document.getElementById("reqTwo");
const reqThree = document.getElementById("reqThree");
const reqFour = document.getElementById("reqFour");
const reqFive = document.getElementById("reqFive");
const reqSix = document.getElementById("reqSix");
const reqSeven = document.getElementById("reqSeven");

const reqDivOne = document.getElementById("reqDivOne");
const reqDivTwoA = document.getElementById("reqDivTwoA");
const reqDivTwoB = document.getElementById("reqDivTwoB");
const reqDivThree = document.getElementById("reqDivThree");
const reqDivFour = document.getElementById("reqDivFour");
const reqDivFive = document.getElementById("reqDivFive");
const reqDivSix = document.getElementById("reqDivSix");
const reqDivSeven = document.getElementById("reqDivSeven");

let divToExpand = "";

document.addEventListener("click", function (event) {
  switch (event.target.id) {
    case "reqOne":
      showDivs(reqDivOne);
      break;
    case "reqTwo":
      showDivs(reqDivTwoA);
      showDivs(reqDivTwoB);
      break;
    case "reqThree":
      showDivs(reqDivThree);
      break;
    case "reqFour":
      showDivs(reqDivFour);
      break;
    case "reqFive":
      showDivs(reqDivFive);
      break;
    case "reqSix":
      showDivs(reqDivSix);
      break;
    case "reqSeven":
      showDivs(reqDivSeven);
      break;
    default:
      break;
  }
});

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter" ) {
  switch (event.target.id) {
    case "reqOne":
      showDivs(reqDivOne);
      break;
    case "reqTwo":
      showDivs(reqDivTwoA);
      showDivs(reqDivTwoB);
      break;
    case "reqThree":
      showDivs(reqDivThree);
      break;
    case "reqFour":
      showDivs(reqDivFour);
      break;
    case "reqFive":
      showDivs(reqDivFive);
      break;
    case "reqSix":
      showDivs(reqDivSix);
      break;
    case "reqSeven":
      showDivs(reqDivSeven);
      break;
    default:
      break;
  }
  }
});

function showDivs(divToExpand) {
  if (divToExpand && divToExpand.style.display === "none") {
    divToExpand.style.display = "block";
  } else if (divToExpand) {
    divToExpand.style.display = "none";
  }
}
