    // Sistema de sonido programÃ¡tico usando Web Audio API
    class SoundSystem {
        constructor() {
            this.audioContext = null;
            this.masterVolume = 0.3;
            this.enabled = true;
            this.initAudio();
        }
        
        initAudio() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API no soportada');
                this.enabled = false;
            }
        }
        
        // Crear un oscilador con parÃ¡metros especÃ­ficos
        createOscillator(frequency, type = 'sine', duration = 0.2) {
            if (!this.enabled || !this.audioContext) {return;}
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
            return { oscillator, gainNode };
        }
        
        // Sonido de salto (tono ascendente)
        playJump() {
            if (!this.enabled) {return;}
            
            const startFreq = 200;
            const endFreq = 400;
            const duration = 0.3;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.8, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        }
        
        // Sonido de recolecciÃ³n de moneda (tono agudo y brillante)
        playCoin() {
            if (!this.enabled) {return;}
            
            // Crear mÃºltiples tonos para un sonido mÃ¡s rico
            const frequencies = [523, 659, 784]; // Do, Mi, Sol
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createOscillator(freq, 'sine', 0.15);
                }, index * 50);
            });
        }
        
        // Sonido de colisiÃ³n/daÃ±o (tono grave y Ã¡spero)
        playHit() {
            if (!this.enabled) {return;}
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.4);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.4);
        }
        
        // Sonido de power-up (secuencia ascendente)
        playPowerUp() {
            if (!this.enabled) {return;}
            
            const notes = [262, 330, 392, 523]; // Do, Mi, Sol, Do octava
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.createOscillator(freq, 'triangle', 0.2);
                }, index * 80);
            });
        }
        
        // Sonido de completar nivel (fanfarria)
        playLevelComplete() {
            if (!this.enabled) {return;}
            
            const melody = [523, 659, 784, 1047]; // Do, Mi, Sol, Do
            
            melody.forEach((freq, index) => {
                setTimeout(() => {
                    this.createOscillator(freq, 'sine', 0.5);
                }, index * 200);
            });
        }
        
        // Sonido de game over (secuencia descendente)
        playGameOver() {
            if (!this.enabled) {return;}
            
            const notes = [392, 349, 311, 262]; // Sol, Fa, Miâ™­, Do
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.createOscillator(freq, 'triangle', 0.6);
                }, index * 300);
            });
        }
        
        // MÃºsica de fondo simple (opcional)
        playBackgroundMusic() {
            if (!this.enabled || this.backgroundPlaying) {return;}
            
            this.backgroundPlaying = true;
            const melody = [262, 294, 330, 349, 392, 440, 494, 523]; // Escala de Do mayor
            let noteIndex = 0;
            
            const playNextNote = () => {
                if (!this.backgroundPlaying) {return;}
                
                this.createOscillator(melody[noteIndex], 'sine', 0.8);
                noteIndex = (noteIndex + 1) % melody.length;
                
                setTimeout(playNextNote, 1000);
            };
            
            playNextNote();
        }
        
        stopBackgroundMusic() {
            this.backgroundPlaying = false;
        }
        
        // Alternar sonido
        toggleSound() {
            this.enabled = !this.enabled;
            if (!this.enabled) {
                this.stopBackgroundMusic();
            }
            return this.enabled;
        }
    }
    
    const soundSystem = new SoundSystem();
