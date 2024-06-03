const difficulties = [
    "Ruby", "Crystal", "Gem", "Diamond", "Gold",
    "Rubient", "Azaula", "Red Crystal", "Blade", "Warrior",
    "Master", "Legend", "Mythic", "Mythical Legend", "Legendary Immortal"
];

let currentLevel = 1;
let questions = [];

for (let i = 0; i < 150; i++) {
    questions.push({
        question: `Question ${i + 1} of difficulty ${difficulties[Math.floor(i / 10)]}`,
        answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        correct: Math.floor(Math.random() * 4)
    });
}

function loadLevel() {
    if (currentLevel > 150) {
        document.getElementById('game').classList.add('hidden');
        document.getElementById('congratulations').classList.remove('hidden');
        return;
    }

    const level = questions[currentLevel - 1];
    document.getElementById('level-info').innerText = `Level ${currentLevel} - ${difficulties[Math.floor((currentLevel - 1) / 10)]}`;
    document.getElementById('question').innerText = level.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    level.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.onclick = () => checkAnswer(index);
        answersDiv.appendChild(button);
    });

    document.getElementById('next-button').style.display = 'none';
    document.getElementById('restart-button').style.display = 'none';
}

function checkAnswer(index) {
    if (index === questions[currentLevel - 1].correct) {
        alert('Correct!');
        document.getElementById('next-button').style.display = 'block';
    } else {
        alert('Incorrect! Try again.');
    }
}

function nextLevel() {
    currentLevel++;
    loadLevel();
}

function restartGame() {
    currentLevel = 1;
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('congratulations').classList.add('hidden');
    loadLevel();
}

document.addEventListener('DOMContentLoaded', loadLevel);
