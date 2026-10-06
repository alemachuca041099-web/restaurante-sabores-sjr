import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { ComidaCorrida } from '../comida-corrida/comida-corrida';
import { FeaturedDishes } from '../featured-dishes/featured-dishes';
import { PromotionsSection } from '../../promotions/promotions-section/promotions-section';
import { Story } from '../story/story';
import { GalleryPreview } from '../gallery-preview/gallery-preview';
import { Testimonials } from '../testimonials/testimonials';
import { Location } from '../location/location';

@Component({
  selector: 'app-home-page',
  imports: [
    Hero,
    ComidaCorrida,
    FeaturedDishes,
    PromotionsSection,
    Story,
    GalleryPreview,
    Testimonials,
    Location,
  ],
  template: `
    <app-hero />
    <app-promotions-section />
    <app-comida-corrida />
    <app-featured-dishes />
    <app-story />
    <app-gallery-preview />
    <app-testimonials />
    <app-location />
  `,
})
export class HomePage {}
