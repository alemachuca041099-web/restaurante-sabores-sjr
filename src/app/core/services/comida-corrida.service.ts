import { Injectable, computed } from '@angular/core';
import { ComidaCorrida } from '../models';
import { loadJsonSignal } from './data-loader';

@Injectable({ providedIn: 'root' })
export class ComidaCorridaService {
  private readonly data = loadJsonSignal<ComidaCorrida | null>('comida-corrida.json', null);

  readonly value = computed(() => this.data());
  readonly loaded = computed(() => this.data() !== null);
}
