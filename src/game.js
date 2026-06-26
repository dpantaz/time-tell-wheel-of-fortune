/**
 * Wheel of Fortune - Time Learning Game
 * Main game logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const ROUNDS_PER_PLAYER = 5;
    const AVAILABLE_COLORS = [
        { name: 'Κόκκινο', value: '#e74c3c', bg: 'linear-gradient(135deg, #e74c3c88 0%, #c0392b66 100%)' },
        { name: 'Μπλε', value: '#3498db', bg: 'linear-gradient(135deg, #3498db88 0%, #2980b966 100%)' },
        { name: 'Πράσινο', value: '#27ae60', bg: 'linear-gradient(135deg, #27ae6088 0%, #229a5466 100%)' },
        { name: 'Πορτοκαλί', value: '#f39c12', bg: 'linear-gradient(135deg, #f39c1288 0%, #d6891066 100%)' },
        { name: 'Μωβ', value: '#9b59b6', bg: 'linear-gradient(135deg, #9b59b688 0%, #8e44ad66 100%)' },
        { name: 'Ροζ', value: '#e91e63', bg: 'linear-gradient(135deg, #e91e6388 0%, #c2185b66 100%)' },
    ];

    let players = [];
    let currentPlayerIndex = 0;
    let currentPoints = 0;
    let roundsPlayed = 0;
    let totalRounds = 0;
    let gamePhase = 'setup'; // setup, spin, answer, gameover
    let wheel = null;
    let clock = null;

    // DOM elements
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const playerSetup = document.getElementById('player-setup');
    const btnStart = document.getElementById('btn-start');
    const btnSpin = document.getElementById('btn-spin');
    const btnRestart = document.getElementById('btn-restart');
    const scoreboard = document.getElementById('scoreboard');
    const turnIndicator = document.getElementById('turn-indicator');
    const wheelResult = document.getElementById('wheel-result');
    const answersContainer = document.getElementById('answers-container');
    const answersDiv = document.getElementById('answers');

    // Setup: player count selection
    document.querySelectorAll('.btn-count').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const count = parseInt(btn.dataset.count);
            showPlayerSetup(count);
        });
    });

    function showPlayerSetup(count) {
        playerSetup.classList.remove('hidden');
        playerSetup.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'player-config';
            div.innerHTML = `
                <label>Παίκτης ${i + 1}:</label>
                <input type="text" class="player-name" placeholder="Όνομα" maxlength="12" value="Παίκτης ${i + 1}">
                <div class="color-options" data-player="${i}">
                    ${AVAILABLE_COLORS.map((c, ci) => `
                        <button type="button" class="color-btn ${ci === i ? 'selected' : ''}" 
                                data-color-index="${ci}" 
                                style="background-color:${c.value};" 
                                title="${c.name}"></button>
                    `).join('')}
                </div>
            `;
            playerSetup.appendChild(div);
        }

        // Color selection
        playerSetup.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = btn.closest('.color-options');
                parent.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        btnStart.classList.remove('hidden');
    }

    // Start game
    btnStart.addEventListener('click', () => {
        const names = playerSetup.querySelectorAll('.player-name');
        const colorOptions = playerSetup.querySelectorAll('.color-options');
        
        players = [];
        for (let i = 0; i < names.length; i++) {
            const selectedColor = colorOptions[i].querySelector('.color-btn.selected');
            const colorIndex = selectedColor ? parseInt(selectedColor.dataset.colorIndex) : i;
            players.push({
                name: names[i].value || `Παίκτης ${i + 1}`,
                color: AVAILABLE_COLORS[colorIndex],
                score: 0
            });
        }

        totalRounds = players.length * ROUNDS_PER_PLAYER;
        roundsPlayed = 0;
        currentPlayerIndex = 0;
        
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        wheel = new WheelOfFortune('wheel-canvas');
        clock = new AnalogClock('clock');
        
        wheel.onSpinComplete = onWheelResult;
        
        startTurn();
    });

    function startTurn() {
        gamePhase = 'spin';
        const player = players[currentPlayerIndex];
        
        // Update background
        document.body.style.background = player.color.bg;
        
        // Update scoreboard
        updateScoreboard();
        
        // Update turn indicator
        turnIndicator.innerHTML = `Σειρά: <span style="color:${player.color.value}; font-weight:bold">${player.name}</span>`;
        
        // Reset UI
        btnSpin.classList.remove('hidden');
        btnSpin.disabled = false;
        wheelResult.classList.add('hidden');
        answersContainer.classList.add('hidden');
        answersDiv.innerHTML = '';
    }

    function updateScoreboard() {
        scoreboard.innerHTML = players.map((p, i) => `
            <div class="score-item ${i === currentPlayerIndex ? 'active' : ''}" 
                 style="border-color:${p.color.value}">
                <span class="score-name" style="color:${p.color.value}">${p.name}</span>
                <span class="score-value">${p.score}</span>
            </div>
        `).join('');
    }

    // Spin
    btnSpin.addEventListener('click', () => {
        if (gamePhase !== 'spin') return;
        btnSpin.disabled = true;
        wheel.spin();
    });

    function onWheelResult(segment) {
        if (segment.value === -1) {
            // Bankruptcy
            wheelResult.classList.remove('hidden');
            wheelResult.innerHTML = `<span class="bankruptcy">💥 ΧΡΕΟΚΟΠΙΑ! Χάνεις όλους τους πόντους!</span>`;
            players[currentPlayerIndex].score = 0;
            updateScoreboard();
            
            setTimeout(() => {
                nextPlayer();
            }, 2500);
        } else {
            currentPoints = segment.value;
            wheelResult.classList.remove('hidden');
            wheelResult.innerHTML = `Παίζεις για <strong>${currentPoints}</strong> πόντους!`;
            
            setTimeout(() => {
                showQuestion();
            }, 1500);
        }
    }

    function showQuestion() {
        gamePhase = 'answer';
        btnSpin.classList.add('hidden');
        
        // Set random time on clock
        clock.setRandomTime();
        const time = clock.getTime();
        
        // Generate correct answer
        const correctAnswer = TimeWords.toWords('el', time.hours, time.minutes);
        
        // Generate 2 wrong answers
        const wrongAnswers = generateWrongAnswers(time.hours, time.minutes);
        
        // Shuffle answers
        const allAnswers = [correctAnswer, ...wrongAnswers];
        shuffleArray(allAnswers);
        
        // Show answers
        answersContainer.classList.remove('hidden');
        answersDiv.innerHTML = '';
        
        allAnswers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-answer';
            btn.textContent = answer;
            btn.addEventListener('click', () => {
                if (gamePhase !== 'answer') return;
                gamePhase = 'result';
                checkAnswer(btn, answer, correctAnswer);
            });
            answersDiv.appendChild(btn);
        });
    }

    function generateWrongAnswers(correctHours, correctMinutes) {
        const wrong = [];
        const usedTimes = new Set();
        usedTimes.add(`${correctHours}:${correctMinutes}`);
        
        while (wrong.length < 2) {
            let h = Math.floor(Math.random() * 12) + 1;
            let m = Math.floor(Math.random() * 12) * 5;
            const key = `${h}:${m}`;
            
            if (!usedTimes.has(key)) {
                usedTimes.add(key);
                wrong.push(TimeWords.toWords('el', h, m));
            }
        }
        
        return wrong;
    }

    function checkAnswer(selectedBtn, selectedAnswer, correctAnswer) {
        const allBtns = answersDiv.querySelectorAll('.btn-answer');
        
        allBtns.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        if (selectedAnswer === correctAnswer) {
            selectedBtn.classList.add('correct');
            players[currentPlayerIndex].score += currentPoints;
            wheelResult.innerHTML = `✅ Σωστά! +${currentPoints} πόντοι!`;
        } else {
            selectedBtn.classList.add('wrong');
            wheelResult.innerHTML = `❌ Λάθος! Η σωστή απάντηση ήταν η επισημασμένη.`;
        }
        
        updateScoreboard();
        
        setTimeout(() => {
            nextPlayer();
        }, 2500);
    }

    function nextPlayer() {
        roundsPlayed++;
        
        if (roundsPlayed >= totalRounds) {
            endGame();
            return;
        }
        
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        startTurn();
    }

    function endGame() {
        gamePhase = 'gameover';
        gameScreen.classList.add('hidden');
        gameoverScreen.classList.remove('hidden');
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        // Sort by score descending
        const sorted = [...players].sort((a, b) => b.score - a.score);
        const finalScores = document.getElementById('final-scores');
        finalScores.innerHTML = sorted.map((p, i) => `
            <div class="final-score-item">
                <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span class="final-name" style="color:${p.color.value}">${p.name}</span>
                <span class="final-points">${p.score} πόντοι</span>
            </div>
        `).join('');
    }

    // Restart
    btnRestart.addEventListener('click', () => {
        gameoverScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        players = [];
        currentPlayerIndex = 0;
        roundsPlayed = 0;
        playerSetup.innerHTML = '';
        playerSetup.classList.add('hidden');
        btnStart.classList.add('hidden');
        document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('selected'));
    });

    // Utilities
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
});
