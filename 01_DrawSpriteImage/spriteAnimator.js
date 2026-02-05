class SpriteAnimator {
    constructor(canvasId, imageSrc, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 설정 값 (기본값 제공)
        this.frameWidth = options.frameWidth || 32;
        this.frameHeight = options.frameHeight || 32;
        this.totalFrames = options.totalFrames || 6;
        this.scale = options.scale || 1;
        this.interval = options.interval || 150;
        this.currentFrame = 0;

        // 캔버스 크기 초기 설정
        this.canvas.width = this.frameWidth * this.scale;
        this.canvas.height = this.frameHeight * this.scale;

        this.img = new Image();
        this.img.src = imageSrc;
        this.img.onload = () => {
            this.ctx.imageSmoothingEnabled = false;
            this.start();
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.img,
            this.currentFrame * this.frameWidth, 0,
            this.frameWidth, this.frameHeight,
            0, 0,
            this.frameWidth * this.scale, this.frameHeight * this.scale
        );
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }

    start() {
        setInterval(() => this.draw(), this.interval);
    }
}