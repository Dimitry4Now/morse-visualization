const morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..'
        };

        let currentIndex = 0;
        let isRunning = false;
        let animationStep = 0;
        let currentTimeout;
        let speedMultiplier = 1;
        let audioEnabled = false;
        let audioContext;
        const letters = Object.keys(morseCode);

        // DOM elements
        const currentLetterEl = document.getElementById('currentLetter');
        const morsePatternEl = document.getElementById('morsePattern');
        const morseLightsEl = document.getElementById('morseLights');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const audioBtn = document.getElementById('audioBtn');
        const progressEl = document.getElementById('progress');
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        const currentProgress = document.getElementById('currentProgress');
        const currentLetter2 = document.getElementById('currentLetter2');

        // Audio functions
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playTone(frequency, duration) {
            if (!audioEnabled || !audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        }

        function createCircuitLines() {
            const circuitLines = document.getElementById('circuitLines');
            circuitLines.innerHTML = '';
            
            for (let i = 0; i < 20; i++) {
                const line = document.createElement('div');
                line.className = 'circuit-line';
                line.style.width = Math.random() * 300 + 100 + 'px';
                line.style.top = Math.random() * 100 + '%';
                line.style.left = Math.random() * 100 + '%';
                line.style.setProperty('--rotation', Math.random() * 360 + 'deg');
                line.style.animationDelay = Math.random() * 4 + 's';
                circuitLines.appendChild(line);
            }
        }

        function createMorseLights(morse) {
            morseLightsEl.innerHTML = '';
            
            for (let symbol of morse) {
                const element = document.createElement('div');
                element.className = `morse-element ${symbol === '.' ? 'dot' : 'dash'}`;
                morseLightsEl.appendChild(element);
            }
        }

        function updateDisplay(letter) {
            const morse = morseCode[letter];
            currentLetterEl.textContent = letter;
            morsePatternEl.textContent = morse.replace(/\./g, '•').replace(/-/g, '—');
            createMorseLights(morse);
            updateProgress();
        }

        function updateProgress() {
            const progress = ((currentIndex + 1) / letters.length) * 100;
            progressEl.style.width = progress + '%';
            currentProgress.textContent = `Letter ${currentIndex + 1} of ${letters.length}`;
            currentLetter2.textContent = letters[currentIndex];
        }

        function clearAllLights() {
            const lights = morseLightsEl.children;
            Array.from(lights).forEach(light => light.classList.remove('active'));
            currentLetterEl.classList.remove('active');
        }

        function animateStep() {
            if (!isRunning) return;

            const letter = letters[currentIndex];
            const morse = morseCode[letter];
            const lights = morseLightsEl.children;

            if (animationStep === 0) {
                updateDisplay(letter);
                clearAllLights();
                animationStep = 1;
                currentTimeout = setTimeout(animateStep, 100 / speedMultiplier);
            } else if (animationStep <= morse.length) {
                const lightIndex = animationStep - 1;
                const symbol = morse[lightIndex];
                lights[lightIndex].classList.add('active');
                
                // Play sound
                if (audioEnabled) {
                    const frequency = symbol === '.' ? 800 : 400;
                    const duration = (symbol === '.' ? 0.15 : 0.45) / speedMultiplier;
                    playTone(frequency, duration);
                }
                
                animationStep++;
                const delay = symbol === '.' ? 300 : 700;
                currentTimeout = setTimeout(animateStep, delay / speedMultiplier);
            } else if (animationStep === morse.length + 1) {
                currentLetterEl.classList.add('active');
                animationStep++;
                currentTimeout = setTimeout(animateStep, 1500 / speedMultiplier);
            } else {
                clearAllLights();
                animationStep = 0;
                currentIndex++;
                
                if (currentIndex >= letters.length) {
                    currentIndex = 0;
                }
                
                currentTimeout = setTimeout(animateStep, 500 / speedMultiplier);
            }
        }

        function start() {
            if (!isRunning) {
                initAudio();
                isRunning = true;
                startBtn.textContent = 'RUNNING...';
                startBtn.classList.add('running');
                animateStep();
            }
        }

        function pause() {
            isRunning = false;
            if (currentTimeout) {
                clearTimeout(currentTimeout);
            }
            startBtn.textContent = 'START';
            startBtn.classList.remove('running');
        }

        function reset() {
            pause();
            currentIndex = 0;
            animationStep = 0;
            updateDisplay(letters[currentIndex]);
            clearAllLights();
        }

        function toggleAudio() {
            audioEnabled = !audioEnabled;
            audioBtn.textContent = audioEnabled ? 'SOUND ON' : 'SOUND OFF';
            audioBtn.style.color = audioEnabled ? '#00ff88' : '#00ff41';
        }

        // Event listeners
        startBtn.addEventListener('click', start);
        pauseBtn.addEventListener('click', pause);
        resetBtn.addEventListener('click', reset);
        audioBtn.addEventListener('click', toggleAudio);

        speedSlider.addEventListener('input', (e) => {
            speedMultiplier = parseFloat(e.target.value);
            speedValue.textContent = speedMultiplier.toFixed(1) + 'x';
        });

        // Initialize
        createCircuitLines();
        updateDisplay(letters[currentIndex]);
        
        // Recreate circuit lines periodically for dynamic effect
        setInterval(createCircuitLines, 8000);
