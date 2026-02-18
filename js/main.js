    // Actualizar juego
    let frameCount = 0;
    function update() {
        if (!gameStarted || gamePaused) {
            // Si el juego no esta activo, salir pero mantener la referencia
            animationFrameId = requestAnimationFrame(update);
            return;
        }
        
        frameCount++;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar fondo tematico segun el ROM actual
        const roomTheme = getCurrentRoomTheme();
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, roomTheme.skyTop);
        gradient.addColorStop(1, roomTheme.skyBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Aplicar gravedad
        character.velocityY += character.gravity;
        
        // Movimiento horizontal basado en controles
        if (controls.left && !controls.right) {
            character.velocityX = -character.speed;
        } else if (controls.right && !controls.left) {
            character.velocityX = character.speed;
        } else {
            character.velocityX *= character.friction;
        }
        
        // Salto
        if (controls.up && !character.isJumping) {
            character.velocityY = -character.jumpForce;
            character.isJumping = true;
            controls.up = false; // Resetear control de salto
            soundSystem.playJump();
        }
        
        // Actualizar posicion
        character.x += character.velocityX;
        character.y += character.velocityY;
        
        // Actualizar camara
        updateCamera();
        
        // Generar enemigos
        spawnEnemies(frameCount);
        
        // Mover enemigos
        moveEnemies();
        
        // Limites del canvas (solo en eje Y, el eje X ahora es infinito con desplazamiento)
        if (character.y - character.height < 0) {
            character.y = character.height;
            character.velocityY = 0;
        } else if (character.y > canvas.height + 100) {
            character.x = 300;
            character.y = canvas.height - 80;
            character.velocityX = 0;
            character.velocityY = 0;
            character.isJumping = false;
            lives--;
            updateLives(lives); // NUEVO: Actualizar ambos layouts
            
            if (lives <= 0) {
                setTimeout(() => {
                    alert(`Game Over!\nPuntuacion final: ${score}`);
                    resetGame();
                }, 500);
            }
        }
        
        // Limites del mundo en X
        if (character.x - character.width/2 < 0) {
            character.x = character.width/2;
            character.velocityX = 0;
        } else if (character.x + character.width/2 > worldWidth) {
            character.x = worldWidth - character.width/2;
            character.velocityX = 0;
        }
        
        // Verificar colisiones
        checkPlatformCollision();
        checkCoinCollection();
        checkEnemyCollision();
        checkSpikeCollision();
        checkPowerUpCollection();
        checkDoorCollision();
        // Dibujar elementos
        drawPlatforms();
        drawSpikes();
        drawCoins();
        drawEnemies();
        drawPowerUps();
        drawDoor();
        drawCharacter();
        // Dibujar tiempo de juego
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(canvas.width - 120, 10, 110, 40);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Tiempo: ${gameTime}s`, canvas.width - 15, 35);
        const collectedCoins = coins.filter(coin => coin.collected).length;
        ctx.textAlign = 'left';
        ctx.fillText(`ROM ${currentROM} - ${roomTheme.name}`, 15, 28);
        ctx.fillText(`Monedas: ${collectedCoins}/${coins.length}`, 15, 50);
        
        // Solicitar siguiente frame
        animationFrameId = requestAnimationFrame(update);
    }

    canvas.addEventListener('click', (e) => {
        if (!gameStarted) {return;}
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is on sound button
        const soundButtonSize = 30;
        const soundButtonX = canvas.width - soundButtonSize - 10;
        const soundButtonY = 60;
        
        if (x >= soundButtonX && x <= soundButtonX + soundButtonSize &&
            y >= soundButtonY && y <= soundButtonY + soundButtonSize) {
            soundSystem.toggleSound();
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        if (!gameStarted) {return;}
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Check if touch is on sound button
        const soundButtonSize = 30;
        const soundButtonX = canvas.width - soundButtonSize - 10;
        const soundButtonY = 60;
        
        if (x >= soundButtonX && x <= soundButtonX + soundButtonSize &&
            y >= soundButtonY && y <= soundButtonY + soundButtonSize) {
            soundSystem.toggleSound();
        }
    });

