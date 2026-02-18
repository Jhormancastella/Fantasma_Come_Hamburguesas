// Selector de nivel
levelButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        levelButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentLevel = btn.dataset.level;
    });
});

function getLevelGenerationConfig() {
    const byDifficulty = {
        facil: { segmentCount: 15, segmentMin: 170, segmentMax: 280, gapMin: 70, gapMax: 115, spikeChance: 0.2 },
        medio: { segmentCount: 18, segmentMin: 150, segmentMax: 250, gapMin: 95, gapMax: 150, spikeChance: 0.34 },
        dificil: { segmentCount: 21, segmentMin: 130, segmentMax: 220, gapMin: 120, gapMax: 185, spikeChance: 0.5 }
    };
    const roomVariant = (currentROM - 1) % 4;
    const base = byDifficulty[currentLevel];

    const variantAdjustments = [
        { gapScale: 0.9, spikeBoost: 0.0, segmentDelta: 1 },   // compacto
        { gapScale: 1.0, spikeBoost: 0.05, segmentDelta: 0 },  // balanceado
        { gapScale: 1.1, spikeBoost: 0.08, segmentDelta: 1 },  // desafiante
        { gapScale: 1.2, spikeBoost: 0.12, segmentDelta: 2 }   // tecnico
    ][roomVariant];

    const tuned = {
        segmentCount: base.segmentCount + variantAdjustments.segmentDelta,
        segmentMin: base.segmentMin,
        segmentMax: base.segmentMax,
        gapMin: Math.round(base.gapMin * variantAdjustments.gapScale),
        gapMax: Math.round(base.gapMax * variantAdjustments.gapScale),
        spikeChance: Math.min(0.7, base.spikeChance + variantAdjustments.spikeBoost)
    };

    if (isMobile) {
        return {
            segmentCount: Math.max(12, tuned.segmentCount - 2),
            segmentMin: Math.round(tuned.segmentMin * 1.15),
            segmentMax: Math.round(tuned.segmentMax * 1.2),
            gapMin: Math.max(55, Math.round(tuned.gapMin * 0.8)),
            gapMax: Math.max(90, Math.round(tuned.gapMax * 0.85)),
            spikeChance: Math.max(0.15, tuned.spikeChance - 0.1),
            firstGroundWidth: 920,
            finalGroundWidth: 320
        };
    }

    return {
        ...tuned,
        firstGroundWidth: 860,
        finalGroundWidth: 260
    };
}

// Reposicionar elementos del juego segun el tamano del canvas
function repositionGameElements() {
    const config = getLevelGenerationConfig();
    const groundY = canvas.height - 30;
    const spikeSize = isMobile ? 18 : 22;

    platforms = [
        { x: 0, y: groundY, width: config.firstGroundWidth, height: 30 }
    ];
    spikes = [];

    let lastX = config.firstGroundWidth;
    for (let i = 0; i < config.segmentCount; i++) {
        const gapWidth = config.gapMin + Math.random() * (config.gapMax - config.gapMin);
        const segmentWidth = config.segmentMin + Math.random() * (config.segmentMax - config.segmentMin);
        const segmentX = lastX + gapWidth;
        const segment = { x: segmentX, y: groundY, width: segmentWidth, height: 30 };
        platforms.push(segment);
        lastX = segmentX + segmentWidth;

        const shouldAddSpikes =
            i > 1 &&
            i < config.segmentCount - 2 &&
            segment.width > spikeSize * 3 &&
            Math.random() < config.spikeChance;

        if (shouldAddSpikes) {
            const maxSpikes = Math.max(1, Math.floor((segment.width - 30) / spikeSize));
            const spikeCount = Math.min(maxSpikes, 1 + Math.floor(Math.random() * (isMobile ? 2 : 3)));
            const startX = segment.x + 15 + Math.random() * Math.max(1, segment.width - (spikeCount * spikeSize) - 30);

            for (let s = 0; s < spikeCount; s++) {
                spikes.push({
                    x: startX + s * spikeSize,
                    y: groundY,
                    width: spikeSize,
                    height: spikeSize
                });
            }
        }
    }

    platforms.push({
        x: lastX + config.gapMin,
        y: groundY,
        width: config.finalGroundWidth,
        height: 30
    });

    worldWidth = platforms[platforms.length - 1].x + platforms[platforms.length - 1].width + (isMobile ? 380 : 520);

    coins = [];
    levelCoins = (isMobile ? 18 : 25) + (currentLevel === 'dificil' ? 4 : 0) + Math.min(3, currentROM - 1);

    for (let i = 0; i < levelCoins; i++) {
        const validPlatforms = platforms.filter(platform => platform.width >= 80);
        const sourcePlatforms = validPlatforms.length > 0 ? validPlatforms : platforms;
        const platform = sourcePlatforms[Math.floor(Math.random() * sourcePlatforms.length)];
        const margin = Math.min(20, Math.floor(platform.width / 4));
        const usableWidth = Math.max(10, platform.width - margin * 2);
        const x = platform.x + margin + Math.random() * usableWidth;
        const y = platform.y - 25;
        coins.push({ x, y, radius: 10, collected: false });
    }

    enemies = [];

    powerUps = [];
    const powerUpCount = levels[currentLevel].powerUpCount;
    for (let i = 0; i < powerUpCount; i++) {
        const platformIndex = Math.min(5 + (i * 5), platforms.length - 1);
        const platform = platforms[platformIndex];
        powerUps.push({
            x: platform.x + platform.width / 2,
            y: platform.y - 30,
            radius: 12,
            color: '#00ff00',
            type: Math.random() > 0.5 ? 'life' : 'speed',
            collected: false
        });
    }

    character.gravity = levels[currentLevel].gravity;
    enemySpawnDelay = levels[currentLevel].enemySpawnDelay;

    character.x = 100;
    character.y = canvas.height - 80;
    character.velocityX = 0;
    character.velocityY = 0;
    character.isJumping = false;
    cameraOffset = 0;
    characterFacing = 'right';
}
