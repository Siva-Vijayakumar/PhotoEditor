document.addEventListener('DOMContentLoaded', () => {
  const contrastInput = document.getElementById('contrast');
  const brightnessInput = document.getElementById('brightness');
  const saturationInput = document.getElementById('saturation');
  const hueInput = document.getElementById('hue');
  const saveButton = document.getElementById('saveButton');
  const previewImage = document.getElementById('previewImage');
  const imageElement = document.getElementById('image');

  const updateImage = () => {
    const contrast = contrastInput.value;
    const brightness = brightnessInput.value;
    const saturation = saturationInput.value;
    const hue = hueInput.value;
    const imageUrl = imageElement.src.replace(window.location.origin, '');

    fetch('/adjust', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrl, contrast, brightness, saturation, hue })
    })
    .then(response => response.text())
    .then(adjustedImageUrl => {
      previewImage.src = adjustedImageUrl + '?timestamp=' + new Date().getTime(); // To prevent caching issues
    })
    .catch(error => console.error('Error:', error));
  };

  const saveImage = () => {
    const adjustedImageUrl = previewImage.src;
    const link = document.createElement('a');
    link.href = adjustedImageUrl;
    link.download = 'adjusted_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (contrastInput && brightnessInput && saturationInput && hueInput) {
    contrastInput.addEventListener('input', updateImage);
    brightnessInput.addEventListener('input', updateImage);
    saturationInput.addEventListener('input', updateImage);
    hueInput.addEventListener('input', updateImage);

    saveButton.addEventListener('click', saveImage);
  }
});
