export function initFilters(canvas) {
    const controls = {
        grayscale: document.getElementById('grayscale'),
        brightness: document.getElementById('brightness'),
        contrast: document.getElementById('contrast'),
        saturation: document.getElementById('saturation'),
        opacity: document.getElementById('opacity'),
        blur: document.getElementById('blur')
    };

    function update() {
        canvas.style.filter = getFilterString();
    }

    Object.values(controls).forEach(input => {
        input.addEventListener('input', update);
    });

    update();
}

export function getFilterString() {
    const grayscale = document.getElementById('grayscale').value;
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const saturation = document.getElementById('saturation').value;
    const opacity = document.getElementById('opacity').value;
    const blur = document.getElementById('blur').value;
    return `grayscale(${grayscale}) brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) opacity(${opacity}) blur(${blur}px)`;
}
