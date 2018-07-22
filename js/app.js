
/* Defining variables */

const pics = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const deck = document.querySelector(".deck");
const cards = document.getElementsByClassName('card');
const images = document.querySelectorAll(".card i");
const restart = document.querySelector(".restart");
const stars = document.querySelector(".stars");
const timer = document.querySelector(".timer");
const modal = document.querySelector(".modal-window");
const close = document.querySelector(".close-modal");
const play = document.querySelector(".play");
const resultScore = document.querySelector(".modal-score");
const resultTime = document.querySelector(".modal-time");
let timeout;
let moves = 0;
let opened = [];
let isPlaying = true;

// Start game

function startGame() {
    moves = 0;
    opened = [];
    isPlaying = true;
    deletePictureClasses(images);
    showMoves();
    clearDeck(cards);
    shuffleCards(pics);
    createRating();
    clearTimer();
    startTimer();
}

// Game is over */

function gameOver() {
    modal.classList.add("shown");
    resultScore.innerHTML = stars.innerHTML;
    resultTime.innerHTML = timer.innerHTML;
    clearTimer();
}

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//Shuffle cards with shuffle function and add classes from the array to the cards

function shuffleCards(array) {
    let randomArray = shuffle(array);
    for (let i = 0; i < images.length; i++) {
        images[i].classList.add(randomArray[i]);
    }
}

//Show card

function displayCard(card) {
    if (card.classList.contains("closed")) {
        card.classList.remove("closed");
        card.classList.add("show", "open");
    }
}

//Close card

function closeCards(cards) {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains("open")) {
            cards[i].classList.remove("show", "open");
            cards[i].classList.add("closed");
        }
    }
}

//Adds card to the list of opened cards

function addOpen(card) {
    if(card.classList.contains("card") && !card.classList.contains("match")) {
        opened.push(card);
    }
}

//Clear the list of opened card

function clearOpened() {
    opened = [];
}

//Adds 'match' class to the cards that were matched

function match(cards) {
    for (let i =0; i < cards.length; i++) {
        cards[i].classList.remove("show", "open");
        cards[i].classList.add("match");
    }
}

//Shows moves counter at the beginning of the game

function showMoves() {
    document.querySelector(".moves").innerHTML = moves;
}

//Checks if there are some closed cards rest

function checkClosed(){
    let closed = document.getElementsByClassName("closed");
    if (closed.length === 0 ) {
        return true;
    }
}

//Removes all classes from the cards and adds 'closes' class to all of them

function clearDeck(cards) {
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("show", "open", "match");
        cards[i].classList.add("closed");
    }
}

//Checks if it is necessary to change the rating and removes one star if necessary

function refreshRating() {
    let lastStar = stars.lastElementChild;
    if (moves == 25 || moves == 30) {
        stars.removeChild(lastStar);
    }
}

//Clears old score and creates new score with three stars

function createRating() {
    let rating = stars.children;
    for (let i = rating.length - 1; i >= 0; i--) {
        stars.removeChild(rating[i]);
    }

    for (let i = 0; i < 3; i++){
        let star = document.createElement('li');
        star.innerHTML = '<i class="fa fa-star"></i>';
        stars.appendChild(star);
    }
}

//Starts timer at the beginning of the game

function startTimer() {
    let time = timer.innerHTML;
    let timeArr = time.split(":");
    let minutes = timeArr[0];
    let seconds = timeArr[1];
    seconds++;
    if (seconds == 60) {
        minutes++;
        seconds = 0;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
    }
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    timer.innerHTML = minutes + ":" + seconds;
    timeout = setTimeout(startTimer, 1000);
}

//Clears timer

function clearTimer() {
    clearTimeout(timeout);
    timer.innerHTML = "00:00";
}

//Closes modal window with congrats and scores

function closeModal() {
    modal.classList.remove("shown");
    startGame();
}

function deletePictureClasses(array) {
    for (i = 0; i < array.length; i++) {
        array[i].classList = '';
        array[i].classList.add("fa");
    }
}

//Adds event listener to the deck and watches what card was clicked

deck.addEventListener("click", function (event) {

    let target = event.target; // watches what card was clicked

    displayCard(target); // opens the card that was clicked
    addOpen(target); // adds the clicked card to the list of opened cards

    if ( (!target.classList.contains("match")) && ((opened.length > 1 && opened[0] !== target) || opened.length === 1) ) {
        moves++; // increment the counter of moves
        showMoves(); // changes new counter of moves on the screen
    }
    if (opened.length > 1 && opened[0] !== target) { // checks if there are already opened cards
        if (opened[opened.length - 1].innerHTML === opened[opened.length - 2].innerHTML) { // checks if the opened cards match and not the same card
            match(opened); // adds 'match' class to the opened cards if they  match
            clearOpened(); // clears the list of opened cards
            if (checkClosed() === true) { //checks if there are still closed cards
                isPlaying = false; // if there are not closed cards ends the game
                setTimeout(gameOver, 200);
            }
        } else {
            setTimeout( closeCards, 500, opened); //closes opened card if cards don't match
            clearOpened(); // clears the list of opened cards
        }
    }

    refreshRating(); // checks if it is necessary to change the rating and removes one star if necessary
});

restart.addEventListener("click", startGame); // adds event listener to the restart button

close.addEventListener("click", closeModal); // adds event listener to the button that closes modal window
play.addEventListener("click", closeModal); // adds event listener to the answer of the player

startGame(); // starts the game when the page opens



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
