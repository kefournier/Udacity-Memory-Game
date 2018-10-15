/* After much struggling, I decided to follow Matthew
Cranford's tutorial which was invaluable. However, some
of my functionality is still not working. I can't get my
clock to stop once all matches are found, and therefore
it also won't reset. Submitting as is, as I need to move
on to the next section in an effort to finish on time.
Any help you can provide with the code would be greatly
appreciated! Thank you! */



/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 let moves = 0;

 let clockOff = true;

 let time = 0; //will hold the incremented value of time

 let clockId;

 let matched = 0;

 const TOTAL_PAIRS = 8;

 //Modal tests
 time = 121;
 displayTime(); //2:01
 moves = 16;
 checkScore(); //2 Stars

 writeModalStats(); //write stats to modal
 toggleModal(); //open modal


 const deck = document.querySelector('.deck'); //created a variable to hold the cards, from parent .deck class

/*for each card in the 'shuffledCards' array, append this card
to the deck element*/

 function shuffleDeck() { //will shuffle the deck
     const cardsToShuffle = Array.from(document.querySelectorAll('.deck li')); //creates a new copied array from the array-like object (here it's a NodeList)
     const shuffledCards = shuffle(cardsToShuffle);
        for (card of shuffledCards) { //for each card in the shuffledCards array, append this card to the deck element
/*appendChild adds a specified node as a child node to its target - but deck doesn't
double in size because no new nodes are actually being added. The nodes are actually
referencing the original object and changing their order within the parent, thus
ending up with the same number of nodes*/
            deck.appendChild(card);
        }
 }
 shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) { //takes in an array parameter and returns that array shuffled
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) { //is this kind of like a bubble sort
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


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

let toggledCards = []; //creates array for toggledCards


 deck.addEventListener('click', event => { //creating an EventListener
     const clickTarget =  event.target;
     if (isClickValid(clickTarget)) {
         if (clockOff) { //valid click starts the time function and set's clockOff = false
             startClock();
             clockOff = false;
         }
     if (clickTarget.classList.contains('card')) { //if the clicked item of of the class card, toggle the card
         toggleCard(clickTarget); //shows the card
         addToggleCard(clickTarget); //adds the toggled card to the array
         if(toggledCards.length === 2) { //if two cards are toggled, check to see if they match
             checkForMatch(clickTarget);
             addMove();
             checkScore(); //need to call this function everytime I complete a move
         }
     }
 }
});


 function toggleCard(card) {
     card.classList.toggle('open');
     card.classList.toggle('show');
 }

 function addToggleCard(clickTarget) {
     toggledCards.push(clickTarget);
     console.log(toggledCards);
 }

 function checkForMatch() {
     if(
         toggledCards[0].firstElementChild.className ===
         toggledCards[1].firstElementChild.className
     ){
         toggledCards[0].classList.toggle('match');
         toggledCards[1].classList.toggle('match');
         toggledCards = [];
         matched++;
         if (matched === TOTAL_PAIRS) {
             gameOver();
         }
     } else {
         setTimeout(()=> { //delays card toggle long enough so you can see card face
         toggleCard(toggledCards[0]);
         toggleCard(toggledCards[1]);
         toggledCards = [];
     }, 1000);
 }
}

function isClickValid(clickTarget) { //checking that the target does NOT contain the class “match”


    return (
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)
    );
}

function addMove() { //will increment moves after both cards are toggled
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() {
    if (moves === 16 || moves === 24) //arbitray number of moves to represent star scores
 {     hideStar(); //start decrease for x number of increased moves - 16 and 24
    }
}

function hideStar() { //function that hides the stars
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break; //if element already has display style of none, skip it, otherwise proceed to next star, set it's display = 'none', and break
        } //stars are HTML elements so can use the .style property to set an inline style with the .display property value
    }
}
hideStar();
hideStar();

function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
        console.log(time);
    }, 1000);
}
//startClock();



function displayTime() { //getting the clock element from the DOM and modifying its innerHTML property
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60); //don't want a float, so round down
    const seconds = time % 60; //the remainder after getting minutes, is seconds
    console.log(clock);
    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
    //clock.innerHTML = time;
}

function stopClock() { //where to call this
    clearInterval(clockId);
}

function toggleModal() {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

toggleModal(); //open modal
toggleModal(); // close modal

function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    console.log(starCount); //2
    return starCount;
}

document.querySelector('.modal_cancel').addEventListener('click', () =>  {
    toggleModal();
});

document.querySelector('.modal_replay').addEventListener('click', () => {
    console.log('replay');
});

document.querySelector('.modal_replay').addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
}

function replayGame() {
    resetGame();
    toggleModal(); //will close the modal so can play again
}

document.querySelector('.modal_replay').addEventListener('click', replayGame);

function resetClockAndTime () {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (start of starList) {
        star.style.display = 'inline';
    }
}

document.querySelector('.restart').addEventListener('click', resetGame);

document.querySelector('.modal_replay').addEventListener('click', resetGame);

function gameOver() {
    stopClock();
    writeModalStats ();
    toggleModal();
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
