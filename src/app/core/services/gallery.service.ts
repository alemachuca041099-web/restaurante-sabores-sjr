import { Injectable, computed } from '@angular/core';
import { GalleryData, GalleryItem } from '../models';
import { loadJsonSignal } from './data-loader';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly data = loadJsonSignal<GalleryData>('gallery.json', { items: [] });
  readonly items = computed<GalleryItem[]>(() => this.data()?.items ?? []);
  readonly hasItems = computed(() => this.items().length > 0);
}
