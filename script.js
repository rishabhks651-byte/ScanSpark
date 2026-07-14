document.getElementById('generate-btn').addEventListener('click', generateQR);

function generateQR() {
    const textInput = document.getElementById('qr-text').value.trim();
    const sizeInput = document.getElementById('qr-size').value;
    const qrResult = document.getElementById('qr-result');
    const qrImage = document.getElementById('qr-image');

    if (!textInput) {
        alert('Please enter a URL or text first!');
        return;
    }

    // Using the reliable updates qrserver API
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${sizeInput}&data=${encodeURIComponent(textInput)}`;
    
    qrImage.src = apiUrl;

    // Show result container once image loads to prevent layout jank
    qrImage.onload = () => {
        qrResult.classList.remove('hidden');
    };
}

// Separate setup for download because fetching third-party images requires blob conversion to prevent browser navigation redirect
document.getElementById('download-btn').addEventListener('click', async () => {
    const qrImage = document.getElementById('qr-image');
    if (!qrImage.src) return;

    try {
        const response = await fetch(qrImage.src);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `scanspark-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        alert('Failed to download QR code. Please try right-clicking the image.');
    }
});
