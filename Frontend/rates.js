// JavaScript to update the tooltip value

//"Black Box" function, not implemented yet. 
//This block needs to get wallets history info and build bitcion predictions according
// to this info by AI. 
//On this level we don't do implemention to this, so it creates random prediction.
 
document.addEventListener('DOMContentLoaded', () => {
const circles = document.getElementById('rate_circles');
const labels = document.getElementById('rate_labels');
const cirle = circles.children[getRandomNumber()].children[0];
console.log(cirle);


cirle.classList.remove("hidden");


});

function getRandomNumber() {
    return Math.floor(Math.random() * 5);
}