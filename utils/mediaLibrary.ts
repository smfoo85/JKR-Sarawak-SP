import type { MediaItem } from '../types';

const DB_KEY = 'jkr-media-library';

// Helper function to read a file as a Base64 string
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Retrieve all images from localStorage
export const getImages = (): MediaItem[] => {
  try {
    const storedImages = localStorage.getItem(DB_KEY);
    return storedImages ? JSON.parse(storedImages) : [];
  } catch (error) {
    console.error("Failed to parse images from localStorage", error);
    return [];
  }
};

// Save all images to localStorage
const saveImages = (images: MediaItem[]) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(images));
  } catch (error) {
    console.error("Failed to save images to localStorage", error);
  }
};

// Add a new image
export const addImage = async (file: File): Promise<MediaItem[]> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File is not a valid image type.');
  }

  const data = await blobToBase64(file);
  const newImage: MediaItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    data,
    type: file.type,
    size: file.size,
  };

  const images = getImages();
  const updatedImages = [...images, newImage];
  saveImages(updatedImages);
  return updatedImages;
};

// Delete an image by its ID
export const deleteImage = (id: string): MediaItem[] => {
  const images = getImages();
  const updatedImages = images.filter(image => image.id !== id);
  saveImages(updatedImages);
  return updatedImages;
};

// Update an image's name
export const updateImageName = (id: string, newName: string): MediaItem[] => {
    const images = getImages();
    const updatedImages = images.map(image => 
        image.id === id ? { ...image, name: newName } : image
    );
    saveImages(updatedImages);
    return updatedImages;
};