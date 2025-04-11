const imageUrls = [
      { url: "https://picsum.photos/id/237/200/300" },
      { url: "https://picsum.photos/id/238/200/300" },
      { url: "https://picsum.photos/id/239/200/300" },
    ];
downloadImages(imageUrls);

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image from URL: ${url}`));
    };
    
    img.src = url;
  });
}

// Main function to download all images
async function downloadImages(imageUrls) {
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const outputDiv = document.getElementById('output');
  
  // Clear previous results
  outputDiv.innerHTML = '';
  errorDiv.textContent = '';
  
  // Show loading spinner
  loadingDiv.innerHTML = '<div class="spinner">Loading...</div>';
  
  try {
    // Create an array of promises for all image downloads
    const imagePromises = imageUrls.map(url => 
      downloadImage(url).catch(error => {
        // Return the error for individual image failures
        return error;
      })
    );
    
    // Wait for all downloads to complete (success or failure)
    const results = await Promise.all(imagePromises);
    
    // Process results
    const successfulImages = results.filter(result => result instanceof Image);
    const failedDownloads = results.filter(result => result instanceof Error);
    
    // Hide loading spinner
    loadingDiv.innerHTML = '';
    
    // Display successful images
    successfulImages.forEach(img => {
      outputDiv.appendChild(img);
      outputDiv.appendChild(document.createElement('br'));
    });
    
    // Display any errors
    if (failedDownloads.length > 0) {
      errorDiv.textContent = `${failedDownloads.length} images failed to load. First error: ${failedDownloads[0].message}`;
    }
    
    return successfulImages;
  } catch (error) {
    // This would catch unexpected errors in the Promise.all execution
    loadingDiv.innerHTML = '';
    errorDiv.textContent = `An unexpected error occurred: ${error.message}`;
    return [];
  }
}


 
