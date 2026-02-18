    // Mover enemigos
    function moveEnemies() {
        enemies.forEach(enemy => {
            enemy.x += enemy.speed * enemy.direction;
            
            // Cambiar direcciÃ³n en los lÃ­mites de su segmento
            if (enemy.x - enemy.width / 2 < enemy.patrolMin || enemy.x + enemy.width / 2 > enemy.patrolMax) {
                enemy.x = Math.max(enemy.patrolMin + enemy.width / 2, Math.min(enemy.x, enemy.patrolMax - enemy.width / 2));
                enemy.direction *= -1;
            }
        });
    }
    
    // Generar enemigos progresivamente
    function spawnEnemies(frameCount) {
        if (frameCount - lastEnemySpawn > enemySpawnDelay && enemies.length < levels[currentLevel].enemyCount) {
            const speed = levels[currentLevel].enemySpeed;
            const direction = Math.random() > 0.5 ? 1 : -1;
            const roomTheme = getCurrentRoomTheme();
            
            // Generar enemigo en un segmento de suelo que permita patrulla
            const validSegments = platforms.filter(platform => platform.width >= 140);
            const segment = validSegments[Math.floor(Math.random() * validSegments.length)] || platforms[0];
            const width = isMobile ? 30 : 36;
            const height = isMobile ? 24 : 30;
            const x = segment.x + width + Math.random() * Math.max(1, segment.width - width * 2);
            const y = segment.y;
            
            enemies.push({
                x,
                y,
                width,
                height,
                color: roomTheme.enemyColor,
                speed,
                direction,
                patrolMin: segment.x + 8,
                patrolMax: segment.x + segment.width - 8
            });
            
            lastEnemySpawn = frameCount;
        }
    }
    
    // Sistema de desplazamiento de camara
    function updateCamera() {
        const rightThreshold = canvas.width * 0.7; // 70% del ancho de la pantalla
        const leftThreshold = canvas.width * 0.3; // 30% del ancho de la pantalla
        
        // Desplazar a la derecha si el personaje se acerca al borde derecho
        if (character.x - cameraOffset > rightThreshold) {
            cameraOffset = character.x - rightThreshold;
        }
        
        // Desplazar a la izquierda si el personaje se acerca al borde izquierdo
        if (character.x - cameraOffset < leftThreshold) {
            cameraOffset = character.x - leftThreshold;
        }
        
        // Limitar el desplazamiento de la camara para no salirse del mundo
        cameraOffset = Math.max(0, Math.min(cameraOffset, worldWidth - canvas.width));
    }

    function checkPlatformCollision() {
        let onGround = false;
        let collisionOccurred = false;

        platforms.forEach(platform => {
            // Solo verificar plataformas visibles o cercanas
            if (platform.x + platform.width < cameraOffset - 100 ||
                platform.x > cameraOffset + canvas.width + 100) {return;}

            const charLeft = character.x - character.width / 2;
            const charRight = character.x + character.width / 2;
            const charTop = character.y - character.height;
            const charBottom = character.y;

            // Verificar si hay superposicion
            if (charRight > platform.x &&
                charLeft < platform.x + platform.width &&
                charBottom > platform.y &&
                charTop < platform.y + platform.height) {

                collisionOccurred = true;

                // Colision desde arriba (aterrizando en la plataforma)
                if (character.velocityY >= 0 && 
                    charBottom - character.velocityY <= platform.y + 5) {
                    character.y = platform.y;
                    character.velocityY = 0;
                    onGround = true;
                    return;
                }

                // Colision desde abajo (golpeando la plataforma por debajo)
                if (character.velocityY < 0 && 
                    charTop - character.velocityY >= platform.y + platform.height - 5) {
                    character.y = platform.y + platform.height + character.height;
                    character.velocityY = 0;
                    return;
                }

                // Colisiones laterales
                if (character.velocityX > 0 && 
                    charRight - character.velocityX <= platform.x + 5) {
                    character.x = platform.x - character.width / 2;
                    character.velocityX = 0;
                    return;
                }
                
                if (character.velocityX < 0 && 
                    charLeft - character.velocityX >= platform.x + platform.width - 5) {
                    character.x = platform.x + platform.width + character.width / 2;
                    character.velocityX = 0;
                    return;
                }
            }
        });

        // Actualizar estado de salto basado en si esta en el suelo
        character.isJumping = !onGround;
    }
    
   // Recolectar monedas
    function checkCoinCollection() {
        coins.forEach(coin => {
            if (!coin.collected) {
                // Calcular distancia entre el centro del personaje y la moneda
                const distance = Math.sqrt(
                    Math.pow(character.x - coin.x, 2) + 
                    Math.pow(character.y - character.height/2 - coin.y, 2)
                );
                
                if (distance < (character.width/2) + coin.radius) {
                    coin.collected = true;
                    score += 10;
                    updateScore(score);
                    soundSystem.playCoin();
                    
                    // Verificar si se recolectaron todas las monedas
                    if (coins.every(c => c.collected)) {
                        // En lugar de mostrar alert, activar la puerta
                        activateDoor();
                    }
                }
            }
        });
    }
    function activateDoor() {
    // Posicionar la puerta al final del nivel, por ejemplo en la ultima plataforma
    const lastPlatform = platforms[platforms.length - 1];
    door = {
        x: lastPlatform.x + lastPlatform.width / 2 - 25, // Centrada en la plataforma
        y: lastPlatform.y - 60, // 60px por encima de la plataforma
        width: 50,
        height: 60,
        active: true
    };
}
function checkDoorCollision() {
    if (!door || !door.active) {return;}

    const charLeft = character.x - character.width / 2;
    const charRight = character.x + character.width / 2;
    const charTop = character.y - character.height;
    const charBottom = character.y;

    // Colision AABB consistente con el sistema de coordenadas del personaje
    if (charLeft < door.x + door.width &&
        charRight > door.x &&
        charTop < door.y + door.height &&
        charBottom > door.y) {
        // Colision detectada, pasar al siguiente nivel
        nextROM();
    }
}
function nextROM() {
    currentROM++;
    // Mantener la dificultad (currentLevel) y las estadisticas (score, lives)
    
    // Reposicionar elementos para el nuevo ROM
    repositionGameElements();
    
    // Desactivar la puerta hasta que se recojan todas las monedas again
    door.active = false;
    door = null;
    
    // Opcional: mostrar un mensaje de cambio de nivel
    showROMTransition();
}

function showROMTransition() {
    // Podemos mostrar un mensaje en el canvas o un alert temporal
    alert(`Felicidades! Pasando al ROM ${currentROM}`);
}
function damagePlayer() {
    if (character.invulnerable) {return;}
    lives--;
    updateLives(lives);
    soundSystem.playHit();

    character.invulnerable = true;
    setTimeout(() => {
        character.invulnerable = false;
    }, 2000);

    if (lives <= 0) {
        setTimeout(() => {
            soundSystem.playGameOver();
            alert(`Game Over!\nPuntuacion final: ${score}`);
            resetGame();
        }, 500);
    }
}
function checkSpikeCollision() {
    if (character.invulnerable) {return;}

    const charLeft = character.x - character.width / 2;
    const charRight = character.x + character.width / 2;
    const charTop = character.y - character.height;
    const charBottom = character.y;

    for (const spike of spikes) {
        const overlap =
            charRight > spike.x &&
            charLeft < spike.x + spike.width &&
            charBottom > spike.y - spike.height &&
            charTop < spike.y;

        if (overlap) {
            damagePlayer();
            break;
        }
    }
}
    // Colision con enemigos
    function checkEnemyCollision() {
        const charLeft = character.x - character.width / 2;
        const charRight = character.x + character.width / 2;
        const charTop = character.y - character.height;
        const charBottom = character.y;

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const enemyLeft = enemy.x - enemy.width / 2;
            const enemyRight = enemy.x + enemy.width / 2;
            const enemyTop = enemy.y - enemy.height;
            const enemyBottom = enemy.y;

            const overlap =
                charRight > enemyLeft &&
                charLeft < enemyRight &&
                charBottom > enemyTop &&
                charTop < enemyBottom;

            if (!overlap) {continue;}

            const stompHit =
                character.velocityY > 0 &&
                charBottom - character.velocityY <= enemyTop + 6;

            if (stompHit) {
                enemies.splice(i, 1);
                score += 20;
                updateScore(score);
                soundSystem.playCoin();
                character.velocityY = -Math.max(10, character.jumpForce * 0.55);
                continue;
            }

            damagePlayer();
            break;
        }
    }
    
    // Recolectar power-ups
    function checkPowerUpCollection() {
        powerUps.forEach(powerUp => {
            if (!powerUp.collected) {
                // Calcular distancia entre el centro del personaje y el power-up
                const distance = Math.sqrt(
                    Math.pow(character.x - powerUp.x, 2) + 
                    Math.pow(character.y - character.height/2 - powerUp.y, 2)
                );
                
                if (distance < (character.width/2) + powerUp.radius) {
                    powerUp.collected = true;
                    soundSystem.playPowerUp();
                    
                    if (powerUp.type === 'life') {
                        // Anadir vida extra
                        lives++;
                        updateLives(lives); // NUEVO: Actualizar ambos layouts
                    } else {
                        // Aumentar velocidad temporalmente
                        character.speed += 3;
                        setTimeout(() => {
                            character.speed -= 3;
                        }, 5000);
                    }
                }
            }
        });
    }

