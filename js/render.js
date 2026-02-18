    // Dibujar el personaje
    function drawCharacter() {
        if (characterImage.src && characterImage.complete) {
            // Calcular posiciÃ³n en pantalla
            const screenX = character.x - cameraOffset;
            const screenY = character.y;
            
            // Efecto de parpadeo si es invulnerable
            if (character.invulnerable && Math.floor(gameTime / 5) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
            
            // Dibujar la imagen (voltear horizontalmente si mira a la izquierda)
            if (characterFacing === 'right') {
                ctx.drawImage(characterImage, screenX - character.width/2, screenY - character.height, character.width, character.height);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(characterImage, -screenX - character.width/2, screenY - character.height, character.width, character.height);
                ctx.restore();
            }
            
            ctx.globalAlpha = 1;
        } else {
            const screenX = character.x - cameraOffset;
            const screenY = character.y;
            
            // Efecto de parpadeo si es invulnerable
            if (character.invulnerable && Math.floor(gameTime / 5) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
            
            // Dibujar un placeholder mientras carga la imagen
            ctx.beginPath();
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(screenX - character.width/2, screenY - character.height, character.width, character.height);
            ctx.strokeStyle = '#ff5252';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX - character.width/2, screenY - character.height, character.width, character.height);
            
            // Dibujar ojos del placeholder
            ctx.fillStyle = 'white';
            ctx.fillRect(screenX - character.width/2 + 10, screenY - character.height + 10, 8, 8);
            ctx.fillRect(screenX - character.width/2 + 30, screenY - character.height + 10, 8, 8);
            
            ctx.fillStyle = 'black';
            ctx.fillRect(screenX - character.width/2 + 12, screenY - character.height + 12, 4, 4);
            ctx.fillRect(screenX - character.width/2 + 32, screenY - character.height + 12, 4, 4);
            
            ctx.globalAlpha = 1;
            ctx.closePath();
        }
    }
    
    // Dibujar plataformas
    function drawPlatforms() {
        const roomTheme = getCurrentRoomTheme();
        platforms.forEach(platform => {
            // Solo dibujar plataformas que estÃ©n en el Ã¡rea visible
            if (platform.x + platform.width > cameraOffset && platform.x < cameraOffset + canvas.width) {
                ctx.fillStyle = roomTheme.platformFill;
                ctx.fillRect(platform.x - cameraOffset, platform.y, platform.width, platform.height);
                ctx.strokeStyle = roomTheme.platformStroke;
                ctx.lineWidth = 2;
                ctx.strokeRect(platform.x - cameraOffset, platform.y, platform.width, platform.height);
                
                // Textura de hierba en la plataforma principal
                if (platform.y === canvas.height - 30) {
                    ctx.fillStyle = roomTheme.grass;
                    ctx.fillRect(platform.x - cameraOffset, platform.y, platform.width, 8);
                }
            }
        });
    }
    
    // Dibujar monedas
    function drawCoins() {
        coins.forEach(coin => {
            // Solo dibujar monedas que estÃ©n en el Ã¡rea visible
            if (coin.x + coin.radius > cameraOffset && coin.x - coin.radius < cameraOffset + canvas.width) {
                if (!coin.collected) {
                    ctx.beginPath();
                    ctx.arc(coin.x - cameraOffset, coin.y, coin.radius, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffd700';
                    ctx.fill();
                    ctx.strokeStyle = '#d4af37';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.closePath();
                    
                    // Dibujar detalles de la moneda
                    ctx.beginPath();
                    ctx.arc(coin.x - cameraOffset, coin.y, coin.radius / 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#d4af37';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        });
    }
    
    // Dibujar enemigos
    function drawEnemies() {
        enemies.forEach(enemy => {
            const enemyLeft = enemy.x - enemy.width / 2;
            const enemyRight = enemy.x + enemy.width / 2;

            // Solo dibujar enemigos que estÃ©n en el Ã¡rea visible
            if (enemyRight > cameraOffset && enemyLeft < cameraOffset + canvas.width) {
                if (enemyImage.src && enemyImage.complete) {
                    ctx.drawImage(
                        enemyImage,
                        enemy.x - cameraOffset - enemy.width / 2,
                        enemy.y - enemy.height,
                        enemy.width,
                        enemy.height
                    );
                } else {
                    ctx.fillStyle = enemy.color;
                    ctx.fillRect(
                        enemy.x - cameraOffset - enemy.width / 2,
                        enemy.y - enemy.height,
                        enemy.width,
                        enemy.height
                    );
                }
            }
        });
    }
    function drawSpikes() {
        spikes.forEach(spike => {
            const spikeScreenX = spike.x - cameraOffset;
            if (spikeScreenX + spike.width < 0 || spikeScreenX > canvas.width) {return;}

            ctx.fillStyle = '#d32f2f';
            ctx.beginPath();
            ctx.moveTo(spikeScreenX, spike.y);
            ctx.lineTo(spikeScreenX + spike.width / 2, spike.y - spike.height);
            ctx.lineTo(spikeScreenX + spike.width, spike.y);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#8e0000';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }
    
    // Dibujar power-ups
    function drawPowerUps() {
        powerUps.forEach(powerUp => {
            // Solo dibujar power-ups que estÃ©n en el Ã¡rea visible
            if (powerUp.x + powerUp.radius > cameraOffset && powerUp.x - powerUp.radius < cameraOffset + canvas.width) {
                if (!powerUp.collected) {
                    ctx.beginPath();
                    ctx.arc(powerUp.x - cameraOffset, powerUp.y, powerUp.radius, 0, Math.PI * 2);
                    ctx.fillStyle = powerUp.color;
                    ctx.fill();
                    ctx.closePath();
                    
                    // Dibujar sÃ­mbolo segÃºn el tipo
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    if (powerUp.type === 'life') {
                        ctx.fillText("+", powerUp.x - cameraOffset, powerUp.y);
                    } else {
                        ctx.fillText("\u26A1", powerUp.x - cameraOffset, powerUp.y);
                    }
                }
            }
        });
    }
