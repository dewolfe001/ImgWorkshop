export function convert(canvas, format, quality) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, format, quality);
    });
}
