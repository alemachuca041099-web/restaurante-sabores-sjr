import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/**
 * Replaces a broken image with an on-brand placeholder so the layout never
 * shows a broken icon while real photos are being added to assets/images.
 */
@Directive({ selector: 'img[appImgFallback]' })
export class ImgFallbackDirective {
  /** Short label rendered inside the placeholder (e.g. the dish name). */
  readonly fallbackLabel = input<string>('', { alias: 'appImgFallback' });

  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private applied = false;

  @HostListener('error')
  onError(): void {
    if (this.applied) return;
    this.applied = true;
    const img = this.el.nativeElement;
    img.src = buildPlaceholder(this.fallbackLabel());
    img.classList.add('img-placeholder');
  }
}

const XML_ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
};

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => XML_ESCAPES[c] ?? c);
}

function buildPlaceholder(label: string): string {
  const text = escapeXml(label.trim().slice(0, 28) || 'SABORES');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#141312"/>
  <circle cx="400" cy="400" r="250" fill="none" stroke="#c9a24a" stroke-opacity="0.55" stroke-width="2"/>
  <circle cx="400" cy="400" r="232" fill="none" stroke="#c9a24a" stroke-opacity="0.25" stroke-width="1"/>
  <path d="M400 300 l14 36 36 14 -36 14 -14 36 -14 -36 -36 -14 36 -14z" fill="#e6c672"/>
  <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#f3ede1" letter-spacing="2">${text}</text>
  <text x="400" y="510" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#a39d90" letter-spacing="5">FOTOGRAFÍA PRÓXIMAMENTE</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
