// Hero Animation Script
// Adapted from CodePen for GHL Automation Hero Section

const codeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

// Helper to get container dimensions
const getContainerWidth = () => {
    const el = document.querySelector('.hero-cards-wrapper');
    return el ? el.clientWidth : window.innerWidth;
};
const getContainerHeight = () => {
    const el = document.querySelector('.hero-cards-wrapper');
    return el ? el.clientHeight : 300;
};

class CardStreamController {
    constructor() {
        this.container = document.getElementById("cardStream");
        this.cardLine = document.getElementById("cardLine");

        if (!this.container || !this.cardLine) return;

        this.position = 0;
        this.velocity = 40; // Slower speed for hero background
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.lastTime = 0;
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 20;

        this.containerWidth = 0;
        this.cardLineWidth = 0;

        this.init();
    }

    init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
        this.startPeriodicUpdates();
    }

    calculateDimensions() {
        this.containerWidth = getContainerWidth();
        const cardWidth = 400;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
    }

    setupEventListeners() {
        this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.onDrag(e));
        document.addEventListener("mouseup", () => this.endDrag());

        this.cardLine.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]), { passive: false });
        document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]), { passive: false });
        document.addEventListener("touchend", () => this.endDrag());

        window.addEventListener("resize", () => this.calculateDimensions());
    }

    startDrag(e) {
        // Optional: Disable drag if we want it purely background? 
        // Keeping it for interactivity as it's cool.
        e.preventDefault();
        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;
        this.cardLine.style.animation = "none";
        this.cardLine.classList.add("dragging");
    }

    onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.cardLine.classList.remove("dragging");
        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
            this.velocity = Math.abs(this.mouseVelocity);
            this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
            this.velocity = 40;
        }
        this.isAnimating = true;
    }

    animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isAnimating && !this.isDragging) {
            if (this.velocity > this.minVelocity) {
                this.velocity *= this.friction;
            } else {
                this.velocity = Math.max(this.minVelocity, this.velocity);
            }
            this.position += this.velocity * this.direction * deltaTime;
            this.updateCardPosition();
        }
        requestAnimationFrame(() => this.animate());
    }

    updateCardPosition() {
        if (this.position < -this.cardLineWidth) {
            this.position = this.containerWidth;
        } else if (this.position > this.containerWidth) {
            this.position = -this.cardLineWidth;
        }
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
    }

    generateCode(width, height) {
        let out = "";
        const chars = "01"; // Binary look
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                out += chars[Math.floor(Math.random() * chars.length)];
            }
            out += "\n";
        }
        return out;
    }

    createCardWrapper(index) {
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";
        const normalCard = document.createElement("div");
        normalCard.className = "card card-normal";

        const cardImage = document.createElement("img");
        cardImage.className = "card-image";
        // Use placeholder images with dark theme
        cardImage.src = `https://placehold.co/400x250/161b22/b4ff39?text=Automation+${index + 1}`;

        // Fallback to gradient if image fails
        cardImage.onerror = () => {
            cardImage.style.display = 'none';
            normalCard.style.background = 'linear-gradient(45deg, #161b22, #0d1117)';
        };

        normalCard.appendChild(cardImage);

        const asciiCard = document.createElement("div");
        asciiCard.className = "card card-ascii";
        const asciiContent = document.createElement("div");
        asciiContent.className = "ascii-content";
        asciiContent.textContent = this.generateCode(40, 20);
        asciiCard.appendChild(asciiContent);

        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);
        return wrapper;
    }

    updateCardClipping() {
        const containerW = getContainerWidth();
        const scannerX = containerW / 2;
        const scannerWidth = 8;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;

        // Calculate absolute positions relative to the container
        const wrapperEl = document.querySelector('.hero-cards-wrapper');
        if (!wrapperEl) return;
        const containerRect = wrapperEl.getBoundingClientRect();
        const scannerLeftAbs = containerRect.left + scannerLeft;
        const scannerRightAbs = containerRect.left + scannerRight;

        document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
            const rect = wrapper.getBoundingClientRect();
            const cardLeft = rect.left;
            const cardRight = rect.right;
            const cardWidth = rect.width;

            const normalCard = wrapper.querySelector(".card-normal");
            const asciiCard = wrapper.querySelector(".card-ascii");

            if (cardLeft < scannerRightAbs && cardRight > scannerLeftAbs) {
                const scannerIntersectLeft = Math.max(scannerLeftAbs - cardLeft, 0);
                const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
                const asciiClipLeft = (scannerIntersectLeft / cardWidth) * 100;

                normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
                asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);

                if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
                    wrapper.setAttribute("data-scanned", "true");
                    const scanEffect = document.createElement("div");
                    scanEffect.className = "scan-effect";
                    wrapper.appendChild(scanEffect);
                    setTimeout(() => scanEffect.remove(), 600);
                }
            } else {
                if (cardRight < scannerLeftAbs) {
                    normalCard.style.setProperty("--clip-right", "100%");
                    asciiCard.style.setProperty("--clip-left", "100%");
                } else if (cardLeft > scannerRightAbs) {
                    normalCard.style.setProperty("--clip-right", "0%");
                    asciiCard.style.setProperty("--clip-left", "0%");
                }
                wrapper.removeAttribute("data-scanned");
            }
        });
    }

    updateAsciiContent() {
        document.querySelectorAll(".ascii-content").forEach((content) => {
            if (Math.random() < 0.15) {
                content.textContent = this.generateCode(40, 20);
            }
        });
    }

    populateCardLine() {
        this.cardLine.innerHTML = "";
        for (let i = 0; i < 8; i++) {
            this.cardLine.appendChild(this.createCardWrapper(i));
        }
    }

    startPeriodicUpdates() {
        setInterval(() => this.updateAsciiContent(), 200);
        const updateClipping = () => {
            this.updateCardClipping();
            requestAnimationFrame(updateClipping);
        };
        updateClipping();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById("particleCanvas");
        if (this.canvas) this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        const w = getContainerWidth();
        const h = getContainerHeight();

        this.camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 1000);
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(w, h);
        this.renderer.setClearColor(0x000000, 0);

        this.createParticles();
        this.animate();
        window.addEventListener("resize", () => this.onWindowResize());
    }

    createParticles() {
        const count = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const w = getContainerWidth();
        const h = getContainerHeight();

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * w * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * h;
            positions[i * 3 + 2] = 0;
            colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
            sizes[i] = Math.random() * 4;
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({ size: 2, color: 0xb4ff39, transparent: true, opacity: 0.4 }); // Lime green particles
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            const w = getContainerWidth();
            for (let i = 0; i < 150; i++) {
                positions[i * 3] += 0.3;
                if (positions[i * 3] > w / 2) positions[i * 3] = -w / 2;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const w = getContainerWidth();
        const h = getContainerHeight();
        this.camera.left = -w / 2;
        this.camera.right = w / 2;
        this.camera.top = h / 2;
        this.camera.bottom = -h / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

class ParticleScanner {
    constructor() {
        this.canvas = document.getElementById("scannerCanvas");
        if (this.canvas) {
            this.ctx = this.canvas.getContext("2d");
            this.setupCanvas();
            this.animate();
            window.addEventListener("resize", () => this.onResize());
        }
    }

    setupCanvas() {
        this.w = getContainerWidth();
        this.h = getContainerHeight();
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    }

    onResize() {
        this.setupCanvas();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.w, this.h);

        const centerX = this.w / 2;

        // Scanner Line
        this.ctx.strokeStyle = "rgba(180, 255, 57, 0.6)"; // Lime green
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.h);
        this.ctx.stroke();

        // Scanner Glow
        const gradient = this.ctx.createLinearGradient(centerX - 60, 0, centerX + 60, 0);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, "rgba(180, 255, 57, 0.15)");
        gradient.addColorStop(1, "transparent");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(centerX - 60, 0, 120, this.h);
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Only init if the elements exist
    if (document.getElementById("cardStream")) {
        new CardStreamController();
        new ParticleSystem();
        new ParticleScanner();
    }
});
