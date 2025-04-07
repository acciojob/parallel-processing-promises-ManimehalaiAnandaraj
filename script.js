async function downloadImages(imageURLs) {
  const outputDiv = document.getElementById('output');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');
  
  // Clear previous content
  outputDiv.innerHTML = '';
  errorDiv.innerHTML = '';
  
  // Show loading spinner
  loadingDiv.style.display = 'block';
  
  try {
    // Create array of promises for each image download
    const imagePromises = imageURLs.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
        img.src = url;
      });
    });
    
    // Wait for all downloads to complete
    const images = await Promise.all(imagePromises);
    
    // Display images
    images.forEach(img => outputDiv.appendChild(img));
    
  } catch (error) {
    // Display error message
    errorDiv.textContent = error.message;
  } finally {
    // Hide loading spinner
    loadingDiv.style.display = 'none';
  }
}