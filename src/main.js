import { initUploader } from './uploader.js';
import { Cropper } from './cropper.js';
import { convert } from './converter.js';
import { initFilters, getFilterString } from './filters.js';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const qualityInput = document.getElementById('quality');
const downloadBtn = document.getElementById('download');
const subFunctions = document.getElementById('sub-functions');
const filterControls = document.getElementById('filter-controls');
const exportControls = document.getElementById('export-controls');

const cropper = new Cropper(canvas);
let isPremium = false;
let currentFormat = 'image/jpeg';

initFilters(canvas);

function showCropping() {
    subFunctions.innerHTML = '';
    filterControls.classList.add('hidden');
    exportControls.classList.add('hidden');
    const options = [
        { value: 'free', label: 'Free' },
        { value: '1:1', label: 'Square' },
        { value: 'circle', label: 'Circle' },
        { value: 'ellipse', label: 'Ellipse', premium: true },
        { value: 'triangle', label: 'Triangle', premium: true },
        { value: 'diamond', label: 'Diamond', premium: true },
        { value: 'pentagon', label: 'Pentagon', premium: true },
        { value: 'hexagon', label: 'Hexagon', premium: true },
        { value: 'heptagon', label: 'Heptagon', premium: true },
        { value: 'octagon', label: 'Octagon', premium: true },
        { value: 'nonagon', label: 'Nonagon', premium: true },
        { value: 'decagon', label: 'Decagon', premium: true },
        { value: 'trapezoid', label: 'Trapezoid', premium: true },
        { value: 'parallelogram', label: 'Parallelogram', premium: true },
        { value: 'left-arrow', label: 'Left Arrow', premium: true },
        { value: 'right-arrow', label: 'Right Arrow', premium: true },
        { value: 'left-point', label: 'Left Point', premium: true },
        { value: 'right-point', label: 'Right Point', premium: true },
        { value: 'bevel', label: 'Bevel', premium: true },
        { value: 'rabbet', label: 'Rabbet', premium: true },
        { value: 'cross', label: 'Cross', premium: true },
        { value: 'star', label: 'Star', premium: true },
        { value: '16:9', label: '16:9' },
        { value: '4:3', label: '4:3' }
    ];
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.label;
        btn.className = 'sub-btn';
        if (!isPremium && opt.premium) {
            btn.disabled = true;
            btn.textContent += ' (Premium)';
        }
        btn.addEventListener('click', () => {
            cropper.setAspect(opt.value);
        });
        subFunctions.appendChild(btn);
    });
}

function showFilters() {
    subFunctions.innerHTML = '';
    exportControls.classList.add('hidden');
    filterControls.classList.remove('hidden');
    subFunctions.appendChild(filterControls);
}

function showExport() {
    subFunctions.innerHTML = '';
    filterControls.classList.add('hidden');
    exportControls.classList.remove('hidden');
    const formats = [
        { value: 'image/jpeg', label: 'JPEG' },
        { value: 'image/webp', label: 'WEBP' },
        { value: 'image/png', label: 'PNG' },
        { value: 'image/gif', label: 'GIF' }
    ];
    const formatContainer = document.createElement('div');
    formats.forEach(f => {
        const btn = document.createElement('button');
        btn.textContent = f.label;
        btn.className = 'sub-btn';
        if (f.value === currentFormat) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentFormat = f.value;
            formatContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        formatContainer.appendChild(btn);
    });
    subFunctions.appendChild(formatContainer);
    subFunctions.appendChild(exportControls);
}

document.querySelectorAll('#main-functions button').forEach(btn => {
    btn.addEventListener('click', () => {
        const fn = btn.dataset.fn;
        if (fn === 'cropping') showCropping();
        else if (fn === 'filters') showFilters();
        else if (fn === 'export') showExport();
    });
});

// show cropping options by default
showCropping();

initUploader(dropZone, fileInput, (img) => {
    cropper.loadImage(img);
});

downloadBtn.addEventListener('click', async () => {
    const cropped = cropper.getCroppedImage();
    if (!cropped) {
        alert('Please select an area to crop');
        return;
    }
    const format = currentFormat;
    const quality = parseFloat(qualityInput.value);
    const filter = getFilterString();
    const blob = await convert(cropped, format, quality, filter);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image.${format.split('/')[1]}`;
    a.click();
    URL.revokeObjectURL(url);
});

fetch('check_subscription.php')
    .then(r => r.json())
    .then(data => {
        if (data.premium) {
            document.getElementById('upgrade').style.display = 'none';
            isPremium = true;
        } else {
            filterControls.querySelectorAll('input').forEach(input => input.disabled = true);
            filterControls.querySelectorAll('.filter').forEach(filter => {
                filter.style.position = 'relative';
                const lock = document.createElement('div');
                lock.className = 'feature-lock';
                lock.title = 'Upgrade to access';
                lock.addEventListener('click', () => {
                    window.open('payment.php', '_blank');
                });
                filter.appendChild(lock);
            });
        }
    });
