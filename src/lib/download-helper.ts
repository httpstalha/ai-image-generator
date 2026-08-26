/**
 * Robust Cross-Origin Image Download Helper
 * Converts remote URL to Blob object URL to force instant browser download dialog
 */
export async function downloadImageFile(imageUrl: string, filename: string): Promise<void> {
  try {
    // 1. Direct download for base64 / data URIs
    if (imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 2. Cross-origin blob fetch for remote image URLs
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2000);

  } catch (err) {
    // 3. Fallback: Draw to Canvas and trigger PNG download
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 1024;
        canvas.height = img.height || 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      img.onerror = () => {
        // Final fallback: open in new tab if browser blocks programmatic download
        window.open(imageUrl, '_blank');
      };
    } catch (canvasErr) {
      window.open(imageUrl, '_blank');
    }
  }
}
