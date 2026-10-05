import { Component, inject } from '@angular/core';
import { WhatsappService } from '../../../core/services';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.scss',
})
export class WhatsappButton {
  protected readonly whatsapp = inject(WhatsappService);
}
