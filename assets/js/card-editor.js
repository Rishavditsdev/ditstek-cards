(function () {
    const form = document.getElementById('cardEditorForm');
    const preview = document.getElementById('cardPreview');
    const downloadButton = document.getElementById('downloadPng');
    const cropperModalElement = document.getElementById('imageCropperModal');
    const cropperImage = document.getElementById('cropperImage');
    const applyCropButton = document.getElementById('applyCrop');
    const cropperModal = cropperModalElement && window.bootstrap
        ? bootstrap.Modal.getOrCreateInstance(cropperModalElement)
        : null;
    let cropper;
    let selectedImageInput;
    let selectedImageTarget;
    let selectedImageUrl;
    let selectedImageAspectRatio = 1;

    if (form && preview) {
        form.addEventListener('input', function (event) {
            const input = event.target;
            const field = input.dataset.editorField;

            if (!field || input.type === 'file') {
                return;
            }

            const target = preview.querySelector('[data-preview-field="' + field + '"]');

            if (field === 'date') {
                const dateParts = input.value.trim().split(/\s+/, 2);
                const dateDay = preview.querySelector('[data-preview-date-day]');
                const dateMonth = preview.querySelector('[data-preview-date-month]');

                if (dateDay || dateMonth) {
                    if (dateDay) {
                        dateDay.textContent = dateParts[0] || 'Date';
                    }
                    if (dateMonth) {
                        dateMonth.textContent = dateParts[1] || '';
                    }
                    return;
                }
            }

            if (target) {
                target.textContent = input.value;
            }
        });

        form.addEventListener('change', function (event) {
            const input = event.target;
            const field = input.dataset.editorField;

            if (!field) {
                return;
            }

            const target = preview.querySelector('[data-preview-image="' + field + '"]');

            if (target && input.tagName === 'SELECT') {
                target.src = input.value;
                return;
            }

            if (input.type !== 'file' || !input.files || !input.files[0]) {
                return;
            }

            if (target && cropperImage && cropperModal && window.Cropper) {
                if (selectedImageUrl) {
                    URL.revokeObjectURL(selectedImageUrl);
                }

                selectedImageInput = input;
                selectedImageTarget = target;
                const frame = target.getBoundingClientRect();
                selectedImageAspectRatio = frame.width > 0 && frame.height > 0
                    ? frame.width / frame.height
                    : 1;
                selectedImageUrl = URL.createObjectURL(input.files[0]);
                target.src = selectedImageUrl;
                cropperImage.onload = function () {
                    cropperModalElement.addEventListener('shown.bs.modal', function () {
                        if (cropper) {
                            cropper.destroy();
                        }

                        cropper = new Cropper(cropperImage, {
                            aspectRatio: selectedImageAspectRatio,
                            viewMode: 1,
                            dragMode: 'move',
                            autoCropArea: 0.9,
                            responsive: true,
                            background: false
                        });
                    }, { once: true });
                    cropperModal.show();
                };
                cropperImage.src = selectedImageUrl;
            }
        });
    }

    if (applyCropButton) {
        applyCropButton.addEventListener('click', function () {
            if (!cropper || !selectedImageTarget) {
                return;
            }

            const canvas = cropper.getCroppedCanvas({
                width: 1000,
                height: Math.round(1000 / selectedImageAspectRatio),
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });

            selectedImageTarget.src = canvas.toDataURL('image/jpeg', 0.92);
            selectedImageTarget.onload = function () {
                if (selectedImageInput) {
                    selectedImageInput.value = '';
                }
                cropperModal.hide();
            };
        });
    }

    if (cropperModalElement) {
        cropperModalElement.addEventListener('hidden.bs.modal', function () {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            if (cropperImage) {
                cropperImage.removeAttribute('src');
            }
        });
    }

    if (downloadButton && preview && window.html2canvas) {
        downloadButton.addEventListener('click', function () {
            downloadButton.disabled = true;
            downloadButton.textContent = 'Preparing PNG...';

            html2canvas(preview, {
                backgroundColor: null,
                scale: 2,
                useCORS: true
            }).then(function (canvas) {
                const link = document.createElement('a');
                const nameFields = Array.from(form.querySelectorAll('[data-editor-field]'))
                    .filter(function (input) {
                        const field = input.dataset.editorField;
                        return field === 'name' || field.endsWith('_name');
                    })
                    .map(function (input) {
                        return input.value.trim();
                    })
                    .filter(Boolean);
                const fileName = nameFields.join('-')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '') || 'ditstek-card';
                link.download = (fileName || 'ditstek-card') + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).finally(function () {
                downloadButton.disabled = false;
                downloadButton.textContent = 'Download PNG';
            });
        });
    }
})();
