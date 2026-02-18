   // Controles para mÃ³vil
if (isMobile) {
    const upBtn = document.getElementById('up-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const aBtn = document.getElementById('btn-a');
    const bBtn = document.getElementById('btn-b');
    const pauseBtnMobile = document.getElementById('btn-pause');
    
    // Configurar eventos para los botones
    function setupButton(button, control, value) {
        const eventHandler = (e) => {
            e.preventDefault();
            controls[control] = value;
        };
        
        button.addEventListener('touchstart', eventHandler);
        button.addEventListener('mousedown', eventHandler);
        
        const releaseHandler = (e) => {
            e.preventDefault();
            controls[control] = !value;
        };
        
        button.addEventListener('touchend', releaseHandler);
        button.addEventListener('touchcancel', releaseHandler);
        button.addEventListener('mouseup', releaseHandler);
        button.addEventListener('mouseleave', releaseHandler);
    }
    
    // Configurar botÃ³n izquierdo con direcciÃ³n
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        controls.left = true;
        characterFacing = 'left';
    });
    
    leftBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        controls.left = true;
        characterFacing = 'left';
    });
    
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        controls.left = false;
    });
    
    leftBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        controls.left = false;
    });
    
    // Configurar botÃ³n derecho con direcciÃ³n
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        controls.right = true;
        characterFacing = 'right';
    });
    
    rightBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        controls.right = true;
        characterFacing = 'right';
    });
    
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        controls.right = false;
    });
    
    rightBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        controls.right = false;
    });
    
    // Los otros botones pueden usar la funciÃ³n setupButton normal
    setupButton(upBtn, 'up', true);
    setupButton(aBtn, 'up', true);
    
    // Para el botÃ³n B podemos asignar alguna funciÃ³n adicional
    bBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!character.isJumping && gameStarted && !gamePaused) {
            character.velocityY = -character.jumpForce * 1.2; // Salto mÃ¡s alto con B
            character.isJumping = true;
        }
    });
    
    bBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (!character.isJumping && gameStarted && !gamePaused) {
            character.velocityY = -character.jumpForce * 1.2; // Salto mÃ¡s alto con B
            character.isJumping = true;
        }
    });
    
    // BotÃ³n de pausa para mÃ³vil
    pauseBtnMobile.addEventListener('click', togglePause);
} else {
        // BotÃ³n de pausa para escritorio
        pauseBtn.addEventListener('click', togglePause);
    }
