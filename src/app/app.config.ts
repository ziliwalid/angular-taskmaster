import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { CoreModule } from './core/core.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),    // ✅ Added withFetch() for SSR
    provideAnimations(),               // ✅ Animations for Material
    importProvidersFrom(CoreModule)    // ✅ Our Core Module
  ]
};