export type GallerySize = 'normal' | 'wide' | 'tall' | 'large';

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  caption?: string;
  size?: GallerySize;
}

export interface GalleryData {
  items: GalleryItem[];
}
