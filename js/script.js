const guessedLettersElement = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
    const res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await res.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    circleSymbol(word);
}



const circleSymbol = function (word) {
    const placeholderSymbols = []
    for (const letter of word) {
        //console.log(letter);
        placeholderSymbols.push("⁕");
    }
    wordInProgress.innerText = placeholderSymbols.join("");
};
getWord();
guessButton.addEventListener("click", function (e) { /*Event listener*/
    e.preventDefault();
    const guessedLetter = letterInput.value;
    console.log(guessedLetter);
    letterInput.value = "";
    message.innerText = "";
    const properGuess = checksInput(guessedLetter);
    console.log(properGuess); /*will either log out a single letter or 'undefined' */
    if (properGuess) {
        makeGuess(guessedLetter);
    }

});

const checksInput = function (input) { /*checks to see if the input is a single letter */
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "You should guess a single letter.";
    } else if (input.length > 1) {
        message.innerText = "Only input one letter."
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Only input alphabetic letters."
    } else {
        return input;
    }
};

const makeGuess = function (guessedLetter) { /*Capture the guessed letters ON THE BACKEND*/
    guessedLetter = guessedLetter.toUpperCase();
    if (guessedLetters.includes(guessedLetter)) {
        message.innerText = "You have already guessed that letter. Try again.";
    } else {
        guessedLetters.push(guessedLetter);
        console.log(guessedLetters);
        showGuessedLettersOnDOM();
        guessesRemaining(guessedLetter);
        updateWordInProgressOnDOM(guessedLetters);
    }
};

const showGuessedLettersOnDOM = function () { /*Isn't passed a perameter because it refrences that desired array in for.. of loop*/
    guessedLettersElement.innerHTML = "";   /*empties the HTML for this area so letters dont' pile up*/
    for (const letter of guessedLetters) { /*the letters that were entered were already in the array above, so they'll pull from that, that's why all of the letters you typed are still showing up*/
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
};

const updateWordInProgressOnDOM = function (guessedLetters) { /*replaces circles with correct letters guessed - passing the array of guessed letters*/
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    console.log(wordArray);
    const revealedWord = [];
    for (const letter of wordArray) { /*I definately get the log behind this now - you take the goal word and loop through each letter to see if the guessed letters match, if they do they push the letter from the goal word, if not, they push the symbol*/
        if (guessedLetters.includes(letter)) {
            revealedWord.push(letter.toUpperCase());
            console.log(revealedWord);
        } else {
            revealedWord.push("⁕")
        }
        wordInProgress.innerText = revealedWord.join("")
    }
    checkIfUserWon();
};

const guessesRemaining = function (guessedLetter) {
    word = word.toUpperCase();
    if (word.includes(guessedLetter)) {
        message.innerText = "Yay, this letter is in this word!";
    } else {
        message.innerText = "Sorry, that letter is not in the word.";
        remainingGuesses -= 1;
    }
    if (remainingGuesses === 0) {
        message.innerText = `You have no guesses left. The word was ${word}`;
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};

const checkIfUserWon = function () {
    if (wordInProgress.innerText === word.toUpperCase()) {
        message.classList.add("win");
        message.innerHTML = '<p class="highlight">You guessed correct the word! Congrats!</p>';
        startOver();
    }
};

const startOver = function () {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function () {
    message.classList.remove("win");
    message.innerText = "";
    guessedLettersElement.innerHTML = "";
    remainingGuesses = 8;
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`
    guessedLetters = [];
    guessButton.classList.remove("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
    playAgainButton.classList.add("hide");
    getWord();
});