import photoStripsData from "../../config/photo-strips.json";

export interface PhotoStrip {
  id: string;
  images: string[];
}

interface PhotoStripsConfig {
  strips: PhotoStrip[];
}

export function getPhotoStrips(): PhotoStrip[] {
  const config = photoStripsData as PhotoStripsConfig;
  return config.strips;
}

export function getPhotoStripById(id: string): PhotoStrip | undefined {
  const strips = getPhotoStrips();
  return strips.find(strip => strip.id === id);
}