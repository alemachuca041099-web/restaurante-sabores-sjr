import { Component, computed, inject } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { DISH_TAG_LABELS } from '../../../core/models';
import { MxnPipe } from '../../../core/pipes/mxn.pipe';
import { MenuService, WhatsappService } from '../../../core/services';
import { Modal } from '../../../shared/components/modal/modal';

/** Global dish drawer. Driven by MenuService.selectedDish so any section can open it. */
@Component({
  selector: 'app-dish-detail',
  imports: [Modal, MxnPipe, ImgFallbackDirective],
  templateUrl: './dish-detail.html',
  styleUrl: './dish-detail.scss',
})
export class DishDetail {
  protected readonly menu = inject(MenuService);
  protected readonly whatsapp = inject(WhatsappService);

  protected readonly dish = this.menu.selectedDish;
  protected readonly isOpen = computed(() => this.dish() !== null);

  protected readonly categoryName = computed(() => {
    const d = this.dish();
    return d ? this.menu.categoryName(d.categoryId) : '';
  });

  protected readonly tags = computed(() => (this.dish()?.tags ?? []).map((t) => DISH_TAG_LABELS[t]));

  protected readonly whatsappUrl = computed(() => {
    const d = this.dish();
    return d ? this.whatsapp.dishInquiryUrl(d.name) : '';
  });

  protected close(): void {
    this.menu.closeDish();
  }
}
