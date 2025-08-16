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
        off.toBlob((blob) => {
            resolve(blob);
        }, format, quality);
    });
}
