import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaurantService, WhatsappService } from '../../../core/services';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly restaurant = inject(RestaurantService);
  protected readonly whatsapp = inject(WhatsappService);
  protected readonly year = new Date().getFullYear();
}
