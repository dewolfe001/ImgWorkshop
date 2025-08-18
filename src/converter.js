export function convert(canvas, format, quality, filter) {
    return new Promise((resolve) => {
        const off = document.createElement('canvas');
        off.width = canvas.width;
        off.height = canvas.height;
        const ctx = off.getContext('2d');
        if (filter) {
            ctx.filter = filter;
        }
        ctx.drawImage(canvas, 0, 0);

        if (format === 'image/gif' && typeof GIF !== 'undefined') {
            const gifQuality = Math.max(1, Math.round((1 - quality) * 30));
            const gif = new GIF({
                workers: 2,
                quality: gifQuality,
                workerScript: 'lib/gif.worker.js'
            });
            gif.addFrame(off, { copy: true });
            gif.on('finished', (blob) => resolve(blob));
            gif.render();
        } else {
            off.toBlob((blob) => {
                resolve(blob);
            }, format, quality);
        }
    });
}
