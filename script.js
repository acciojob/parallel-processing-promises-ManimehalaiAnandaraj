

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set timeout to handle stalled requests
    const timeoutId = setTimeout(() => {
      reject(new Error(Image load timed out: ${url}));
    }, 15000); // 15 second timeout
    
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(Failed to load image: ${url}));
    };
    
    img.src = url;
  });
}

/**
 * Main function to download multiple images in parallel
 * @param {string[]} imageUrls - Array of image URLs to download
 * @returns {Promise<HTMLImageElement[]>} - Resolves with array of loaded images
 */
async function downloadImages(imageUrls) {
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const outputDiv = document.getElementById('output');
  
  // Clear previous state
  outputDiv.innerHTML = '';
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
  
  // Show loading spinner
  loadingDiv.style.display = 'block';
  
  try {
    // Create array of promises for all downloads
    const promises = imageUrls.map(url => 
      downloadImage(url)
        .catch(error => {
          // Return error to handle individual failures
          return error;
        })
    );
    
    // Wait for all downloads to complete
    const results = await Promise.all(promises);
    
    // Process results
    const successfulImages = results.filter(result => result instanceof Image);
    const errors = results.filter(result => result instanceof Error);
    
    // Hide loading spinner
    loadingDiv.style.display = 'none';
    
// Display successful images
    successfulImages.forEach(img => {
      const container = document.createElement('div');
      container.className = 'image-container';
      container.appendChild(img);
      outputDiv.appendChild(container);
    });
    
    // Handle errors
    if (errors.length > 0) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = ${errors.length} image(s) failed to load. First error: ${errors[0].message};
      
      if (successfulImages.length === 0) {
        throw new Error('All images failed to download');
      }
    }
    
    return successfulImages;
  } catch (error) {
    // Handle unexpected errors
    loadingDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    errorDiv.textContent = Download error: ${error.message};
    return [];
  }
}


const imageUrls = [
      { url: "https://picsum.photos/id/237/200/300" },
      { url: "https://picsum.photos/id/238/200/300" },
      { url: "https://picsum.photos/id/239/200/300" },
    ];
downloadImages(imageUrls);
 
