// Reiniciar el juego RESPETANDO la dificultad seleccionada
function resetGame() {
    // Cancelar cualquier animaciÃ³n en curso
    cancelAnimationFrame(animationFrameId);
    
    // Reiniciar estadÃ­sticas bÃ¡sicas
    score = 0;
    lives = 3;
    gameTime = 0;
    
    // Actualizar displays
    updateAllDisplays();
    
    // Reiniciar arrays de objetos del juego
    coins.forEach(coin => coin.collected = false);
    powerUps.forEach(powerUp => powerUp.collected = false);
    enemies = [];
    
    // Reiniciar posiciÃ³n del personaje
    character.x = 100;
    character.y = canvas.height - 80;
    character.velocityX = 0;
    character.velocityY = 0;
    character.isJumping = false;
    character.invulnerable = false;
    
    // Reiniciar configuraciÃ³n de la cÃ¡mara y direcciÃ³n
    cameraOffset = 0;
    characterFacing = 'right';
    currentROM = 1;
    door = null;
    frameCount = 0;
    lastEnemySpawn = 0;
    
    // CRÃTICO: Reconfigurar el personaje segÃºn el nivel actual
    character.speed = isMobile ? 5 : 8;
    character.jumpForce = isMobile ? 15 : 20;
    character.gravity = levels[currentLevel].gravity;
    
    // Reiniciar temporizador
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Recrear el mundo con la dificultad actual
    repositionGameElements();
    
    // Reiniciar controles
    controls = {
        left: false,
        right: false,
        up: false
    };
    
    // Mostrar pantalla de inicio
    gameStarted = false;
    gamePaused = false;
    splashScreen.style.display = 'flex';
    setTimeout(() => {
        splashScreen.style.opacity = '1';
    }, 50);
}
