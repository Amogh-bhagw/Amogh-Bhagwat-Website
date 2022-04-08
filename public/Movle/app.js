const tileDisplay = document.querySelector('.tile-container');
const keyDisplay = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

var word;

var num;

function randomNumber() {
    num = (Math.floor(Math.random() * 5000)) + 1; 
}

randomNumber()
var URL = 'https://api.themoviedb.org/3/movie/' + num + '?api_key=b4c17083a77fc7ae1bb0fba4799a600a&language=en-US'
   



function loadDoc() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        try {
            var movies = JSON.parse(this.response);
            var movieTitle = movies.title.split(" ").join("");
            if(movies.original_language != 'en' || movies.title.length < 4 || movies.title.length > 8){
                randomNumber()
                
                URL = 'https://api.themoviedb.org/3/movie/' + num + '?api_key=b4c17083a77fc7ae1bb0fba4799a600a&language=en-US'
                xhttp.open("GET", URL);
                xhttp.send();
               } else {
                   word = movieTitle.toUpperCase()
               }
        } catch (e) {
            randomNumber()
            URL = 'https://api.themoviedb.org/3/movie/' + num + '?api_key=b4c17083a77fc7ae1bb0fba4799a600a&language=en-US'
            xhttp.open("GET", URL);
            xhttp.send();
        }
      }
      if(this.status == 404){
        randomNumber()
        URL = 'https://api.themoviedb.org/3/movie/' + num + '?api_key=b4c17083a77fc7ae1bb0fba4799a600a&language=en-US'
        xhttp.open("GET", URL);
        xhttp.send();
      }
    };
    xhttp.open("GET", URL);
    xhttp.send();
  }
 loadDoc();
function off() {
    document.getElementById('overlay-message').style.display = 'none';
}  

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]

/*const guessRows = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
]*/

/* This is to create guess rows that fit the word */
const guessRows = new Array(6)
setTimeout( () => {


    for (var i = 0; i < guessRows.length; i++) {
        guessRows[i] = new Array(word.length);
    }
    for(var i = 0; i < 6; i++){
        for(var j = 0; j < word.length; j++){
                guessRows[i][j] = ''
        } 
    }
},  6000)
setTimeout( () => {
    
    let currentRow = 0
    let currentTile = 0
    let isGameOver = false
    guessRows.forEach((guessRow, guessRowIndex) => {
        const rowElement = document.createElement('div')
        rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
        guessRow.forEach((guess, guessIndex) =>{
            const tileElement = document.createElement('div')
            tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
            tileElement.classList.add('tile')
            rowElement.append(tileElement);
        })
        tileDisplay.append(rowElement);
    })

    keys.forEach(key => {
        const buttonElement = document.createElement('button')
        buttonElement.textContent = key;
        buttonElement.setAttribute('id', key)
        buttonElement.addEventListener('click', () => handleClick(key))
        keyDisplay.append(buttonElement)
    })

    const handleClick = (key) => {
        if(!isGameOver) {
            if(key === '«'){
                deleteLetter()
                return
            }
            if(key === 'ENTER'){
                checkGuess()
                return
            }
            addLetter(key)
        }
    }

    const addLetter = (letter) => {
        if(currentRow < 6 && currentTile < word.length){
            const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
            tile.textContent = letter;
            guessRows[currentRow][currentTile] = letter;
            tile.setAttribute('data', letter);
            currentTile++
        }
    }

    const deleteLetter = () => {
        if(currentTile>0){
            currentTile--
            const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
            tile.textContent = ''
            guessRows[currentRow][currentTile] = ''
            tile.setAttribute('data', '')
            
        }

    }

    const checkGuess = () => {
        const guess = guessRows[currentRow].join('')
        if(currentTile > word.length-1){
            flipTile()
            if(word == guess){
                showMessage('Congrats')
                isGameOver = true
                return
            } else {
                if(currentRow >= 5){
                    isGameOver = true
                    showMessage('Game Over\n The word was: ' + word)
                    return
                    
                }
                if(currentRow<5){
                    currentRow++
                    currentTile= 0
                }
            }
        }
    }

    const showMessage = (message) => {
        const info = document.createElement('p')
        info.textContent = message
        messageDisplay.append(info)
        setTimeout(() => messageDisplay.removeChild(info), 2000)
    }

    const markKey = (letter, color) => {
        const key = document.getElementById(letter)
        key.classList.add(color)
    }


    const flipTile = () => {
        const rowTitles = document.querySelector('#guessRow-' + currentRow).childNodes
        let checkWord = word
        const guess = []

        rowTitles.forEach(tile => {
            guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
        })

        guess.forEach((guess, index)=>{
            if(guess.letter == word[index]) {
                guess.color = 'green-overlay'
                checkWord = checkWord.replace(guess.letter, '')
            }
        })

        guess.forEach(guess =>{
            if(checkWord.includes(guess.letter)){
                guess.color = 'yellow-overlay'
                checkWord = checkWord.replace(guess.letter, '')
            }
        })


        
        rowTitles.forEach((tile, index) =>{
            setTimeout(() => {
                tile.classList.add('flip')
                tile.classList.add(guess[index].color)
                markKey(guess[index].letter, guess[index].color)
            }, 500 * index)
        })
    }

}, 8000)



