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

        // gif.js attaches the constructor to `window` rather than providing a
        // global variable binding. When this module runs in an ES module scope,
        // referencing `GIF` directly results in an unresolvable reference and the
        // GIF branch below is skipped. Access the constructor via `window.GIF`
        // explicitly to ensure GIF exports are created when the library is
        // loaded.
        if (format === 'image/gif' && typeof window !== 'undefined' && window.GIF) {
            const gifQuality = Math.max(1, Math.round((1 - quality) * 30));
            const gif = new window.GIF({
                workers: 2,
                quality: gifQuality,
                workerScript: 'src/gif.worker.js'
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
