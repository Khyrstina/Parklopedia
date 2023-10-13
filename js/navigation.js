const sideMenu = document.getElementById('mySidepanel');
const hamburgerMenuButton = document.getElementById('hamburgerMenu');

hamburgerMenuButton.addEventListener('click', () => {
  if (parseInt(sideMenu.style.width) < 5) {
    sideMenu.style.display = "flex";
    sideMenu.style.width = "fit-content";
  } else {
    sideMenu.style.width = "0";
    sideMenu.style.display = "none";
  }
});

/* function openNav() {
  document.getElementById("mySidepanel").style.width = "15rem";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
} */