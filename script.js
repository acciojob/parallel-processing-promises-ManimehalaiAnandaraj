// Main function to download all images
async function downloadImages() {
    const outputDiv = document.getElementById('output');
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('download-images-button');
    
    // Clear previous state
    outputDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    loadingDiv.style.display = 'flex'; // Using flex for better centering
    
    try {
        // Validate imageUtils exists and has URLs
        if (!imageUtils || !Array.isArray(imageUtils) {
            throw new Error('imageUtils is not properly initialized');
        }
        
        if (imageUtils.length === 0) {
            throw new Error('No image URLs provided in imageUtils');
        }
        
        // Create download promises for all images with timeout
        const downloadPromises = imageUtils.map(url => 
            Promise.race([
                downloadImage(url),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout loading image from ${url}`)), 10000)
                )
            ])
        );
        
        // Wait for all downloads to complete
        const images = await Promise.allSettled(downloadPromises);
        
        // Process results
        const successfulDownloads = [];
        const failedDownloads = [];
        
        images.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                successfulDownloads.push(result.value);
            } else {
                failedDownloads.push({
                    url: imageUtils[index],
                    error: result.reason.message
                });
            }
        });
        
        // Display downloaded images
        successfulDownloads.forEach(img => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            imgContainer.innerHTML = `
                <img src="${img.src}" alt="Downloaded image">
                <div class="image-info">${new URL(img.src).pathname.split('/').pop()}</div>
            `;
            outputDiv.appendChild(imgContainer);
        });
        
        // Display errors if any
        if (failedDownloads.length > 0) {
            const errorList = failedDownloads.map(f => 
                `<li>${f.url}: ${f.error}</li>`
            ).join('');
            errorDiv.innerHTML = `
                <p>${failedDownloads.length} image(s) failed to download:</p>
                <ul>${errorList}</ul>
            `;
        }
        
        // Show summary notification
        showNotification(
            `Downloaded ${successfulDownloads.length} of ${imageUtils.length} images`,
            failedDownloads.length > 0 ? 'warning' : 'success'
        );
        
    } catch (error) {
        // Display critical error message
        errorDiv.innerHTML = `
            <p class="critical-error">Critical error:</p>
            <p>${error.message}</p>
        `;
        showNotification('Image download failed', 'error');
    } finally {
        // Always hide loading spinner
        loadingDiv.style.display = 'none';
    }
}

// Helper function to download a single image
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        // Validate URL
        if (!url || !url.startsWith('http')) {
            reject(new Error(`Invalid URL: ${url}`));
            return;
        }
        
        const img = new Image();
        
        img.onload = () => {
            // Add natural dimensions to the image object
            img.naturalWidth = img.width;
            img.naturalHeight = img.height;
            resolve(img);
        };
        
        img.onerror = () => {
            reject(new Error(`Failed to load image from ${url}`));
        };
        
        img.src = url;
    });
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', downloadImages);