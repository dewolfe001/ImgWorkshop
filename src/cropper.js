export class Cropper {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.aspect = 'free';
        this.image = null;
        this.dragging = false;
        this.startX = 0;
        this.startY = 0;
        this.crop = null;

        this.canvas.addEventListener('mousedown', this.onDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onUp.bind(this));
    }

    setAspect(aspect) {
        this.aspect = aspect;
        // Reset crop to cover entire image when aspect changes
        if (this.image) this.resetCrop();
    }

    resetCrop() {
        // Cover the entire image
        this.crop = { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height };
        this.redraw();
    }

    createShapePath(ctx, shape, x, y, w, h) {
        const createRegular = (sides, rotation = -Math.PI / 2) => {
            const cx = x + w / 2;
            const cy = y + h / 2;
            const r = Math.min(w, h) / 2;
            ctx.moveTo(
                cx + Math.cos(rotation) * r,
                cy + Math.sin(rotation) * r
            );
            for (let i = 1; i < sides; i++) {
                const angle = rotation + (Math.PI * 2 * i) / sides;
                ctx.lineTo(
                    cx + Math.cos(angle) * r,
                    cy + Math.sin(angle) * r
                );
            }
            ctx.closePath();
        };

        const createPolygon = (points) => {
            ctx.moveTo(x + points[0][0] * w, y + points[0][1] * h);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(x + points[i][0] * w, y + points[i][1] * h);
            }
            ctx.closePath();
        };

        if (shape === 'circle') {
            ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            return;
        }
        if (shape === 'ellipse') {
            ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            return;
        }

        const regularMap = {
            triangle: 3,
            diamond: { sides: 4, rotation: Math.PI / 4 },
            pentagon: 5,
            hexagon: 6,
            heptagon: 7,
            octagon: 8,
            nonagon: 9,
            decagon: 10,
        };

        if (regularMap[shape]) {
            const cfg = regularMap[shape];
            if (typeof cfg === 'number') createRegular(cfg);
            else createRegular(cfg.sides, cfg.rotation);
            return;
        }

        const polygons = {
            star: (ctx2) => {
                const cx = x + w / 2;
                const cy = y + h / 2;
                const spikes = 5;
                const outer = Math.min(w, h) / 2;
                const inner = outer / 2;
                let rot = Math.PI / 2 * 3;
                ctx2.moveTo(cx, cy - outer);
                for (let i = 0; i < spikes; i++) {
                    ctx2.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
                    rot += Math.PI / spikes;
                    ctx2.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
                    rot += Math.PI / spikes;
                }
                ctx2.closePath();
            },
            trapezoid: [[0.2, 0], [0.8, 0], [1, 1], [0, 1]],
            parallelogram: [[0.25, 0], [1, 0], [0.75, 1], [0, 1]],
            'left-arrow': [[0.35, 0], [0.35, 0.25], [1, 0.25], [1, 0.75], [0.35, 0.75], [0.35, 1], [0, 0.5]],
            'right-arrow': [[0, 0.25], [0.65, 0.25], [0.65, 0], [1, 0.5], [0.65, 1], [0.65, 0.75], [0, 0.75]],
            'left-point': [[1, 0], [1, 1], [0, 0.5]],
            'right-point': [[0, 0], [1, 0.5], [0, 1]],
            bevel: [[0.1, 0], [0.9, 0], [1, 0.1], [1, 0.9], [0.9, 1], [0.1, 1], [0, 0.9], [0, 0.1]],
            rabbet: [[0.2, 0], [0.8, 0], [1, 0.2], [1, 0.8], [0.8, 1], [0.2, 1], [0, 0.8], [0, 0.2]],
            cross: [[0.3, 0], [0.7, 0], [0.7, 0.3], [1, 0.3], [1, 0.7], [0.7, 0.7], [0.7, 1], [0.3, 1], [0.3, 0.7], [0, 0.7], [0, 0.3], [0.3, 0.3]],
        };

        if (typeof polygons[shape] === 'function') {
            polygons[shape](ctx);
            return;
        }
        if (polygons[shape]) {
            createPolygon(polygons[shape]);
            return;
        }

        ctx.rect(x, y, w, h);
    }

    loadImage(img) {
        // Determine available area minus header (top) and sidebar (right)
        const header = document.querySelector('header');
        const sidebar = document.getElementById('sidebar');
        const availW = window.innerWidth - (sidebar ? sidebar.offsetWidth : 0) - 40;
        const availH = window.innerHeight - (header ? header.offsetHeight : 0) - 40;

        let w = img.width;
        let h = img.height;
        const scale = Math.min(availW / w, availH / h, 1);
        w *= scale;
        h *= scale;

        // Create scaled image to keep crop coordinates in sync
        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        off.getContext('2d').drawImage(img, 0, 0, w, h);
        this.image = off;

        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx.drawImage(this.image, 0, 0);
        this.resetCrop();
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
        const aspect = this.aspect;
        const squareShapes = ['circle', 'ellipse', 'triangle', 'diamond', 'star', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon', 'trapezoid', 'parallelogram', 'left-arrow', 'right-arrow', 'left-point', 'right-point', 'bevel', 'rabbet', 'cross'];
        if (squareShapes.includes(aspect)) {
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
            const shape = this.aspect;
            if (shape === 'free' || shape.includes(':')) {
                this.ctx.strokeRect(sx, sy, sw, sh);
            } else {
                this.ctx.beginPath();
                this.createShapePath(this.ctx, shape, sx, sy, sw, sh);
                this.ctx.stroke();
            }
        }
    }

    getCroppedImage() {
        if (!this.image) return null;
        if (!this.crop || !this.crop.w || !this.crop.h) {
            this.resetCrop();
        }
        const { x, y, w, h } = this.crop;
        const sx = w >= 0 ? x : x + w;
        const sy = h >= 0 ? y : y + h;
        const sw = Math.abs(w);
        const sh = Math.abs(h);
        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        const shape = this.aspect;
        if (shape !== 'free' && !shape.includes(':')) {
            ctx.beginPath();
            this.createShapePath(ctx, shape, 0, 0, sw, sh);
            ctx.clip();
        }
        ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, sw, sh);
        return canvas;
    }
}
