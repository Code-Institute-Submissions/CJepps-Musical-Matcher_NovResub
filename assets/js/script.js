// All Javascript developed using Port Exe tutorial here: https://www.youtube.com/watch?v=3uuQ3g92oPQ&t=983s&ab_channel=PortEXE //
class AudioController {
    constructor() {
        this.flipSound = new Audio("assets/audio/flip.mp3");
        this.matchSound = new Audio('assets/audio/match.mp3');
        this.victorySound = new Audio('assets/audio/win-game.mp3');
        this.gameOverSound = new Audio('assets/audio/game-over.mp3');
        this.mismatchSound = new Audio('assets/audio/mismatch.wav');
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.victorySound.play();
    }
    gameOver() {
        this.gameOverSound.play();
    }
    mismatch() {
        this.mismatchSound.play();
    }
}

class musicMatcherGame {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.audioController = new AudioController();
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('moves');
        this.starRating = document.getElementById('star-rating');
    }
    startGame() {
        this.cardToCheck = null;
        this.totalMoves = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalMoves;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalMoves++;
            this.ticker.innerText = this.totalMoves;
            card.classList.add('visible');                         
            //Adds the class 'visible' to the card that is clicked, which should flip it and reveal the card backface.//
            if(this.cardToCheck) {
                this.checkForMatch(card);
            }
            else {
                this.cardToCheck = card; 
            }
                     
              
        } 
    }
    checkForMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        }
            
        else {
            this.cardMisMatch(card, this.cardToCheck);
        }
            
        
        this.cardToCheck = null;   
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length) {         
            this.winGame();
            // if the number of matched cards is the same as the number of cards in the cards array then all the cards have been matched and the win game function is called. //                                     
        }
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        this.audioController.mismatch();
        setTimeout(() => {
            card1.classList.remove('visible');                      
            card2.classList.remove('visible');
            //Removes visible class if the cards are mismatched and should flip them back to front face of card.//
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;   
        // checks if the two cards have the same image file name. If they do then they are a match. //
    }
    startCountDown() { 
        //takes 1 off of timeRemaining every 1000ms(1 second)//                                          
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
            // runs gameover function when timer hits zero.//                         
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        $("#game-over-modal").modal("toggle");
        
    }
    winGame() {
        clearInterval(this.countDown);
        this.audioController.victory();
        $("#win-game-modal").modal("toggle");
    }

    shuffleCards() {                                              
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomIndex].style.order = 1;
            this.cardsArray[i].style.order = randomIndex;
        }
        //Shuffles cards based on the Fisher-Yates algorithm.//
    }

    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}    

function ready() {                                                                               
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
//difficulty aid using pathname taken from https://github.com/Tawnygoody/MS2-World-of-Rugby/blob/master/assets/js/game-script.js
    let difficulty; 
    if(window.location.pathname.indexOf("game-beginner.html") != -1) { 
        // if the pathname contains "beginner" the gameType will be set to beginner
        difficulty = "beginner";
    } else if(window.location.pathname.indexOf("game-intermediate.html") != -1) { 
        difficulty = "intermediate";
    } else { 
        difficulty = "advanced";
    }

    let gameTime;
    //if the difficulty is set to "AMATEUR" the gameTime will be 120 seconds
    if (difficulty === "beginner") { 
        gameTime = 120;
    } else if (difficulty === "intermediate") { 
        gameTime = 100;
    } else { 
        gameTime = 80;
    }

    let game = new musicMatcherGame(gameTime, cards);
    //removes the visisble class when an overlay is clicked // 
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');                                       
            game.startGame();    
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}
//makes sure that html loads before any JavaScript is run //
if(document.readyState === 'loading') {                                                 
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}
    