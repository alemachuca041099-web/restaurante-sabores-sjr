import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { computed } from '@angular/core';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { RestaurantService, WhatsappService } from '../../../core/services';
import { Icon } from '../../../shared/components/icon/icon';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-location',
  imports: [RevealDirective, SectionTitle, Icon],
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class Location {
  protected readonly restaurant = inject(RestaurantService);
  protected readonly whatsapp = inject(WhatsappService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.restaurant.mapsEmbedUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
}
