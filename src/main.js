import { initUploader } from './uploader.js';
import { Cropper } from './cropper.js';
import { convert } from './converter.js';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const aspectSelect = document.getElementById('aspect-ratio');
const formatSelect = document.getElementById('output-format');
const qualityInput = document.getElementById('quality');
const downloadBtn = document.getElementById('download');

const cropper = new Cropper(canvas, aspectSelect);

initUploader(dropZone, fileInput, (img) => {
    cropper.loadImage(img);
});

downloadBtn.addEventListener('click', async () => {
    const cropped = cropper.getCroppedImage();
    if (!cropped) {
        alert('Please select an area to crop');
        return;
    }
    const format = formatSelect.value;
    const quality = parseFloat(qualityInput.value);
    const blob = await convert(cropped, format, quality);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image.${format.split('/')[1]}`;
    a.click();
    URL.revokeObjectURL(url);
});
