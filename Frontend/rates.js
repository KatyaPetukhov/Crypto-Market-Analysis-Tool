// JavaScript to update the tooltip value

//"Black Box" function, not implemented yet. 
//This block needs to get wallets history info and build Bitcoin predictions according
// to this info by AI. 
//On this level we don't do implementation to this, so it creates random prediction.
const BACKEND_URL = 'https://crypto-market-analysis-tool-f12d66bb7184.herokuapp.com'
fetch(`${BACKEND_URL}/get-wallet-data`)
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((err) => console.log(err))

const setData = (data) => {
    // TODO: Implement AI prediction...
}

document.addEventListener('DOMContentLoaded', () => {
    const circles = document.getElementById('rate_circles');
    const labels = document.getElementById('rate_labels');
    const circle = circles.children[getRandomNumber()].children[0];
    console.log(circle);
    circle.classList.remove("hidden");
});

function getRandomNumber() {
    return Math.floor(Math.random() * 5);
}