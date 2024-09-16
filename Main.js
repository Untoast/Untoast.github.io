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

var Waiting = false

var ColorsForWords = []

//confetti effect
// Initialize tsParticles with the bigCircles preset

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
        console.log(Word)
        if (Guessed) { return }
        if (Waiting) { Noti("Wait for previous guess to finish...", "#ff0000"); return }
        CurrentIndex++

        //Test if word had already been submitted
        Word = Word.toLowerCase()
        //Test if word had already been submitted
        if (SubmittedWords.includes(wordToGuess)) {
            Noti("Word has already been submitted!", "#ff0000")
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
        Waiting = true
        Guesses++
        UpdateAttempts(Guesses)
        SubmittedWords[CurrentIndex] = Word
        //
        let CorrectPosition = []
        let InWord = []
        word.value = ""
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

        let amountofeachchar = []
        let amountofeachcharinsub = []
        let Hitsforinput = []
        for (let i = 0; i < wordToGuess.length; i++) {
            if (!amountofeachchar[wordToGuess[i]]) { amountofeachchar[wordToGuess[i]]; amountofeachchar[wordToGuess[i]] = 1; continue }
            amountofeachchar[wordToGuess[i]]++
        }
        for (let i = 0; i < Word.length; i++) {
            if (!amountofeachcharinsub[Word[i]]) { amountofeachcharinsub[Word[i]]; amountofeachcharinsub[Word[i]] = 1; continue }
            amountofeachcharinsub[Word[i]]++
        }
        console.log(amountofeachchar)
        //get colors for chars
        let ColorsForCurrentWord = []
        //if amount of certain letter in submitted > amount of certain letter in correct pos then remove that yellow letter
        let amtInCorrectPos = []

        for (let i = 0; i < Word.length; i++) {
            const letterInSubmitted = Word[i]
            if (CorrectPosition.at(i)) {
                if (!amtInCorrectPos[letterInSubmitted]) { amtInCorrectPos[letterInSubmitted] = 0 }
                amtInCorrectPos[letterInSubmitted]++
                if (!AlteredKeyboardItems[letterInSubmitted] || AlteredKeyboardItems[letterInSubmitted] == "WrongPos") {
                    ColorsForCurrentWord.splice(i, 0, { color: "ffffff", background: "#00ff00", keyboard: "#00ff00" })
                }
                else {
                    ColorsForCurrentWord.splice(i, 0, { color: "ffffff", background: "#00ff00" })
                }
                AlteredKeyboardItems[letterInSubmitted] = "CorrectPos"
            }
            //Wrong Pos
            else if (InWord.at(i)) {
                if (!Hitsforinput[letterInSubmitted]) { Hitsforinput[letterInSubmitted] = 0}
                Hitsforinput[letterInSubmitted]++
                if (Hitsforinput[letterInSubmitted] > amountofeachchar[letterInSubmitted]) { ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151" }); continue }
//if amount of certain letter in submitted > amount of certain letter in correct pos then remove that yellow letter
                if (Hitsforinput[letterInSubmitted] > amountofeachchar[letterInSubmitted]) { ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151" }); continue }
                if (!AlteredKeyboardItems[letterInSubmitted] || AlteredKeyboardItems[letterInSubmitted] == "WrongPos") {
                    ColorsForCurrentWord.splice(i, 0, { color: "#000000", background: "#ffff00", keyboard: "#ffff00" })
                }
                else {
                    ColorsForCurrentWord.splice(i, 0, { color: "#000000", background: "#ffff00" })
                }
                AlteredKeyboardItems[letterInSubmitted] = "WrongPos"
            }
            else {
                if (!AlteredKeyboardItems[letterInSubmitted]) {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151", keyboard: "#515151" })
                }
                else {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151" })
                }
                AlteredKeyboardItems[letterInSubmitted] = "Wrong";
            }
        }
        //loop through if there is only one of that character and you got correct pos amd another in the wrong pos only make the one in the right green
       console.log(amtInCorrectPos)
    console.log(ColorsForCurrentWord)

        let charactersSpans = []
        let CurrentWordEditString = ""
        //Add to guesses list
        for (let i = 0; i < Word.length; i++) {
            const letterInSubmitted = Word[i]
            const letterOnKeyboard = document.getElementById(letterInSubmitted);
            let letterSpan = document.createElement('span');
            letterSpan.style.margin = "0.2rem";
            letterSpan.style.display = 'inline-block';
            letterSpan.style.width = '3rem';
            letterSpan.style.height = '3rem';
            letterSpan.style.textAlign = 'center';
            letterSpan.style.lineHeight = '3rem';
            letterSpan.style.fontSize = '5rem';
            letterSpan.style.fontSize = 'calc(3.5rem + 0.5vw)';
            letterSpan.style.textAlign = 'center';
            letterSpan.style.transition = '0.2s'
            letterSpan.style.borderRadius = "5px";
            letterSpan.id = Word + i
            letterSpan.innerHTML = letterInSubmitted.toUpperCase()
            letterSpan.style.color = "#fff"
            letterSpan.style.opacity = "0"
            letterSpan.style.transform = "scale(0.1)"
            letterSpan.style.transform = "blur(10px)"


            CurrentWordEditString += letterSpan.outerHTML; // Append the span to the string
        }
        GuessesListString = "<br />" + CurrentWordEditString

        GuessesList.innerHTML += GuessesListString
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            let currentSpan = document.getElementById(Word + i)
            currentSpan.style.opacity = "1"
            currentSpan.style.transform = "scale(1)"
            currentSpan.style.transform = "blur(0px)"
        }
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            let currentSpan = document.getElementById(Word + i)
            currentSpan.style.color = ColorsForCurrentWord[i].color
            currentSpan.style.background = ColorsForCurrentWord[i].background
            if (ColorsForCurrentWord[i].keyboard !== "#ffff00") { document.getElementById(Word[i]).style.color = "#fff" }
            document.getElementById(Word[i]).style.background = ColorsForCurrentWord[i].keyboard
            document.getElementById(Word[i]).style.filter = "drop-shadow(" + ColorsForCurrentWord[i].keyboard + " 0px 0px 5px)"
            CurrentWordEditString += currentSpan.outerHTML; // Append the span to the string
            currentSpan.style.filter = "drop-shadow(" + ColorsForCurrentWord[i].background + " 0px 0px 5px)"

        }
        console.log(wordToGuess)
        if (Word === wordToGuess) {
            Noti("You successfully guessed " + wordToGuess + " in " + Guesses + " attempts! Press new to play again.", "#00ff00", true)
            Guessed = true
            const duration = 5 * 1000,
                animationEnd = Date.now() + duration,
                defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                confetti(
                    Object.assign({}, defaults, {
                        particleCount,
                        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    })
                );
                confetti(
                    Object.assign({}, defaults, {
                        particleCount,
                        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    })
                );
            }, 250);
        }

        Waiting = false
        console.log(CorrectPosition);
        console.log(InWord);
    };

    submit.addEventListener("click", (event) => {
        event.preventDefault();
        ApplyRules(word.value)
        console.log("Clicked, Submited word: " + word.value);
    });

    Stop.addEventListener("click", (event) => {
        event.preventDefault();
        Noti("You gave up after " + Guesses + " guesses! The word was \'" + wordToGuess + "\'! Press new to play again.", "#ff0000", true)
        Guessed = true
    });

    Refresh.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.reload();
    });
}


Main()


const wordInput = document.getElementById('word');
const buttons = [document.getElementById('Stop'), document.getElementById('submit'), document.getElementById('Refresh')];
const otherElements = document.querySelectorAll('.Input, #Attempts, #result, #keyboard, #Guesses');

wordInput.addEventListener('focus', () => {
    wordInput.classList.add('center');

    // Fade out all other elements
    otherElements.forEach(element => {
        if (element !== wordInput) {
            element.classList.add('fade-out');
        }
    });
})
