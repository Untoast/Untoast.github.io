var wordToGuess = "                     "

let word = document.getElementById("word");
let submit = document.getElementById("submit");
let result = document.getElementById("result")
let GuessesList = document.getElementById("Guesses")
let Stop = document.getElementById("Stop")
let Attempts = document.getElementById("Attempts")
let Gibson = document.getElementById("Gibson")

var SubmittedWords = []
var CurrentIndex = 0

var Guesses = 0
var Guessed = false

var GuessesListString = ""
var AlteredKeyboardItems = []

var Waiting = false

var ColorsForWords = []

var Found = []

function TransitionNewGame() {
    wordInput.blur()
    setTimeout(async () => {
        let form = document.getElementById("GuessForm")
        form.style.transition = "1s ease-in-out"
        for (let i = 0; i < form.length; i++) {
                form[i].style.transition = "1s"
                form[i].style.padding = "0"
                form[i].style.fontSize = "0"
                form[i].style.filter = "blur(15px)"
                form[i].style.opacity = "0"
            
        }
        Gibson.style.transition = "1s"
        form.style.padding = "0"
        form.style.border = "none"
        form.style.background = "transparent"
        form.style.border = "none"
        form.style.boxShadow = "none"
        Gibson.style.transform = "Scale(0)"
        Gibson.style.filter = "Blur(15px)"
        Gibson.style.opacity = "0"
        await new Promise(resolve => setTimeout(resolve, 1000));
        let refresh = document.getElementById("Refresh") 
        for (let i = 0; i < form.length; i++) {
            if (form[i].id != "Refresh") {
                form[i].style.display = "none"
            }
        }
        if (window.innerWidth < 750) {return}
         refresh.innerHTML = "New Game" 

        //set all of refresh to default
        // border-radius: 5ch;
        // border: none;
        // background-color: #6868680a;
        // backdrop-filter: blur(100px);
        // padding: .3ch;
        // padding-left: 1ch;
        // padding-right: 1ch;
        // justify-content: center;
        // text-align: center;
        // font-size: 2rem;
        // transition: .2s;
        // cursor: pointer;
        // box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        // border: 1px solid #ffffff11;
        // filter: drop-shadow(#0000006b 0px 0px 5px);
        // color: #fff;
        // font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif !important;
        // margin: 0px 5px 0px 5px;   
        refresh.style.borderRadius = "5ch"
        refresh.style.border = "none"
        refresh.style.background = "#6868680a"
        refresh.style.backdropFilter = "blur(100px)"
        refresh.style.padding = ".3ch"
        refresh.style.paddingLeft = "1ch"
        refresh.style.paddingRight = "1ch"
        refresh.style.justifyContent = "center"
        refresh.style.textAlign = "center"
        refresh.style.fontSize = "2rem"
        refresh.style.cursor = "pointer"
        refresh.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"
        refresh.style.border = "1px solid #ffffff11"
        refresh.style.filter = "drop-shadow(#0000006b 0px 0px 5px)"
        refresh.style.color = "#fff"
        refresh.style.fontFamily = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif !important"
        refresh.style.margin = "0px 5px 0px 5px"
        refresh.style.opacity = "1"
        form.style.padding = "10px"
        form.style.padding = "0"
        form.style.border = "none"
        form.style.background = "transparent"
        await new Promise(resolve => setTimeout(resolve, 100));
        refresh.style.transition = ".2s"
    }, 1);       
}

async function Main() {
    const response = await fetch('words.txt')
    const text = await response.text(); // Get the text content
    const words = text.split('\n'); // Split the text into an array of words

    async function getRandomLine() {
        return words[Math.floor(Math.random() * words.length)]; // Return a random word
    }
    wordToGuess = await getRandomLine()
    wordToGuess = wordToGuess.toLowerCase()
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
        if (Waiting) { Noti("Wait for previous guess to finish...", "#ff0000"); return }
        CurrentIndex++

        Word = Word.toLowerCase()
        //Test if word had already been submitted
        if (SubmittedWords.includes(Word)) {
            Noti("Word has already been submitted!", "#ff0000")
            return
        }
        if (Word.length != 5) {
            Noti("Word length must be 5 characters!", "#ff0000")
            return
        }
        if (!words.includes(Word)) {
            Noti("Word is not in list!", "#ff0000")
            return
        }
        Waiting = true
        Guesses++
        UpdateAttempts(Guesses)
        SubmittedWords[CurrentIndex] = Word
        //
        let CorrectPosition = []
        let InWord = []
        let InWordToGuess = []
        word.value = ""
        //Check Rules
        for (let i = 0; i < Word.length; i++) {
            const letterInSubmitted = Word[i];
            const letterInToGuess = wordToGuess[i];

            if (letterInSubmitted == letterInToGuess) {
                CorrectPosition[i] = letterInSubmitted;
            }


            for (let b = 0; b < wordToGuess.length; b++) {
                if (letterInSubmitted === wordToGuess[b] && !CorrectPosition[b]) {
                    InWord[i] = letterInSubmitted;
                }
            }
        }
        for (let i = 0; i < wordToGuess.length; i++) {
            if (!InWordToGuess[wordToGuess[i]]) { InWordToGuess[wordToGuess[i]]; InWordToGuess[wordToGuess[i]] = 1; continue }
            InWordToGuess[wordToGuess[i]]++
        }
        let amountincorrectpos = []
        //get amount of each character in submitted prompt (Word) in the correct pos
        for (let i = 0; i < wordToGuess.length; i++) {
            const letterInSubmitted = Word[i];
            const letterInToGuess = wordToGuess[i];
            if (letterInSubmitted == letterInToGuess) {
                if (!amountincorrectpos[letterInSubmitted]) { amountincorrectpos[letterInSubmitted] = 0 }
                amountincorrectpos[letterInSubmitted]++
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
        //get colors for chars
        let ColorsForCurrentWord = []
        //if amount of certain letter in submitted > amount of certain letter in correct pos then remove that yellow letter
        let amtInCorrectPos = []
        console.log(Found)
        for (let i = 0; i < Word.length; i++) {
            const letterInSubmitted = Word[i]
            console.log(Word)
            console.log(letterInSubmitted)
            console.log(InWord.at(i))
            if (CorrectPosition.at(i)) {
                Hitsforinput[letterInSubmitted]++
                if (!amtInCorrectPos[letterInSubmitted]) { amtInCorrectPos[letterInSubmitted] = 0 }
                if (!AlteredKeyboardItems[letterInSubmitted] || AlteredKeyboardItems[letterInSubmitted] == "WrongPos") {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#00ff00", keyboard: "#00ff00" })
                }
                else {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#00ff00" })
                }
                AlteredKeyboardItems[letterInSubmitted] = "CorrectPos"
                Found[letterInSubmitted] = letterInSubmitted 
            }
            //Wrong Pos
            else if (InWord.at(i)) {
                // console.log(letterInSubmitted)
                if (!Hitsforinput[letterInSubmitted]) { Hitsforinput[letterInSubmitted] = 0 }
                // console.log(letterInSubmitted)
                // console.log(Found[letterInSubmitted])
                Hitsforinput[letterInSubmitted]++

                //Duplicate letter cases
                //To guess = grove, submitted = rarer, only first r will be yellow
                if (Hitsforinput[letterInSubmitted] > amountofeachchar[letterInSubmitted]) { ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151"}); continue }
                //To guess = pouch, submitted = mecca, only second c will be green

                if (amountincorrectpos[letterInSubmitted] >= amountofeachchar[letterInSubmitted]) { ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151"}); continue }

                if (!AlteredKeyboardItems[letterInSubmitted] || AlteredKeyboardItems[letterInSubmitted] == "WrongPos" && !Found[letterInSubmitted]) {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#ffff00", keyboard: "#ffff00" })
                }
                else {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#ffff00" })
                }
                AlteredKeyboardItems[letterInSubmitted] = "WrongPos"
            }
            else {
                console.log(letterInSubmitted)
                if (!AlteredKeyboardItems[letterInSubmitted] && !Found[letterInSubmitted]) {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151", keyboard: "#1e1e1e" })
                }
                else {
                    ColorsForCurrentWord.splice(i, 0, { color: "#ffffff", background: "#515151" })
                }
                AlteredKeyboardItems[letterInSubmitted] = "Wrong";
            }
        }



        //loop through if there is only one of that character and you got correct pos amd another in the wrong pos only make the one in the right green
        //=============================================Character Creation=============================================
        let charactersSpans = []
        let CurrentWordEditString = ""
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
            letterSpan.style.textAlign = "center"


            CurrentWordEditString += letterSpan.outerHTML; // Append the span to the string
        }
        GuessesListString = "<br />" + CurrentWordEditString
        GuessesList.innerHTML += GuessesListString
        for (let i = 0; i < Word.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            let currentSpan = document.getElementById(Word + i)
            currentSpan.style.opacity = "1"
            currentSpan.style.transform = "scale(1)"
            currentSpan.style.transform = "blur(0px)"
            GuessesList.scrollTo(0, GuessesList.scrollHeight)
            new Audio("Resources/Audio/LetterPop.wav").play()
        }
        //==================Character Color Application==================
        let correct = 0
        for (let i = 0; i < Word.length; i++) {

            await new Promise(resolve => setTimeout(resolve, 500));
            let ScoreType = ""
            console.log(ColorsForCurrentWord)
            if (ColorsForCurrentWord[i].background == "#00ff00") { ScoreType = "Correct" }
            else if (ColorsForCurrentWord[i].background == "#ffff00") { ScoreType = "Semi" }
            else { ScoreType = "Wrong" }

            let currentSpan = document.getElementById(Word + i)

            currentSpan.style.color = ColorsForCurrentWord[i].color
            currentSpan.style.background = ColorsForCurrentWord[i].background
            currentSpan.style.textShadow = "0px 0px 5px #000"

            document.getElementById(Word[i]).style.filter = "drop-shadow(" + ColorsForCurrentWord[i].keyboard + " 0px 0px 3px)"
            document.getElementById(Word[i]).style.background = ColorsForCurrentWord[i].keyboard
            document.getElementById(Word[i]).style.textShadow = "0px 0px 5px #000"
            CurrentWordEditString += currentSpan.outerHTML; // Append the span to the string
            
            if (ScoreType == "Correct") {
                correct++
                new Audio("Resources/Audio/CorrectPitches/C"+correct+".wav").play()
            }
            else if (ScoreType == "Semi") {
                correct = 0
                new Audio("Resources/Audio/Semi.wav").play()
            }
            else {
                correct = 0
                new Audio("Resources/Audio/Default.wav").play()
            }
        }
        //==================Win Condition==================
        if (Word === wordToGuess) {
            wordInput.blur()
            new Audio("Resources/Audio/Win.wav").play()
            TransitionNewGame()
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
    };

    submit.addEventListener("click", (event) => {
        event.preventDefault();
        ApplyRules(word.value)
    });

    Stop.addEventListener("click", (event) => {
        event.preventDefault();
        if (Guessed) { return }
        Guessed = true
        TransitionNewGame()
        setTimeout(() => {
        Noti("You gave up after " + Guesses + " guesses, the word was \'" + wordToGuess + "\'! Press new to play again.", "#ff0000", true)
        }, 1000);
    });
    Gibson.addEventListener("click", (event) => {
        event.preventDefault();
        if (Guessed) { return }
        Guessed = true
        TransitionNewGame()
        setTimeout(() => {
        Noti("Then try harder! you gave up after " + Guesses + " guesses, the word was \'" + wordToGuess + "\'!", "#ff0000", true)
        }, 1000);
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


//==================Key input events==================
document.addEventListener("keydown", (event) => {
    if (document.activeElement !== wordInput) {
        //Add letter no matter focus
        if (event.key.match(/^[a-zA-Z]+$/) && event.key.length == 1 && wordInput.value.length < 5) {
            wordInput.value += event.key
        }
        else if (event.key == "Backspace") {
            wordInput.value = wordInput.value.slice(0, -1)
        }
        //Enter key trigger submit
        else if (event.key == "Enter") {
            submit.click()
        }
    }
})


let keyboardContainer = document.createElement('div');
        keyboardContainer.id = "KeyboardContainer"
        keyboardContainer.style.display = "flex"
        keyboardContainer.style.justifyContent = "center"
        keyboardContainer.style.alignItems = "center"
        keyboardContainer.style.width = "100%"
        keyboardContainer.style.height = "10vw"
        keyboardContainer.style.margin = "0px"
        keyboardContainer.style.paddingTop = "5px"
        keyboardContainer.style.display = "none"
        keyboardContainer.style.gap = "10px"
        keyboardContainer.style.borderTop = "1px solid #393939"

//Desktop layout
let desktopElems = [Stop, submit, Refresh]
//Mobile layout
let mobileElems = [Stop, Refresh, submit]
//==================Window Size Check==================

function checkViewport() {
    const errorText = document.getElementById('errorText');
    const otherElements = document.querySelectorAll('.Input, #Attempts, #result, #keyboard, #Guesses');

    if (window.innerWidth >= 750 && window.innerHeight < 750) {
        // Add the hidden class to all elements except the error message
        otherElements.forEach(element => {
            if (element !== errorText) {
                element.classList.add('hidden');
                errorText.classList.remove('hidden');
            }
        });
    }
    else {
        // Remove the hidden class from all elements and hide the error message
        otherElements.forEach(element => {
            if (element !== errorText) {
                element.classList.remove('hidden');
                errorText.classList.add('hidden');
            }
        });
    }
    if (window.innerWidth < 750) {
        wordInput.setAttribute("disabled", true);
        keyboardContainer.style.display = "flex"
        keyboard.appendChild(keyboardContainer)
        mobileElems.forEach(elem => {
            keyboardContainer.appendChild(elem)
            elem.style.margin = "0px"
            elem.style.width = "100%"
            elem.style.height = "10vw"
        })
        if (getComputedStyle(Gibson).getPropertyValue("display") !== "none") {
            Gibson.style.display = "none"
        }

    }
    else if (window.innerWidth >= 750) {
        wordInput.removeAttribute("disabled")
        keyboardContainer.style.display = "none"
        if (getComputedStyle(Gibson).getPropertyValue("display") !== "flex") {
            Gibson.style.display = "flex"
        }
        let itter = 0
        desktopElems.forEach(elem => {
            itter++
            if (itter == 1) {
                document.getElementById("GuessForm").appendChild(elem)
                document.getElementById("GuessForm").appendChild(wordInput)
            }
            else document.getElementById("GuessForm").appendChild(elem)
            elem.style.margin = "0px 5px 0px 5px"
            elem.style.width = "auto"
            elem.style.height = "auto"
        })
    }
}

// Check viewport on load and on resize
window.addEventListener('load', checkViewport);
window.addEventListener('resize', checkViewport);
window.addEventListener('orientationchange', checkViewport);
