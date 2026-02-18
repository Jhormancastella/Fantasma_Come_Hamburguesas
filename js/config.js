    // Deteccion de dispositivo
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const deviceInfo = document.getElementById('device-info');
    const controlsInfo = document.getElementById('controls-info');
    
    if (isMobile) {
        deviceInfo.textContent = "Dispositivo: movil";
        controlsInfo.innerHTML = "Usa los botones en pantalla para controlar a ALEX<br>El boton A para saltar, el boton P para pausar";
    } else {
        deviceInfo.textContent = "Dispositivo: Escritorio (Modo TV CRT)";
        controlsInfo.innerHTML = "Usa las flechas del teclado para mover a  Fantasma<br>Barra espaciadora para saltar, P para pausar, Enter para iniciar";
    }
    
    // Variables de estado del juego
    let gameStarted = false;
    let gamePaused = false;
    let currentLevel = 'facil';
    let gameTime = 0;
    let timerInterval;
    let cameraOffset = 0;
    let worldWidth = 4000; // Ancho total del mundo (mas alla de la pantalla)
    let characterImage = new Image();
    let enemyImage = new Image();
    let characterFacing = 'right'; // Direccion del personaje
    let animationFrameId;

    // Variables de nivel
    let currentROM = 1;
    let door = null; // { x: number, y: number, width: number, height: number, active: boolean }
    const roomThemes = [
        {
            name: 'Dia',
            skyTop: '#87CEEB',
            skyBottom: '#1e90ff',
            platformFill: '#8a5835',
            platformStroke: '#634221',
            grass: '#2ecc71',
            enemyColor: '#ff4d4d',
            doorOuter: '#8B4513',
            doorInner: '#5D4037',
            doorHandle: '#FFD700'
        },
        {
            name: 'Atardecer',
            skyTop: '#ffb347',
            skyBottom: '#ff6f61',
            platformFill: '#7a4b2f',
            platformStroke: '#4e2f1f',
            grass: '#78c850',
            enemyColor: '#ff7043',
            doorOuter: '#6d3a1c',
            doorInner: '#4a2815',
            doorHandle: '#f7c948'
        },
        {
            name: 'Noche',
            skyTop: '#0f2027',
            skyBottom: '#203a43',
            platformFill: '#4b3f72',
            platformStroke: '#332b50',
            grass: '#4caf50',
            enemyColor: '#ab47bc',
            doorOuter: '#3e2723',
            doorInner: '#2a1a18',
            doorHandle: '#ffca28'
        },
        {
            name: 'Amanecer',
            skyTop: '#74ebd5',
            skyBottom: '#acb6e5',
            platformFill: '#8d6e63',
            platformStroke: '#5d4037',
            grass: '#66bb6a',
            enemyColor: '#ef5350',
            doorOuter: '#795548',
            doorInner: '#5d4037',
            doorHandle: '#ffd54f'
        }
    ];
    function getCurrentRoomTheme() {
        const index = (currentROM - 1) % roomThemes.length;
        return roomThemes[index];
    }
    // Cargar la imagen del personaje
    characterImage.src = 'https://res.cloudinary.com/dipv76dpn/image/upload/v1757965673/Rosy/ivni8lei5dqqrclfvlm3.png';
    enemyImage.src = 'https://res.cloudinary.com/dipv76dpn/image/upload/v1771450360/HAMBURGUESA_vqatpi.png';
    
    // Configuracion del juego
    let canvas, ctx;
    if (isMobile) {
        canvas = document.getElementById('mobile-canvas');
    } else {
        canvas = document.getElementById('desktop-canvas');
    }
    ctx = canvas.getContext('2d');
    
    // Elementos de la UI - NUEVO: Referencias para ambos layouts
    const splashScreen = document.getElementById('splash-screen');
    const startButton = document.getElementById('start-button');
    const pauseModal = document.getElementById('pause-modal');
    const resumeButton = document.getElementById('resume-button');
    const pauseBtn = document.getElementById('pause-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    
    // NUEVO: Funciones para actualizar ambos layouts
    function updateScore(score) {
        const allScoreDisplays = document.querySelectorAll('#score');
        allScoreDisplays.forEach(display => {
            display.textContent = `Puntos: ${score}`;
        });
    }

    function updateLives(lives) {
        const allLivesDisplays = document.querySelectorAll('#lives');
        allLivesDisplays.forEach(display => {
            display.textContent = `Vidas: ${lives}`;
        });
    }

    function updateAllDisplays() {
        updateScore(score);
        updateLives(lives);
    }
    
    // Ajustar tamano del canvas
    function resizeCanvas() {
        if (isMobile) {
            const screenArea = document.querySelector('.console-screen-area');
            canvas.width = screenArea.clientWidth - 20;
            canvas.height = screenArea.clientHeight - 20;
        } else {
            // Para el modo TV CRT, usar dimensiones fijas
            canvas.width = 640;
            canvas.height = 480;
        }
        
        // Reposicionar elementos del juego
        if (gameStarted) {
            repositionGameElements();
        }
    }
    // Variables del juego
    const character = {
        x: 300,
        y: canvas.height - 100, // Fixed initial position - start on ground instead of y: 0
        width: 50,
        height: 50,
        velocityX: 0,
        velocityY: 0,
        speed: isMobile ? 5 : 8,
        jumpForce: isMobile ? 15 : 20,
        isJumping: false,
        friction: 0.9,
        gravity: 0.8,
        invulnerable: false
    };
    
    let score = 0;
    let lives = 3;
    let enemies = [];
    let powerUps = [];
    let spikes = [];
    let levelCoins = 0;
    let lastEnemySpawn = 0;
    let enemySpawnDelay = 100; // Tiempo entre aparicion de enemigos (en frames)
    
    // Configuracion de niveles
    const levels = {
        facil: {
            enemySpeed: 2,
            enemyCount: 2,
            powerUpCount: 2,
            gravity: 0.8,
            enemySpawnDelay: 120
        },
        medio: {
            enemySpeed: 3,
            enemyCount: 3,
            powerUpCount: 1,
            gravity: 0.9,
            enemySpawnDelay: 90
        },
        dificil: {
            enemySpeed: 4,
            enemyCount: 4,
            powerUpCount: 1,
            gravity: 1.0,
            enemySpawnDelay: 60
        }
    };
    
    // Plataformas y monedas
    let platforms = [];
    let coins = [];
    
    // Estados de control
    let controls = {
        left: false,
        right: false,
        up: false
    };
    

