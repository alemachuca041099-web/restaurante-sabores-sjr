import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, shareReplay } from 'rxjs';

/**
 * Loads a JSON file from `assets/data` once and exposes it as a signal.
 * All content services use this helper so data fetching stays in one place.
 */
export function loadJsonSignal<T>(file: string, fallback: T) {
  const http = inject(HttpClient);
  const stream$ = http.get<T>(`assets/data/${file}`).pipe(
    catchError((err: unknown) => {
      console.error(`[SABORES] No se pudo cargar assets/data/${file}`, err);
      return of(fallback);
    }),
    shareReplay(1),
  );
  return toSignal(stream$, { initialValue: null });
}
