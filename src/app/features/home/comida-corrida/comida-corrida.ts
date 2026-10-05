import { Component, inject } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { MxnPipe } from '../../../core/pipes/mxn.pipe';
import { ComidaCorridaService, WhatsappService } from '../../../core/services';
import { Icon } from '../../../shared/components/icon/icon';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/**
 * "Comida Corrida" — daily set menu. A photo sits alongside an elegant
 * ticket-style card: price, what's included, and the rotating guisos.
 */
@Component({
  selector: 'app-comida-corrida',
  imports: [RevealDirective, ImgFallbackDirective, MxnPipe, Icon, SectionTitle],
  templateUrl: './comida-corrida.html',
  styleUrl: './comida-corrida.scss',
})
export class ComidaCorrida {
  protected readonly comidaCorrida = inject(ComidaCorridaService);
  protected readonly whatsapp = inject(WhatsappService);
}
