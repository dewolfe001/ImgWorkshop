export class Cropper {
    constructor(canvas, aspectSelect) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.aspectSelect = aspectSelect;
        this.image = null;
        this.dragging = false;
        this.startX = 0;
        this.startY = 0;
        this.crop = null;

        this.canvas.addEventListener('mousedown', this.onDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onUp.bind(this));
    }

    loadImage(img) {
        this.image = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.crop = null;
    }

    onDown(e) {
        if (!this.image) return;
        this.dragging = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.crop = { x: this.startX, y: this.startY, w: 0, h: 0 };
    }

    onMove(e) {
        if (!this.dragging || !this.image) return;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        let w = endX - this.startX;
        let h = endY - this.startY;
        const aspect = this.aspectSelect.value;
        if (aspect !== 'free') {
            const [aw, ah] = aspect.split(':').map(Number);
            if (Math.abs(w) > Math.abs(h)) {
                h = Math.sign(h) * Math.abs(w) * ah / aw;
            } else {
                w = Math.sign(w) * Math.abs(h) * aw / ah;
            }
        }
        this.crop.w = w;
        this.crop.h = h;
        this.redraw();
    }

    onUp() {
        this.dragging = false;
    }

    redraw() {
        if (!this.image) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        if (this.crop) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.crop.x, this.crop.y, this.crop.w, this.crop.h);
        }
    }

    getCroppedImage() {
        if (!this.image || !this.crop) return null;
        const { x, y, w, h } = this.crop;
        const canvas = document.createElement('canvas');
        canvas.width = Math.abs(w);
        canvas.height = Math.abs(h);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.image, x, y, w, h, 0, 0, Math.abs(w), Math.abs(h));
        return canvas;
    }
}
