import { Component, inject } from '@angular/core';
import { SectionTransitionService } from '../../../core/services';

/** Full-screen curtain wipe, mounted once at the root. See SectionTransitionService. */
@Component({
  selector: 'app-curtain',
  templateUrl: './curtain.html',
  styleUrl: './curtain.scss',
})
export class Curtain {
  protected readonly transition = inject(SectionTransitionService);
}
