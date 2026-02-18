    // Controles para teclado
    const keys = {};
    
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Pausar con la tecla P
        if (e.key === 'p' || e.key === 'P') {
            togglePause();
        }
        
        // Actualizar controles segun teclado
        if (gameStarted && !gamePaused) {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                controls.left = true;
                characterFacing = 'left';
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                controls.right = true;
                characterFacing = 'right';
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {controls.up = true;}
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        
        // Actualizar controles segun teclado
        if (e.key === 'ArrowLeft' || e.key === 'a') {controls.left = false;}
        if (e.key === 'ArrowRight' || e.key === 'd') {controls.right = false;}
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {controls.up = false;}
    });
    
    // Funciones de pausa
    function togglePause() {
        if (!gameStarted) {return;}
        
        gamePaused = !gamePaused;
        
        if (gamePaused) {
            pauseModal.style.display = 'flex';
        } else {
            pauseModal.style.display = 'none';
        }
    }
    
    resumeButton.addEventListener('click', togglePause);
