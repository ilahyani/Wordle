let idx = 0, attempts = 0, word = "", dailyWord = "", wordComplete = false, gameOver = false, isValid
const letterMatch = '#558048', letterDoesntMatch = '#D2A741', letterDoesntExist = '#888888'
const wordAPI = "https://words.dev-apis.com/word-of-the-day?random=1" // {"word":"humph","puzzleNumber":3}
const validatewordAPI = "https://words.dev-apis.com/validate-word" // {"word": "crane"} {"word": "crane", "validWord": true}
const loadingDiv = document.querySelector(".info-bar")
const Letter = document.querySelectorAll(".letter")
const attempsLimit = 6, wordLength = 5

getDailyWord()
loadingDiv.classList.add('hidden')
document.addEventListener('keydown', function (event) {
    if (!gameOver) {
        if (wordComplete) {
            if (event.key == "Enter")
                checkWord()
            else if (event.key == "Backspace") {
                if (idx)
                    idx--
                Letter[idx].innerText = ""
                word = word.toString().substring(0, word.length - 1)
                wordComplete = false
            }
            else
                event.preventDefault();
        }
        else {
            if (isLetter(event.key)) {
                Letter[idx].innerText = event.key.toUpperCase()
                word += event.key.toUpperCase()
                Letter[idx].focus()
                idx++
                if (idx && idx % wordLength == 0)
                    wordComplete = true
            }
            else if (event.key == "Backspace") {
                if (idx && idx % wordLength != 0)
                    idx--
                Letter[idx].innerText = ""
                word = word.toString().substring(0, word.length - 1)
            }
            else
                event.preventDefault();
        }
    }
})

async function getDailyWord() {
    const response = await fetch(wordAPI)
    const wordObject = await response.json()
    dailyWord = wordObject.word.toUpperCase()
}

async function checkWord() {
    loadingDiv.classList.remove('hidden')
    let response = await fetch(validatewordAPI, {
        method: 'POST',
        body: JSON.stringify({ word: word })
    })
    let result = await response.json() // {"word": "crane", "validWord": true}
    loadingDiv.classList.add('hidden')
    //loadingDiv
    if (result.validWord) {
        if (word === dailyWord) {
            alert("M9WED KHOUYA") ///////////// add play again button + change the dialogue
            gameOver = true
        }
        colorLetters(idx - 1, Letter)
        word = ""
        if (++attempts == attempsLimit && gameOver == false) {
            alert(dailyWord + " al7mar") ///////////// add play again button + change the dialogue
            wordComplete = false
            gameOver = true
        }
        wordComplete = false
    }
    else
        alert("Not in word list. Try again")
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter)
}

function colorLetters(idx) {
    let pos = idx - 4
    let tmpDailyWord = dailyWord
    let tmpWord = word
    for (let i = 0; i < wordLength; i++) {
        Letter[pos].style.color = 'white'
        if (tmpDailyWord.indexOf(tmpWord[i]) !== -1) {
            if (tmpDailyWord[i] === tmpWord[i])
                Letter[pos].style.backgroundColor = letterMatch
            else {
                if (tmpWord.toString().substring(0, i).indexOf(tmpWord[i]) === -1)
                    Letter[pos].style.backgroundColor = letterDoesntMatch
                else
                    Letter[pos].style.backgroundColor = letterDoesntExist
            }
            tmpDailyWord = tmpDailyWord.toString().replace(tmpWord[i], '.')
            tmpWord = tmpWord.toString().replace(tmpWord[i], '.')
        }
        else
            Letter[pos].style.backgroundColor = letterDoesntExist
        pos++
    }
}