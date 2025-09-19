
        // Estado Global
        let currentScreen = 'homeScreen';
        let currentAvatar = '🐥';
        let currentTheme = 'default';
        let audioEnabled = true;
        let draggedElement = null;
        
        // Pontuações
        let scores = {
            vowels: 0,
            syllables: 0,
            words: 0,
            rhymes: 0,
            bingo: 0,
            memory: 0,
            total: 0
        };

        // Dados das Vogais
        const vowelData = {
            A: [
                { emoji: '🐝', word: 'Abelha' },
                { emoji: '✈️', word: 'Avião' },
                { emoji: '🌟', word: 'Astro' },
                { emoji: '🚗', word: 'Auto' },
                { emoji: '🦅', word: 'Águia' }
            ],
            E: [
                { emoji: '🐘', word: 'Elefante' },
                { emoji: '⭐', word: 'Estrela' },
                { emoji: '🏫', word: 'Escola' },
                { emoji: '🪜', word: 'Escada' },
                { emoji: '🗡️', word: 'Espada' }
            ],
            I: [
                { emoji: '🏝️', word: 'Ilha' },
                { emoji: '⛪', word: 'Igreja' },
                { emoji: '🧲', word: 'Imã' },
                { emoji: '🦎', word: 'Iguana' },
                { emoji: '🍦', word: 'Iogurte' }
            ],
            O: [
                { emoji: '🐙', word: 'Oito' },
                { emoji: '👁️', word: 'Olho' },
                { emoji: '🥚', word: 'Ovo' },
                { emoji: '🌊', word: 'Onda' },
                { emoji: '🐻', word: 'Onça' }
            ],
            U: [
                { emoji: '🦄', word: 'Unicórnio' },
                { emoji: '🍇', word: 'Uva' },
                { emoji: '🐻', word: 'Urso' },
                { emoji: '🏭', word: 'Usina' },
                { emoji: '☂️', word: 'Umbrela' }
            ]
        };

        // Inicialização
        window.onload = function() {
            loadSettings();
            initDragAndDrop();
            if (audioEnabled) {
                playBackgroundMusic();
            }
        };

        // Navegação
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
            currentScreen = screenId;
            playSound('transition');
        }

        function goHome() {
            showScreen('homeScreen');
        }

        function startActivity(activity) {
            switch(activity) {
                case 'vowels':
                    showScreen('vowelsScreen');
                    break;
                case 'syllables':
                    startSyllableGame();
                    break;
                case 'words':
                    startWordGame();
                    break;
                case 'rhymes':
                    startRhymeGame();
                    break;
                case 'bingo':
                    startBingoGame();
                    break;
                case 'memory':
                    startMemoryGame();
                    break;
                case 'story':
                    startStoryMode();
                    break;
                case 'complete':
                    startCompleteSession();
                    break;
            }
        }

        // Vogais
        function selectVowel(vowel) {
            playSound('click');
            speakLetter(vowel);
            
            document.querySelectorAll('.vowel-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            event.currentTarget.classList.add('selected');
            scores.vowels += 5;
            updateScore('vowelScore', scores.vowels);
        }

        function startVowelDragGame() {
            showScreen('vowelDragScreen');
            initVowelDragRound();
        }

        function initVowelDragRound() {
            const vowels = Object.keys(vowelData);
            const currentVowel = vowels[Math.floor(Math.random() * vowels.length)];
            
            // Criar letra arrastável
            const letterContainer = document.getElementById('letterContainer');
            letterContainer.innerHTML = `
                <div class="draggable-letter" draggable="true" data-vowel="${currentVowel}">
                    ${currentVowel}
                </div>
            `;
            
            // Criar alvos
            const targetsContainer = document.getElementById('targetsContainer');
            targetsContainer.innerHTML = '';
            
            // Adicionar alvo correto
            const correctTargets = vowelData[currentVowel];
            const correctTarget = correctTargets[Math.floor(Math.random() * correctTargets.length)];
            
            // Adicionar alvos incorretos
            const allTargets = [];
            allTargets.push({ ...correctTarget, correct: true, vowel: currentVowel });
            
            // Pegar alvos de outras vogais
            vowels.filter(v => v !== currentVowel).forEach(v => {
                const targets = vowelData[v];
                if (targets.length > 0) {
                    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
                    allTargets.push({ ...randomTarget, correct: false, vowel: v });
                }
            });
            
            // Embaralhar e pegar 3
            const shuffled = allTargets.sort(() => Math.random() - 0.5).slice(0, 3);
            
            shuffled.forEach(target => {
                const div = document.createElement('div');
                div.className = 'drop-target';
                div.dataset.correct = target.correct;
                div.dataset.vowel = target.vowel;
                div.innerHTML = `
                    <div class="target-emoji">${target.emoji}</div>
                    <div class="target-word">${target.word}</div>
                `;
                targetsContainer.appendChild(div);
            });
            
            // Reinicializar drag and drop
            initDragAndDrop();
        }

        // Drag and Drop
        function initDragAndDrop() {
            // Elementos arrastáveis
            document.querySelectorAll('.draggable-letter').forEach(elem => {
                elem.addEventListener('dragstart', handleDragStart);
                elem.addEventListener('dragend', handleDragEnd);
                
                // Touch events
                elem.addEventListener('touchstart', handleTouchStart, {passive: false});
                elem.addEventListener('touchmove', handleTouchMove, {passive: false});
                elem.addEventListener('touchend', handleTouchEnd);
            });
            
            // Alvos
            document.querySelectorAll('.drop-target').forEach(target => {
                target.addEventListener('dragover', handleDragOver);
                target.addEventListener('drop', handleDrop);
                target.addEventListener('dragleave', handleDragLeave);
                target.addEventListener('dragenter', handleDragEnter);
            });
        }

        function handleDragStart(e) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDragEnter(e) {
            const target = e.target.closest('.drop-target');
            if (target) target.classList.add('drag-over');
        }

        function handleDragLeave(e) {
            const target = e.target.closest('.drop-target');
            if (target) target.classList.remove('drag-over');
        }

        function handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = e.target.closest('.drop-target');
            if (target) {
                target.classList.remove('drag-over');
                const isCorrect = target.dataset.correct === 'true';
                
                if (isCorrect) {
                    target.classList.add('correct');
                    scores.vowels += 10;
                    scores.total += 10;
                    updateScore('dragScore', scores.vowels);
                    updateProgressBar();
                    showCelebration();
                    playSound('success');
                    
                    setTimeout(() => {
                        initVowelDragRound();
                    }, 1500);
                } else {
                    target.classList.add('incorrect');
                    playSound('error');
                    setTimeout(() => {
                        target.classList.remove('incorrect');
                    }, 500);
                }
            }
            
            return false;
        }

        // Touch handlers
        let touchItem = null;
        
        function handleTouchStart(e) {
            touchItem = e.target;
            const touch = e.touches[0];
            touchItem.style.position = 'fixed';
            touchItem.style.zIndex = '10000';
            touchItem.classList.add('dragging');
        }

        function handleTouchMove(e) {
            if (!touchItem) return;
            e.preventDefault();
            const touch = e.touches[0];
            touchItem.style.left = touch.pageX - 60 + 'px';
            touchItem.style.top = touch.pageY - 60 + 'px';
        }

        function handleTouchEnd(e) {
            if (!touchItem) return;
            
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropTarget = elementBelow?.closest('.drop-target');
            
            if (dropTarget) {
                const evt = new Event('drop', { bubbles: true });
                dropTarget.dispatchEvent(evt);
            }
            
            touchItem.style.position = '';
            touchItem.style.zIndex = '';
            touchItem.classList.remove('dragging');
            touchItem = null;
        }

        // Sílabas
        function startSyllableGame() {
            showScreen('syllablesScreen');
            loadSyllableRound();
        }

        function loadSyllableRound() {
            const syllables = ['BA', 'BE', 'BI', 'BO', 'BU', 'CA', 'CE', 'CI', 'CO', 'CU', 
                             'DA', 'DE', 'DI', 'DO', 'DU', 'FA', 'FE', 'FI', 'FO', 'FU'];
            const target = syllables[Math.floor(Math.random() * syllables.length)];
            
            document.getElementById('targetSyllable').textContent = target;
            document.getElementById('syllableSlots').innerHTML = `
                <div class="syllable-slot" id="slot1"></div>
                <div class="syllable-slot" id="slot2"></div>
            `;
            
            const letters = [...target, ...generateRandomLetters(4)].sort(() => Math.random() - 0.5);
            const optionsContainer = document.getElementById('letterOptions');
            optionsContainer.innerHTML = '';
            
            letters.forEach(letter => {
                const div = document.createElement('div');
                div.className = 'letter-option';
                div.textContent = letter;
                div.onclick = function() {
                    selectLetter(this, letter);
                };
                optionsContainer.appendChild(div);
            });
        }

        function selectLetter(element, letter) {
            const slot1 = document.getElementById('slot1');
            const slot2 = document.getElementById('slot2');
            
            if (!slot1.textContent) {
                slot1.textContent = letter;
                slot1.classList.add('filled');
            } else if (!slot2.textContent) {
                slot2.textContent = letter;
                slot2.classList.add('filled');
            }
            
            element.classList.add('used');
            playSound('click');
        }

        function checkSyllable() {
            const slot1 = document.getElementById('slot1').textContent;
            const slot2 = document.getElementById('slot2').textContent;
            const target = document.getElementById('targetSyllable').textContent;
            
            if (slot1 + slot2 === target) {
                scores.syllables += 15;
                scores.total += 15;
                updateScore('syllableScore', scores.syllables);
                showCelebration();
                playSound('success');
                setTimeout(loadSyllableRound, 1500);
            } else {
                playSound('error');
                document.querySelectorAll('.syllable-slot').forEach(slot => {
                    slot.textContent = '';
                    slot.classList.remove('filled');
                });
                document.querySelectorAll('.letter-option').forEach(opt => {
                    opt.classList.remove('used');
                });
            }
        }

        // Palavras
        function startWordGame() {
            showScreen('wordsScreen');
            loadWordRound();
        }

        function loadWordRound() {
            const words = [
                { word: 'GATO', emoji: '🐱' },
                { word: 'CASA', emoji: '🏠' },
                { word: 'BOLA', emoji: '⚽' },
                { word: 'PATO', emoji: '🦆' },
                { word: 'MESA', emoji: '🪑' }
            ];
            
            const target = words[Math.floor(Math.random() * words.length)];
            document.getElementById('targetWord').textContent = target.word;
            document.getElementById('wordImage').textContent = target.emoji;
            
            const slotsContainer = document.getElementById('wordSlots');
            slotsContainer.innerHTML = '';
            for (let i = 0; i < target.word.length; i++) {
                slotsContainer.innerHTML += '<div class="syllable-slot"></div>';
            }
            
            const letters = [...target.word, ...generateRandomLetters(4)].sort(() => Math.random() - 0.5);
            const optionsContainer = document.getElementById('wordLetterOptions');
            optionsContainer.innerHTML = '';
            
            letters.forEach(letter => {
                const div = document.createElement('div');
                div.className = 'letter-option';
                div.textContent = letter;
                div.onclick = function() {
                    selectWordLetter(this, letter);
                };
                optionsContainer.appendChild(div);
            });
        }

        function selectWordLetter(element, letter) {
            const slots = document.querySelectorAll('#wordSlots .syllable-slot');
            for (let slot of slots) {
                if (!slot.textContent) {
                    slot.textContent = letter;
                    slot.classList.add('filled');
                    element.classList.add('used');
                    playSound('click');
                    break;
                }
            }
        }

        function checkWord() {
            const slots = document.querySelectorAll('#wordSlots .syllable-slot');
            const formed = Array.from(slots).map(s => s.textContent).join('');
            const target = document.getElementById('targetWord').textContent;
            
            if (formed === target) {
                scores.words += 20;
                scores.total += 20;
                updateScore('wordScore', scores.words);
                showCelebration();
                playSound('success');
                setTimeout(loadWordRound, 1500);
            } else {
                playSound('error');
                slots.forEach(slot => {
                    slot.textContent = '';
                    slot.classList.remove('filled');
                });
                document.querySelectorAll('.letter-option').forEach(opt => {
                    opt.classList.remove('used');
                });
            }
        }

        // Rimas
        function startRhymeGame() {
            showScreen('rhymesScreen');
            loadRhymeRound();
        }

        function loadRhymeRound() {
            const rhymes = [
                { word: 'GATO', rhymes: ['PATO', 'RATO'], wrong: ['CASA', 'BOLA'] },
                { word: 'BOLA', rhymes: ['COLA', 'MOLA'], wrong: ['PATO', 'MESA'] },
                { word: 'PÃO', rhymes: ['CÃO', 'MÃO'], wrong: ['SOL', 'LUA'] }
            ];
            
            const target = rhymes[Math.floor(Math.random() * rhymes.length)];
            document.getElementById('rhymeWord').textContent = target.word;
            
            const options = [...target.rhymes.slice(0, 1), ...target.wrong.slice(0, 2)].sort(() => Math.random() - 0.5);
            const container = document.getElementById('rhymeOptions');
            container.innerHTML = '';
            
            options.forEach(option => {
                const div = document.createElement('div');
                div.className = 'rhyme-option';
                div.textContent = option;
                div.onclick = function() {
                    const isCorrect = target.rhymes.includes(option);
                    if (isCorrect) {
                        this.classList.add('correct');
                        scores.rhymes += 15;
                        scores.total += 15;
                        updateScore('rhymeScore', scores.rhymes);
                        showCelebration();
                        playSound('success');
                        setTimeout(loadRhymeRound, 1500);
                    } else {
                        this.classList.add('incorrect');
                        playSound('error');
                        setTimeout(() => this.classList.remove('incorrect'), 500);
                    }
                };
                container.appendChild(div);
            });
        }

        // Bingo
        function startBingoGame() {
            showScreen('bingoScreen');
            initBingo();
        }

        function initBingo() {
            const syllables = ['BA', 'BE', 'BI', 'BO', 'BU', 'CA', 'CE', 'CI', 'CO'];
            const grid = document.getElementById('bingoGrid');
            grid.innerHTML = '';
            
            syllables.forEach(syllable => {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                cell.textContent = syllable;
                cell.dataset.syllable = syllable;
                cell.onclick = function() {
                    const called = document.getElementById('calledItem').textContent;
                    if (this.dataset.syllable === called && !this.classList.contains('marked')) {
                        this.classList.add('marked');
                        scores.bingo += 10;
                        scores.total += 10;
                        updateScore('bingoScore', scores.bingo);
                        playSound('success');
                        showCelebration();
                        setTimeout(callNextBingo, 1500);
                    }
                };
                grid.appendChild(cell);
            });
            
            callNextBingo();
        }

        function callNextBingo() {
            const cells = document.querySelectorAll('.bingo-cell:not(.marked)');
            if (cells.length === 0) {
                showCelebration();
                alert('🎉 Parabéns! Você completou o Bingo!');
                initBingo();
                return;
            }
            
            const randomCell = cells[Math.floor(Math.random() * cells.length)];
            document.getElementById('calledItem').textContent = randomCell.dataset.syllable;
            speakText('Procure por ' + randomCell.dataset.syllable);
        }

        // Memory Game
        function startMemoryGame() {
            showScreen('memoryScreen');
            resetMemoryGame();
        }

        let memoryCards = [];
        let flippedCards = [];
        let matchedPairs = 0;

        function resetMemoryGame() {
            const pairs = ['A', 'E', 'I', 'O', 'U', 'B', 'C', 'D'];
            const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
            
            const grid = document.getElementById('memoryGrid');
            grid.innerHTML = '';
            flippedCards = [];
            matchedPairs = 0;
            
            cards.forEach((card, index) => {
                const div = document.createElement('div');
                div.className = 'memory-card';
                div.dataset.value = card;
                div.dataset.index = index;
                div.innerHTML = `
                    <div class="card-back">?</div>
                    <div class="card-front">${card}</div>
                `;
                div.onclick = function() {
                    flipCard(this);
                };
                grid.appendChild(div);
            });
        }

        function flipCard(card) {
            if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
                return;
            }
            
            card.classList.add('flipped');
            flippedCards.push(card);
            playSound('click');
            
            if (flippedCards.length === 2) {
                setTimeout(checkMemoryMatch, 600);
            }
        }

        function checkMemoryMatch() {
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.value === card2.dataset.value) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                scores.memory += 20;
                scores.total += 20;
                updateScore('memoryScore', scores.memory);
                playSound('success');
                
                if (matchedPairs === 8) {
                    showCelebration();
                    setTimeout(() => {
                        alert('🎉 Parabéns! Você encontrou todos os pares!');
                        resetMemoryGame();
                    }, 1500);
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                playSound('error');
            }
            
            flippedCards = [];
        }

        // Story Mode
        let storyScene = 0;
        const storyScenes = [
            {
                image: '🐥',
                text: 'O pintinho amarelinho encontrou a letra <span class="story-highlight">A</span>! Ele viu uma <span class="story-highlight">ABELHA</span> voando.',
                options: ['A', 'E', 'I']
            },
            {
                image: '🐘',
                text: 'Depois ele encontrou um <span class="story-highlight">ELEFANTE</span> com a letra <span class="story-highlight">E</span>!',
                options: ['O', 'U', 'E']
            },
            {
                image: '🏝️',
                text: 'Em uma <span class="story-highlight">ILHA</span>, ele descobriu a letra <span class="story-highlight">I</span>!',
                options: ['I', 'A', 'O']
            }
        ];

        function startStoryMode() {
            showScreen('storyScreen');
            storyScene = 0;
            loadStoryScene();
        }

        function loadStoryScene() {
            if (storyScene >= storyScenes.length) {
                storyScene = 0;
            }
            
            const scene = storyScenes[storyScene];
            document.getElementById('storyImage').textContent = scene.image;
            document.getElementById('storyText').innerHTML = scene.text;
            
            const container = document.querySelector('.story-options');
            container.innerHTML = '';
            
            scene.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'story-choice';
                btn.textContent = `Letra ${option}`;
                btn.onclick = function() {
                    nextStoryScene(option);
                };
                container.appendChild(btn);
            });
            
            speakText(scene.text.replace(/<[^>]*>/g, ''));
        }

        function nextStoryScene(choice) {
            playSound('click');
            storyScene++;
            
            if (storyScene >= storyScenes.length) {
                showCelebration();
                alert('🎉 Fim da história! Você aprendeu todas as vogais!');
                goHome();
            } else {
                loadStoryScene();
            }
        }

        // Complete Session
        function startCompleteSession() {
            const activities = ['vowels', 'syllables', 'words', 'rhymes', 'bingo'];
            let currentActivity = 0;
            
            function nextActivity() {
                if (currentActivity >= activities.length) {
                    showCelebration();
                    alert('🎉 Sessão completa! Você é incrível!');
                    showParentPanel();
                } else {
                    startActivity(activities[currentActivity]);
                    currentActivity++;
                    setTimeout(nextActivity, 30000); // 30 segundos por atividade
                }
            }
            
            nextActivity();
        }

        // Parent Panel
        function showParentPanel() {
            showScreen('parentScreen');
            generateProgressReport();
        }

        function generateProgressReport() {
            const report = document.getElementById('progressReport');
            report.innerHTML = '';
            
            const activities = [
                { name: 'Vogais', score: scores.vowels, max: 100 },
                { name: 'Sílabas', score: scores.syllables, max: 100 },
                { name: 'Palavras', score: scores.words, max: 100 },
                { name: 'Rimas', score: scores.rhymes, max: 100 },
                { name: 'Bingo', score: scores.bingo, max: 100 },
                { name: 'Memória', score: scores.memory, max: 100 }
            ];
            
            activities.forEach(activity => {
                const percentage = Math.min((activity.score / activity.max) * 100, 100);
                report.innerHTML += `
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: bold;">${activity.name}</span>
                            <span>${Math.round(percentage)}%</span>
                        </div>
                        <div style="background: #E5E5E5; border-radius: 10px; height: 20px; overflow: hidden;">
                            <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--purple-light), var(--pink)); transition: width 0.5s;"></div>
                        </div>
                    </div>
                `;
            });
        }

        // Avatar System
        function openAvatarModal() {
            document.getElementById('avatarModal').classList.add('active');
        }

        function closeAvatarModal() {
            document.getElementById('avatarModal').classList.remove('active');
        }

        function selectAvatar(avatar) {
            currentAvatar = avatar;
            document.getElementById('currentAvatar').textContent = avatar;
            localStorage.setItem('selectedAvatar', avatar);
            playSound('click');
        }

        // Theme System
        function openThemeSelector() {
            document.getElementById('themeModal').classList.add('active');
        }

        function closeThemeModal() {
            document.getElementById('themeModal').classList.remove('active');
        }

        function selectTheme(theme) {
            currentTheme = theme;
            applyTheme(theme);
            localStorage.setItem('selectedTheme', theme);
            playSound('click');
        }

        function applyTheme(theme) {
            const body = document.body;
            switch(theme) {
                case 'forest':
                    body.style.background = 'linear-gradient(180deg, #228B22, #90EE90)';
                    break;
                case 'ocean':
                    body.style.background = 'linear-gradient(180deg, #0077BE, #87CEEB)';
                    break;
                case 'space':
                    body.style.background = 'linear-gradient(180deg, #191970, #9370DB)';
                    break;
                default:
                    body.style.background = 'linear-gradient(180deg, var(--purple-main), var(--purple-dark))';
            }
        }

        // Audio System
        function toggleAudio() {
            audioEnabled = !audioEnabled;
            const toggle = document.getElementById('audioToggle');
            toggle.textContent = audioEnabled ? '🔊' : '🔇';
            toggle.classList.toggle('muted');
            
            if (audioEnabled) {
                playBackgroundMusic();
            } else {
                stopBackgroundMusic();
            }
        }

        function playBackgroundMusic() {
            // Simplified background music
            if (audioEnabled) {
                const bgMusic = document.getElementById('bgMusic');
                bgMusic.volume = 0.3;
                bgMusic.play().catch(e => console.log('Music autoplay blocked'));
            }
        }

        function stopBackgroundMusic() {
            document.getElementById('bgMusic').pause();
        }

        function playSound(type) {
            if (!audioEnabled) return;
            
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            switch(type) {
                case 'success':
                    oscillator.frequency.value = 523.25;
                    gainNode.gain.value = 0.3;
                    break;
                case 'error':
                    oscillator.frequency.value = 200;
                    gainNode.gain.value = 0.2;
                    break;
                case 'click':
                    oscillator.frequency.value = 800;
                    gainNode.gain.value = 0.1;
                    break;
                case 'transition':
                    oscillator.frequency.value = 440;
                    gainNode.gain.value = 0.2;
                    break;
            }
            
            oscillator.start();
            oscillator.stop(context.currentTime + 0.1);
        }

        function speakLetter(letter) {
            if (!audioEnabled) return;
            speakText(letter);
        }

        function speakText(text) {
            if (!audioEnabled || !('speechSynthesis' in window)) return;
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }

        // Celebrations
        function showCelebration() {
            const container = document.getElementById('celebrationContainer');
            container.innerHTML = '';
            
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';
                    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    container.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 50);
            }
        }

        // Utilities
        function updateScore(elementId, score) {
            document.getElementById(elementId).textContent = score;
        }

        function updateProgressBar() {
            const progress = Math.min((scores.total / 500) * 100, 100);
            document.getElementById('progressBar').style.width = progress + '%';
        }

        function generateRandomLetters(count) {
            const letters = 'BCDFGHJKLMNPQRSTVWXYZ';
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(letters[Math.floor(Math.random() * letters.length)]);
            }
            return result;
        }

        function loadSettings() {
            const savedAvatar = localStorage.getItem('selectedAvatar');
            if (savedAvatar) {
                currentAvatar = savedAvatar;
                document.getElementById('currentAvatar').textContent = savedAvatar;
            }
            
            const savedTheme = localStorage.getItem('selectedTheme');
            if (savedTheme) {
                currentTheme = savedTheme;
                applyTheme(savedTheme);
            }
        }

        // Prevent accidental navigation
        window.addEventListener('beforeunload', function(e) {
            if (currentScreen !== 'homeScreen') {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    
