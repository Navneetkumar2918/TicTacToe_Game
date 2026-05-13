const cells = document.querySelectorAll('.cell');
const titleHeader = document.querySelector('#titleHeader');

const xPlayer = document.querySelector('#xPlayerDisplay');
const oPlayer = document.querySelector('#oPlayerDisplay');

const restartBtn = document.querySelector('#restartBtn');
const startTimerBtn = document.querySelector('#startTimerBtn');
const undoBtn = document.querySelector('#undoBtn');

const timerEl = document.querySelector('#timer');

const modeBtns = document.querySelectorAll('.modeBtn');
const levelBtns = document.querySelectorAll('.levelBtn');

// ================= GAME DATA =================
let player = '';
let isPause = false;
let isGameStart = false;

let mode = null;
let level = null;

let input = ['', '', '', '', '', '', '', '', ''];

let timer;
let time = 5;

// Move history for Undo
let moveHistory = [];

// ================= TIME BY LEVEL =================
const levelTime = {
    easy: 8,
    medium: 5,
    hard: 3
};

// ================= WIN CONDITIONS =================
const wins = [
    { c: [0, 1, 2] },
    { c: [3, 4, 5] },
    { c: [6, 7, 8] },

    { c: [0, 3, 6] },
    { c: [1, 4, 7] },
    { c: [2, 5, 8] },

    { c: [0, 4, 8] },
    { c: [2, 4, 6] }
];

// ================= MODE SELECTION =================
modeBtns.forEach(btn => {
    btn.onclick = () => {
        if (isGameStart) return;

        modeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        mode = btn.dataset.mode;
        ready();
    };
});

// ================= LEVEL SELECTION =================
levelBtns.forEach(btn => {
    btn.onclick = () => {
        if (isGameStart) return;

        levelBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        level = btn.dataset.level;
        ready();
    };
});

// ================= PLAYER SELECTION =================
function choosePlayer(p) {
    if (isGameStart) return;

    player = p;

    xPlayer.classList.remove('player-active');
    oPlayer.classList.remove('player-active');

    if (p === 'X') {
        xPlayer.classList.add('player-active');
    } else {
        oPlayer.classList.add('player-active');
    }

    ready();
}

// ================= READY =================
function ready() {
    if (player && mode && level) {
        titleHeader.textContent = 'Ready 🎮';
    }
}

// ================= START GAME =================
startTimerBtn.onclick = () => {
    if (!player || !mode || !level) {
        alert('Select All Options First!');
        return;
    }

    isGameStart = true;
    isPause = false;
    moveHistory = [];

    titleHeader.textContent = `${player}'s Turn`;
    startTimer();

    // If CPU mode and player selected O, CPU (X) starts first
    if (mode === 'cpu' && player === 'O') {
        player = 'X';
        setTimeout(cpu, 500);
    }
};

// ================= TIMER =================
function startTimer() {
    clearInterval(timer);

    time = levelTime[level];
    timerEl.textContent = time;

    timer = setInterval(() => {
        time--;
        timerEl.textContent = time;

        if (time <= 0) {
            lose();
        }
    }, 1000);
}

// ================= LOSE =================
function lose() {
    clearInterval(timer);

    titleHeader.textContent = `${player} Lost ⏱️`;
    isPause = true;

    restartBtn.style.visibility = 'visible';
}

// ================= CELL CLICK =================
cells.forEach((cell, index) => {
    cell.onclick = () => {
        if (!isGameStart || isPause) return;
        if (input[index] !== '') return;

        play(index);
    };
});

// ================= PLAY MOVE =================
function play(index) {
    // Save move for Undo
    moveHistory.push({
        index: index,
        player: player
    });

    // Update board
    input[index] = player;

    cells[index].textContent = player;
    cells[index].style.color =
        player === 'X' ? '#00D9FF' : '#00FF9C';

    // Check win/draw
    if (check()) return;

    // Switch turn
    switchPlayer();
    titleHeader.textContent = `${player}'s Turn`;

    // Restart timer
    startTimer();

    // CPU move
    if (mode === 'cpu' && player === 'O' && !isPause) {
        setTimeout(cpu, 500);
    }
}

// ================= SWITCH PLAYER =================
function switchPlayer() {
    player = player === 'X' ? 'O' : 'X';
}

// ================= CPU MOVE =================
function cpu() {
    if (isPause) return;

    const empty = [];

    input.forEach((value, index) => {
        if (value === '') {
            empty.push(index);
        }
    });

    if (empty.length === 0) return;

    const randomIndex =
        empty[Math.floor(Math.random() * empty.length)];

    play(randomIndex);
}

// ================= CHECK WIN / DRAW =================
function check() {
    for (const data of wins) {
        const [a, b, c] = data.c;

        if (
            input[a] === player &&
            input[b] === player &&
            input[c] === player
        ) {
            mark([a, b, c]);
            end();
            return true;
        }
    }

    // Draw
    if (input.every(value => value !== '')) {
        titleHeader.textContent = 'Draw 😐';
        isPause = true;

        restartBtn.style.visibility = 'visible';
        clearInterval(timer);

        return true;
    }

    return false;
}

// ================= HIGHLIGHT WIN =================
function mark(arr) {
    arr.forEach(index => {
        cells[index].classList.add('win');
    });
}

// ================= END GAME =================
function end() {
    titleHeader.textContent = `${player} Wins 🎉`;
    isPause = true;

    restartBtn.style.visibility = 'visible';
    clearInterval(timer);
}

// ================= UNDO MOVE =================
undoBtn.onclick = () => {
    if (!isGameStart || moveHistory.length === 0) return;

    // If game ended, allow undo and continue
    isPause = false;
    restartBtn.style.visibility = 'hidden';

    // Remove win highlight
    cells.forEach(cell => {
        cell.classList.remove('win');
    });

    // In CPU mode, undo both player's and CPU's move
    let movesToUndo = mode === 'cpu' ? 2 : 1;

    while (movesToUndo > 0 && moveHistory.length > 0) {
        const lastMove = moveHistory.pop();

        input[lastMove.index] = '';
        cells[lastMove.index].textContent = '';
        cells[lastMove.index].style.color = '';

        player = lastMove.player;
        movesToUndo--;
    }

    titleHeader.textContent = `${player}'s Turn`;
    startTimer();
};

// ================= RESTART GAME =================
restartBtn.onclick = () => {
    // Clear board data
    input.fill('');

    // Clear move history
    moveHistory = [];

    // Clear UI
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
        cell.style.color = '';
    });

    // Hide restart button
    restartBtn.style.visibility = 'hidden';

    // Reset state
    isPause = false;
    isGameStart = false;

    player = '';
    mode = null;
    level = null;

    // Stop timer
    clearInterval(timer);
    timerEl.textContent = '--';

    // Reset header
    titleHeader.textContent = 'Choose';

    // Remove selected buttons
    modeBtns.forEach(btn => btn.classList.remove('selected'));
    levelBtns.forEach(btn => btn.classList.remove('selected'));

    // Remove active player
    xPlayer.classList.remove('player-active');
    oPlayer.classList.remove('player-active');
};