const morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..'
        };

        // Morse timing is counted in units: a dot is 1, a dash 3, the gap
        // between symbols 1. One unit lasts 1200 / WPM milliseconds, the
        // standard ("PARIS") definition of words per minute.
        const DOT = 1;
        const DASH = 3;
        const SYMBOL_GAP = 1;
        // Learners get more time between letters than the standard 3 units
        // (Farnsworth spacing): the letter is shown first, and stays a moment.
        const SHOW_LETTER = 2;
        const LETTER_GAP = 7;
        // One tone for both: dots and dashes differ only in length.
        const TONE_HZ = 650;

        let currentIndex = 0;
        let isRunning = false;
        let phase = 'show'; // show the letter, key its symbols, then hold it
        let symbolIndex = 0;
        let keyed = false;
        let currentTimeout;
        let wpm = 10;
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

        function unitMs() {
            return 1200 / wpm;
        }

        // Audio functions
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            // Browsers start audio suspended until a click.
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }

        /** A keyed tone: full volume for its length, with 5 ms edges so it doesn't click. */
        function playTone(seconds) {
            if (!audioEnabled || !audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = TONE_HZ;
            oscillator.type = 'sine';

            const now = audioContext.currentTime;
            const edge = Math.min(0.005, seconds / 4);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.15, now + edge);
            gainNode.gain.setValueAtTime(0.15, now + seconds - edge);
            gainNode.gain.linearRampToValueAtTime(0, now + seconds);

            oscillator.start(now);
            oscillator.stop(now + seconds);
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
            Array.from(morseLightsEl.children).forEach(light => light.classList.remove('active', 'done'));
            currentLetterEl.classList.remove('active');
        }

        function after(units) {
            currentTimeout = setTimeout(animateStep, units * unitMs());
        }

        /**
         * One step of playback. Each symbol lights, and sounds, for exactly its
         * length, then stays dimly lit, so the pattern builds up as it is sent.
         */
        function animateStep() {
            if (!isRunning) return;

            const morse = morseCode[letters[currentIndex]];
            const lights = morseLightsEl.children;

            if (phase === 'show') {
                updateDisplay(letters[currentIndex]);
                clearAllLights();
                phase = 'key';
                symbolIndex = 0;
                keyed = false;
                return after(SHOW_LETTER);
            }

            if (phase === 'key') {
                const units = morse[symbolIndex] === '.' ? DOT : DASH;
                if (!keyed) {
                    lights[symbolIndex].classList.add('active');
                    playTone((units * unitMs()) / 1000);
                    keyed = true;
                    return after(units);
                }
                lights[symbolIndex].classList.replace('active', 'done');
                keyed = false;
                symbolIndex++;
                if (symbolIndex < morse.length) return after(SYMBOL_GAP);
                phase = 'hold';
                currentLetterEl.classList.add('active');
                return after(LETTER_GAP);
            }

            // The letter has been held: on to the next one, round the alphabet.
            currentIndex = (currentIndex + 1) % letters.length;
            phase = 'show';
            animateStep();
        }

        function start() {
            initAudio();
            if (!isRunning) {
                isRunning = true;
                startBtn.textContent = 'RUNNING...';
                startBtn.classList.add('running');
                animateStep();
            }
        }

        function pause() {
            isRunning = false;
            clearTimeout(currentTimeout);
            startBtn.textContent = 'START';
            startBtn.classList.remove('running');
        }

        function reset() {
            pause();
            currentIndex = 0;
            phase = 'show';
            updateDisplay(letters[currentIndex]);
            clearAllLights();
        }

        function toggleAudio() {
            initAudio();
            audioEnabled = !audioEnabled;
            audioBtn.textContent = audioEnabled ? 'SOUND ON' : 'SOUND OFF';
            audioBtn.style.color = audioEnabled ? '#00ff88' : '#00ff41';
        }

        // Event listeners
        startBtn.addEventListener('click', start);
        pauseBtn.addEventListener('click', pause);
        resetBtn.addEventListener('click', reset);
        audioBtn.addEventListener('click', toggleAudio);

        // Takes effect from the next symbol, also while playing.
        speedSlider.addEventListener('input', (e) => {
            wpm = parseInt(e.target.value, 10);
            speedValue.textContent = wpm + ' WPM';
        });

        // Space starts and pauses, R resets.
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                isRunning ? pause() : start();
            } else if (e.key === 'r' || e.key === 'R') {
                reset();
            }
        });

        // Initialize
        createCircuitLines();
        updateDisplay(letters[currentIndex]);
        
        // Recreate circuit lines periodically for dynamic effect
        setInterval(createCircuitLines, 8000);
