var wordToGuess = "                     "

let word = document.getElementById("word");
let submit = document.getElementById("submit");
let result = document.getElementById("result")
let GuessesList = document.getElementById("Guesses")
let Stop = document.getElementById("Stop")
let Attempts = document.getElementById("Attempts")

var SubmittedWords = []
var CurrentIndex = 0

var Guesses = 0
var Guessed = false

var GuessesListString = ""
var AlteredKeyboardItems = []
async function Main() {
    const response = await fetch('https://raw.githubusercontent.com/Untoast/Words/main/Words.txt'); // Fetch from the URL
    const text = await response.text(); // Get the text content
    const words = text.split('\n'); // Split the text into an array of words

    async function getRandomLine() {
        return words[Math.floor(Math.random() * words.length)]; // Return a random word
    }
    wordToGuess = await getRandomLine()
    function Noti(Text, color, keep) {
        result.style.filter = "blur(0px)";
        result.innerHTML = Text
        result.style.color = color;
        if (keep == true) { return }
        setTimeout(() => {
            result.style.color = "transparent";
            result.style.filter = "blur(15px)";
        }, 1000);
    }

    function UpdateAttempts(Amt) {
        Attempts.style.filter = "opacity(1)"
        Attempts.style.filter = "blur(15px)"
        setTimeout(() => {
            Attempts.innerHTML = Amt
            Attempts.style.filter = "opacity(0)"
            Attempts.style.filter = "blur(0px)"
        }, 150);
    }
    async function ApplyRules(Word) {
        if (Guessed) { return }
        console.log(wordToGuess)
        CurrentIndex++
        Word = Word.toLowerCase()
        //Test if word had already been submitted
        if (SubmittedWords.includes(Word)) {
            Noti("Word already submitted!", "#ff0000")
            return
        }
        if (Word.length != 5) {
            Noti("Word length must be 5 characters!", "#ff0000")
            return
        }
        if (!words.includes(Word)) {
            Noti("Word not in list!", "#ff0000")
            return
        }
        Guesses++
        UpdateAttempts(Guesses)
        SubmittedWords[CurrentIndex] = Word
        //
        let CorrectPosition = []
        let InWord = []



        //Check Rules
        for (let i = 0; i < Word.length; i++) {
            const letterInSubmitted = Word[i];
            const letterInToGuess = wordToGuess[i];

            if (letterInSubmitted === letterInToGuess) {
                CorrectPosition[i] = letterInSubmitted;
            }


            for (let b = 0; b < wordToGuess.length; b++) {
                if (letterInSubmitted === wordToGuess[b] && !CorrectPosition[b]) {
                    InWord[i] = letterInSubmitted;
                }
            }
        }

        if (Word === wordToGuess) {
            Noti("You successfully Guessed " + wordToGuess + " In a total of " + CurrentIndex++ + " Guesses! Press New to play again.", "#00ff00", true)
            Guessed = true
        }

        //Add to guesses list
        let CurrentWordEditString = ""
        for (let i = 0; i < Word.length; i++) {
            const letterInSubmitted = Word[i];
            const letterOnKeyboard = document.getElementById(letterInSubmitted);
            let letterSpan = document.createElement('span');
            letterSpan.style.border = "1px solid #000000";
            letterSpan.style.margin = "2px";
            letterSpan.style.display = 'inline-block';
            letterSpan.style.width = '30px';
            letterSpan.style.height = '30px';
            letterSpan.style.textAlign = 'center';
            letterSpan.style.lineHeight = '30px';
            letterSpan.style.fontSize = '36px';

            if (CorrectPosition.at(i)) {
                if (!AlteredKeyboardItems[letterInSubmitted] || AlteredKeyboardItems[letterInSubmitted] == "WrongPos") {
                    letterOnKeyboard.style.background = "#00ff00";;
                }
                letterSpan.style.color = "ffffff";
                letterSpan.style.background = "#00ff00"
                AlteredKeyboardItems[letterInSubmitted] = "CorrectPos"
            }
            else if (InWord.at(i)) {
                if (!AlteredKeyboardItems[letterInSubmitted]) {
                    letterOnKeyboard.style.background = "#ffff00";
                }
                letterSpan.style.color = "#000000";
                letterSpan.style.background = "#ffff00";
                AlteredKeyboardItems[letterInSubmitted] = "WrongPos"
            }
            else {
                if (!AlteredKeyboardItems[letterInSubmitted]) {
                    letterOnKeyboard.style.background = "#515151";
                }
                letterSpan.style.color = "#ffffff";
                letterSpan.style.background = "#515151";
                AlteredKeyboardItems[letterInSubmitted] = "Wrong"

            }
            letterSpan.style.padding = "5px"; // Padding for better appearance
            letterSpan.style.borderRadius = "3px"; // Rounded corners
            letterSpan.textContent = letterInSubmitted + " "; // Add letter with space
            CurrentWordEditString += letterSpan.outerHTML; // Append the span to the string
        }
        GuessesListString += "<br />" + CurrentWordEditString
        GuessesList.innerHTML = GuessesListString
        console.log(CorrectPosition)
        console.log(InWord)
    };

    submit.addEventListener("click", (event) => {
        event.preventDefault();
        ApplyRules(word.value)
        console.log("Clicked, Submited word: " + word.value);
    });

    Stop.addEventListener("click", (event) => {
        event.preventDefault();
        Noti("You gave up! The word was \'" + wordToGuess + "\'! Press New to play again.", "#ff0000", true)
        Guessed = true
    });

    Refresh.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.reload();
    });
}

Main()
