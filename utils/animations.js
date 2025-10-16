import { PRIMARY_COLOR_RGB } from '../config.js';

export function createPulsingShape(element, size = 40, shape = 'grid', autoStart = false) {
    const container = element;
    if (!container) return;

    container.style.position = "relative";
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.background = `rgba(${PRIMARY_COLOR_RGB},0)`;

    container.innerHTML = "";
    const canvas = document.createElement("canvas");

    // Account for device pixel ratio for crisp rendering
    const dpr = 10;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.style.position = "absolute";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d", { alpha: true });
    ctx.scale(dpr, dpr);

    // Enable crisp rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const centerX = size / 2;
    const centerY = size / 2;

    // Configuration based on shape
    let dots = [];
    const baseDotSize = size * 0.035;
    const pulseAmplitude = size * 0.015;
    const pulseFrequency = 1.5; // pulses per second

    if (shape === 'grid') {
        const cols = 6;
        const rows = 6;
        const cellWidth = size / cols;
        const cellHeight = size / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                dots.push({
                    x: c * cellWidth + cellWidth / 2,
                    y: r * cellHeight + cellHeight / 2,
                    distanceFromCenter: Math.hypot(
                        c - cols / 2,
                        r - rows / 2
                    )
                });
            }
        }
    } else if (shape === 'circle') {
        // Arrange dots in concentric circles
        const rings = 4;
        const dotsPerRing = [1, 6, 12, 18]; // Center, then increasing dots per ring
        const maxRadius = size * 0.42;

        for (let ring = 0; ring < rings; ring++) {
            const radius = ring === 0 ? 0 : (maxRadius / (rings - 1)) * ring;
            const dotCount = dotsPerRing[ring];

            if (ring === 0) {
                // Center dot
                dots.push({
                    x: centerX,
                    y: centerY,
                    distanceFromCenter: 0
                });
            } else {
                for (let i = 0; i < dotCount; i++) {
                    const angle = (i / dotCount) * Math.PI * 2;
                    dots.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius,
                        distanceFromCenter: ring
                    });
                }
            }
        }
    }

    let lastTime = 0;
    let time = 0;
    let isAnimating = false;
    let animationStartTime = 0;
    let animationDuration = 2000;
    let animationId = null;

    function drawStaticFrame() {
        ctx.clearRect(0, 0, size, size);

        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, baseDotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${PRIMARY_COLOR_RGB}, 1)`;
            ctx.fill();
        });
    }

    function animate(timestamp) {
        if (!isAnimating) return;

        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        // Check if animation duration has elapsed
        const elapsedTime = timestamp - animationStartTime;
        if (elapsedTime >= animationDuration) {
            isAnimating = false;
            drawStaticFrame();
            return;
        }

        time += deltaTime;

        ctx.clearRect(0, 0, size, size);

        dots.forEach(dot => {
            // Create a wave-like offset for each dot based on distance from center
            const delay = dot.distanceFromCenter * 0.15;

            const pulse =
                Math.sin((time - delay) * Math.PI * pulseFrequency) * 0.5 + 0.5;
            const radius = baseDotSize + pulse * pulseAmplitude;
            const opacity = 0.5 + pulse * 0.5;

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(254, 207, 2, ${opacity})`;
            ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation(duration = 2000) {
        if (isAnimating) return; // Already animating

        isAnimating = true;
        animationDuration = duration;
        animationStartTime = performance.now();
        lastTime = 0;

        animationId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (!isAnimating) return;

        isAnimating = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        drawStaticFrame();
    }

    // Listen for custom event to trigger animation
    container.addEventListener('pulsingGridAnimate', (event) => {
        const duration = event.detail?.duration || 2000;
        startAnimation(duration);
    });

    // Draw initial frame (static or start animating based on autoStart)
    if (autoStart) {
        startAnimation(Infinity); // Infinite duration for continuous animation
    } else {
        drawStaticFrame();
    }

    // Return an object with control methods
    return {
        start: startAnimation,
        stop: stopAnimation,
        element: container
    };
}
