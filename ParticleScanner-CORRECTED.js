// This is the CORRECTED ParticleScanner class from the original CodePen
// It includes the drawLightBar() method and proper render() method for the purple glitter effect

// INSTRUCTIONS:
// 1. In hero-cards-iframe.html, find the entire "class ParticleScanner {" section (around line 983-1180)
// 2. Replace it with the class below
// 3. At the bottom, replace the DOMContentLoaded section with the one at the end of this file

class ParticleScanner {
    constructor() {
        this.canvas = document.getElementById("scannerCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.animationId = null;

        this.w = window.innerWidth;
        this.h = 250;  // Changed from 300 to 250 to match card height
        this.particles = [];
        this.count = 0;
        this.maxParticles = 800;
        this.intensity = 0.8;
        this.lightBarX = this.w / 2;
        this.lightBarWidth = 3;
        this.fadeZone = 60;

        this.scanTargetIntensity = 1.8;
        this.scanTargetParticles = 2500;
        this.scanTargetFadeZone = 35;

        this.scanningActive = false;

        this.baseIntensity = this.intensity;
        this.baseMaxParticles = this.maxParticles;
        this.baseFadeZone = this.fadeZone;

        this.currentIntensity = this.intensity;
        this.currentMaxParticles = this.maxParticles;
        this.currentFadeZone = this.fadeZone;
        this.transitionSpeed = 0.05;

        this.setupCanvas();
        this.createGradientCache();
        this.initParticles();
        this.animate();

        window.addEventListener("resize", () => this.onResize());
    }

    setupCanvas() {
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.width = this.w + "px";
        this.canvas.style.height = this.h + "px";
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

    onResize() {
        this.w = window.innerWidth;
        this.lightBarX = this.w / 2;
        this.setupCanvas();
    }

    createGradientCache() {
        this.gradientCanvas = document.createElement("canvas");
        this.gradientCtx = this.gradientCanvas.getContext("2d");
        this.gradientCanvas.width = 16;
        this.gradientCanvas.height = 16;

        const half = this.gradientCanvas.width / 2;
        const gradient = this.gradientCtx.createRadialGradient(
            half,
            half,
            0,
            half,
            half,
            half
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(196, 181, 253, 0.8)");
        gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.4)");
        gradient.addColorStop(1, "transparent");

        this.gradientCtx.fillStyle = gradient;
        this.gradientCtx.beginPath();
        this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
        this.gradientCtx.fill();
    }

    random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    createParticle() {
        const intensityRatio = this.intensity / this.baseIntensity;
        const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
        const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

        return {
            x:
                this.lightBarX +
                this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
            y: this.randomFloat(0, this.h),

            vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
            vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,

            radius: this.randomFloat(0.4, 1) * sizeMultiplier,
            alpha: this.randomFloat(0.6, 1),
            decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
            originalAlpha: 0,
            life: 1.0,
            time: 0,
            startX: 0,

            twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
            twinkleAmount: this.randomFloat(0.1, 0.25),
        };
    }

    initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.time++;

        particle.alpha =
            particle.originalAlpha * particle.life +
            Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;

        particle.life -= particle.decay;

        if (particle.x > this.w + 10 || particle.life <= 0) {
            this.resetParticle(particle);
        }
    }

    resetParticle(particle) {
        particle.x =
            this.lightBarX +
            this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
        particle.y = this.randomFloat(0, this.h);
        particle.vx = this.randomFloat(0.2, 1.0);
        particle.vy = this.randomFloat(-0.15, 0.15);
        particle.alpha = this.randomFloat(0.6, 1);
        particle.originalAlpha = particle.alpha;
        particle.life = 1.0;
        particle.time = 0;
        particle.startX = particle.x;
    }

    drawParticle(particle) {
        if (particle.life <= 0) return;

        let fadeAlpha = 1;

        if (particle.y < this.fadeZone) {
            fadeAlpha = particle.y / this.fadeZone;
        } else if (particle.y > this.h - this.fadeZone) {
            fadeAlpha = (this.h - particle.y) / this.fadeZone;
        }

        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

        this.ctx.globalAlpha = particle.alpha * fadeAlpha;
        this.ctx.drawImage(
            this.gradientCanvas,
            particle.x - particle.radius,
            particle.y - particle.radius,
            particle.radius * 2,
            particle.radius * 2
        );
    }

    // THIS IS THE KEY METHOD THAT WAS MISSING! It creates the purple glowing beam
    drawLightBar() {
        const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
        verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        verticalGradient.addColorStop(
            this.fadeZone / this.h,
            "rgba(255, 255, 255, 1)"
        );
        verticalGradient.addColorStop(
            1 - this.fadeZone / this.h,
            "rgba(255, 255, 255, 1)"
        );
        verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalCompositeOperation = "lighter";

        const targetGlowIntensity = this.scanningActive ? 3.5 : 1;

        if (!this.currentGlowIntensity) this.currentGlowIntensity = 1;

        this.currentGlowIntensity +=
            (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;

        const glowIntensity = this.currentGlowIntensity;
        const lineWidth = this.lightBarWidth;
        const glow1Alpha = this.scanningActive ? 1.0 : 0.8;
        const glow2Alpha = this.scanningActive ? 0.8 : 0.6;
        const glow3Alpha = this.scanningActive ? 0.6 : 0.4;

        // Core white line
        const coreGradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth / 2,
            0,
            this.lightBarX + lineWidth / 2,
            0
        );
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        coreGradient.addColorStop(
            0.3,
            `rgba(255, 255, 255, ${0.9 * glowIntensity})`
        );
        coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
        coreGradient.addColorStop(
            0.7,
            `rgba(255, 255, 255, ${0.9 * glowIntensity})`
        );
        coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = coreGradient;

        const radius = 15;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.lightBarX - lineWidth / 2,
            0,
            lineWidth,
            this.h,
            radius
        );
        this.ctx.fill();

        // First purple glow layer
        const glow1Gradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth * 2,
            0,
            this.lightBarX + lineWidth * 2,
            0
        );
        glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow1Gradient.addColorStop(
            0.5,
            `rgba(196, 181, 253, ${0.8 * glowIntensity})`
        );
        glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        this.ctx.globalAlpha = glow1Alpha;
        this.ctx.fillStyle = glow1Gradient;

        const glow1Radius = 25;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.lightBarX - lineWidth * 2,
            0,
            lineWidth * 4,
            this.h,
            glow1Radius
        );
        this.ctx.fill();

        // Second purple glow layer
        const glow2Gradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth * 4,
            0,
            this.lightBarX + lineWidth * 4,
            0
        );
        glow2Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow2Gradient.addColorStop(
            0.5,
            `rgba(139, 92, 246, ${0.4 * glowIntensity})`
        );
        glow2Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        this.ctx.globalAlpha = glow2Alpha;
        this.ctx.fillStyle = glow2Gradient;

        const glow2Radius = 35;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.lightBarX - lineWidth * 4,
            0,
            lineWidth * 8,
            this.h,
            glow2Radius
        );
        this.ctx.fill();

        // Third purple glow layer (only when scanning)
        if (this.scanningActive) {
            const glow3Gradient = this.ctx.createLinearGradient(
                this.lightBarX - lineWidth * 8,
                0,
                this.lightBarX + lineWidth * 8,
                0
            );
            glow3Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
            glow3Gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
            glow3Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

            this.ctx.globalAlpha = glow3Alpha;
            this.ctx.fillStyle = glow3Gradient;

            const glow3Radius = 45;
            this.ctx.beginPath();
            this.ctx.roundRect(
                this.lightBarX - lineWidth * 8,
                0,
                lineWidth * 16,
                this.h,
                glow3Radius
            );
            this.ctx.fill();
        }

        // Apply vertical fade
        this.ctx.globalCompositeOperation = "destination-in";
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = verticalGradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    render() {
        const targetIntensity = this.scanningActive
            ? this.scanTargetIntensity
            : this.baseIntensity;
        const targetMaxParticles = this.scanningActive
            ? this.scanTargetParticles
            : this.baseMaxParticles;
        const targetFadeZone = this.scanningActive
            ? this.scanTargetFadeZone
            : this.baseFadeZone;

        this.currentIntensity +=
            (targetIntensity - this.currentIntensity) * this.transitionSpeed;
        this.currentMaxParticles +=
            (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
        this.currentFadeZone +=
            (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

        this.intensity = this.currentIntensity;
        this.maxParticles = Math.floor(this.currentMaxParticles);
        this.fadeZone = this.currentFadeZone;

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.clearRect(0, 0, this.w, this.h);

        // Draw the purple glowing beam
        this.drawLightBar();

        // Draw particles
        this.ctx.globalCompositeOperation = "lighter";
        for (let i = 1; i <= this.count; i++) {
            if (this.particles[i]) {
                this.updateParticle(this.particles[i]);
                this.drawParticle(this.particles[i]);
            }
        }

        // Spawn new particles based on intensity
        const currentIntensity = this.intensity;
        const currentMaxParticles = this.maxParticles;

        if (Math.random() < currentIntensity && this.count < currentMaxParticles) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        // Extra particle spawning when intensity is high
        const intensityRatio = this.intensity / this.baseIntensity;

        if (intensityRatio > 1.1 && Math.random() < (intensityRatio - 1.0) * 1.2) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        // Clean up excess particles
        if (this.count > currentMaxParticles + 200) {
            const excessCount = Math.min(15, this.count - currentMaxParticles);
            for (let i = 0; i < excessCount; i++) {
                delete this.particles[this.count - i];
            }
            this.count -= excessCount;
        }
    }

    animate() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setScanningActive(active) {
        this.scanningActive = active;
    }

    getStats() {
        return {
            intensity: this.intensity,
            maxParticles: this.maxParticles,
            currentParticles: this.count,
            lightBarWidth: this.lightBarWidth,
            fadeZone: this.fadeZone,
            scanningActive: this.scanningActive,
            canvasWidth: this.w,
            canvasHeight: this.h,
        };
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.particles = [];
        this.count = 0;
    }
}

// ============================================
// ALSO REPLACE THE DOMContentLoaded SECTION AT THE BOTTOM WITH THIS:
// ============================================

let particleScanner;

document.addEventListener("DOMContentLoaded", () => {
    cardStream = new CardStreamController();
    particleSystem = new ParticleSystem();
    particleScanner = new ParticleScanner();

    window.setScannerScanning = (active) => {
        if (particleScanner) {
            particleScanner.setScanningActive(active);
        }
    };

    window.getScannerStats = () => {
        if (particleScanner) {
            return particleScanner.getStats();
        }
        return null;
    };
});
