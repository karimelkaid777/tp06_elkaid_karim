import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {environment} from '../environments/environment';
import {mockBackendInterceptor} from './pollutions/interceptors/mock-backend-interceptor';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { AuthState } from './shared/states/auth.state';
import { FavoritesState } from './shared/states/favorites.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      // Je n'ai plus besoin de mocker le backend en production puisque j'ai un vrai backend maintenant
      //...(!environment.production ? [withInterceptors([mockBackendInterceptor])] : [])
    ),
    // Configuration NGXS
    provideStore(
      [AuthState, FavoritesState], // États à enregistrer
      {
        developmentMode: !environment.production,
      },
      withNgxsStoragePlugin({
        keys: ['auth'], // Persiste uniquement l'état auth dans le localStorage
      })
    )
  ]
};
