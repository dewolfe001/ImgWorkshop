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
        if (aspect === 'circle') {
            const size = Math.min(Math.abs(w), Math.abs(h));
            w = Math.sign(w) * size;
            h = Math.sign(h) * size;
        } else if (aspect !== 'free') {
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
            const { x, y, w, h } = this.crop;
            const sx = w >= 0 ? x : x + w;
            const sy = h >= 0 ? y : y + h;
            const sw = Math.abs(w);
            const sh = Math.abs(h);
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 2;
            if (this.aspectSelect.value === 'circle') {
                const r = sw / 2;
                this.ctx.beginPath();
                this.ctx.arc(sx + r, sy + r, r, 0, Math.PI * 2);
                this.ctx.stroke();
            } else {
                this.ctx.strokeRect(sx, sy, sw, sh);
            }
        }
    }

    getCroppedImage() {
        if (!this.image || !this.crop) return null;
        const { x, y, w, h } = this.crop;
        const sx = w >= 0 ? x : x + w;
        const sy = h >= 0 ? y : y + h;
        const sw = Math.abs(w);
        const sh = Math.abs(h);
        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        if (this.aspectSelect.value === 'circle') {
            const r = sw / 2;
            ctx.beginPath();
            ctx.arc(r, r, r, 0, Math.PI * 2);
            ctx.clip();
        }
        ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, sw, sh);
        return canvas;
    }
}
