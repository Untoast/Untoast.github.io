const keyboard = document.getElementById('keyboard');
const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

rows.forEach((row, index) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = `keyboard-row row-${index + 1}`;

    row.split('').forEach(letter => {
        const key = document.createElement('div');
        key.className = 'key';
        key.id = letter.toLowerCase();
        key.textContent = letter;
        key.addEventListener('click', () => {
            const wordInput = document.getElementById('word');
            if (wordInput.value.length < 5) {
                wordInput.value += letter.toLowerCase();
            }
        });
        rowDiv.appendChild(key);
    });

    keyboard.appendChild(rowDiv);

    // Add Backspace Key to the last row
    if (index === rows.length - 1) {
        const backspaceKey = document.createElement('div');
        backspaceKey.className = 'key';
        backspaceKey.textContent = '⌫'; // Backspace symbol
        backspaceKey.addEventListener('click', () => {
            const wordInput = document.getElementById('word');
            wordInput.value = wordInput.value.slice(0, -1); // Remove last character
        });
        rowDiv.appendChild(backspaceKey); // Append backspace key to the last row
    }
});

const wordInput = document.getElementById('word'); // Corrected name
const buttons = [document.getElementById('Stop'), document.getElementById('submit'), document.getElementById('Refresh')]; // Corrected name
const attempts = document.getElementById('Attempts');
const result = document.getElementById('result');
const guesses = document.getElementById('Guesses');

wordInput.addEventListener('focus', () => {
    if (window.innerWidth > 820) { // Check if in desktop mode
        document.querySelectorAll('#GuessForm .Input').forEach(element => {
            if (element.id !== "word") {
                element.classList.add('transparent'); // Add transparency class
            }
        });
    }
    wordInput.classList.add('active');
    buttons.forEach(button => {
        button.classList.add('inactive');
    });
});

wordInput.addEventListener('blur', () => {
    document.querySelectorAll('#GuessForm .Input').forEach(element => {
        element.classList.remove('transparent'); // Remove transparency class
    });
    wordInput.classList.remove('active');
    buttons.forEach(button => {
        button.classList.remove('inactive');
    });
});
