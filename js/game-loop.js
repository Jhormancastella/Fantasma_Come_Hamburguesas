    // Inicializar el tamaÃ±o del canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Iniciar juego
    startButton.addEventListener('click', startGame);
    
    // TambiÃ©n permitir iniciar con Enter en desktop
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !gameStarted) {
            startGame();
        }
    });
    
    function startGame() {
        gameStarted = true;
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
        
        // Reiniciar estadÃ­sticas
        score = 0;
        lives = 3;
        gameTime = 0;
        updateAllDisplays(); // NUEVO: Actualizar ambos layouts
        
        // Iniciar temporizador
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!gamePaused && gameStarted) {
                gameTime++;
            }
        }, 1000);
        
        repositionGameElements();
        update();
    }
