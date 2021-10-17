// Data

const MAX_BAD_ATTEMPTS = 9;
const wordList = [
  'apple', 'pear', 'door', 'window',
]
let word;
let buttons;
let guesses;
let gameState; // 0: in-game, 1: won, 2: lost

function badAttempts(guesses, word) {
  return guesses.filter(guess => !word.includes(guess)).length
}
function isWon(guesses, word) {
  return word.split('').every(letter => guesses.includes(letter));
}
function isLost(guesses, word) {
  return badAttempts(guesses, word) === MAX_BAD_ATTEMPTS;
}
function init() {
  word = wordList[random(0, wordList.length - 1)];
  buttons = 'abcdefghijklmnopqrstuvwxyz';
  guesses = [];
  gameState = 0;
}
// Helper function
function random(a, b) {
  return Math.floor(Math.random() * (b-a+1)) + a;
}

// Selected elements
const theWordDiv = document.querySelector('#the-word');
const lettersDiv = document.querySelector('#letters');
const scoreDiv = document.querySelector('#score');
const endOfGameDiv = document.querySelector('#end-of-game');
// const G=document.querySelector('#newG');

// Event handlers
// G.addEventListener('click',init);
lettersDiv.addEventListener('click', onButtonClick);
function onButtonClick(e) {
  if (e.target.matches('button')) {
    const button = e.target;
    // read
    const letter = button.innerText;
    
    // process
    guesses.push(letter);
    if (isWon(guesses, word)) {
      gameState = 1;
    }
    if (isLost(guesses, word)) {
      gameState = 2;
    }

    // write
    const bads = badAttempts(guesses, word);
    // declarative
    theWordDiv.innerHTML = genWord(word, gameState, guesses);
    scoreDiv.innerHTML = genScore(bads)
    // imperative
    button.disabled = true;
    const svgEl = document.querySelector(`svg > *:nth-child(${bads})`)
    svgEl?.classList.add('show');

    if (gameState > 0) {
      lettersDiv.hidden = true;
      endOfGameDiv.hidden = false;
      endOfGameDiv.innerHTML = genEndOfGame(gameState);
    }
    if (gameState === 1) {
      theWordDiv.classList.add('won');
    }
  }
}

// on page load
init();
theWordDiv.innerHTML = genWord(word, gameState, guesses)
lettersDiv.innerHTML = genButtons(buttons);


// HTML generators
function genButtons(buttons) {
  return buttons.split('').map(letter => `<button>${letter}</button>`).join('');
}
function genEndOfGame(gameState) {
  return `
        <span>${gameState === 1 ? 'You win!' : 'You lost'}</span>
        <button>Play again</button>
      `;
}
function genScore(bads) {
  return `Score: ${bads}/${MAX_BAD_ATTEMPTS}`;
}
function genWord(word, gameState, guesses) {
  return word
    .split('')
    .map(letter => `<span class="${gameState === 2 && !guesses.includes(letter) ? 'missing' : ''}">
              ${guesses.includes(letter) || gameState === 2 ? letter : ''}
           </span>`)
    .join('');
}

