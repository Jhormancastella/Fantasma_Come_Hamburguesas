    // Dibujar la puerta
function drawDoor() {
    if (!door || !door.active) {return;}
    const roomTheme = getCurrentRoomTheme();
    
    const screenX = door.x - cameraOffset;
    const screenY = door.y;
    
    // Solo dibujar si estÃ¡ en la pantalla
    if (screenX + door.width < 0 || screenX > canvas.width) {return;}
    
    // Dibujar puerta
    ctx.fillStyle = roomTheme.doorOuter;
    ctx.fillRect(screenX, screenY, door.width, door.height);
    
    // Detalles de la puerta
    ctx.fillStyle = roomTheme.doorInner;
    ctx.fillRect(screenX + 5, screenY + 5, door.width - 10, door.height - 10);
    
    // Manija
    ctx.fillStyle = roomTheme.doorHandle;
    ctx.beginPath();
    ctx.arc(screenX + door.width - 15, screenY + door.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Efecto de brillo intermitente
    if (Math.floor(gameTime / 10) % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(screenX + 10, screenY + 10, door.width - 20, 10);
    }
}
