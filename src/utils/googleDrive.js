/**
 * Extracts the file ID from a Google Drive sharing link.
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=download
 */
export function extractFileId(url) {
  const patterns = [
    /\/file\/d\/([^/?#]+)/,
    /[?&]id=([^&]+)/,
    /\/uc\?id=([^&]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Returns an embeddable URL for an image (direct download).
 */
export function getImageEmbedUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Returns an embeddable URL for a video (using Google's video player).
 * Note: This may not work for all videos; alternative is to use an iframe.
 */
export function getVideoEmbedUrl(fileId) {
  // This is the best available method for embedding Google Drive videos.
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Main function to get the appropriate embed URL based on type.
 */
export function getEmbedUrl(googleDriveLink, type) {
  const fileId = extractFileId(googleDriveLink);
  if (!fileId) return null;
  if (type === 'image') {
    return getImageEmbedUrl(fileId);
  } else if (type === 'video') {
    return getVideoEmbedUrl(fileId);
  }
  return null;
}