async function downloadImages(imageURLs) {
  const outputDiv = document.getElementById('output');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');
	const download =document.getElementById('download-Images-button')
  
  // Clear previous content
  outputDiv.innerHTML = '';
  errorDiv.innerHTML = '';
  
  // Show loading spinner
  download.style.display = 'block';
  
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

// Call the function with an array of image URLs
downloadImages(['https://images.unsplash.com/photo-1742943892620-b0fe2db78226?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D',
				'https://images.unsplash.com/photo-1738189669835-61808a9d5981?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D',
				'https://images.unsplash.com/photo-1742390003820-27d480d1c8ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OXx8fGVufDB8fHx8fA%3D%3D'])
	.catch(console.error);



