import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { CygnusPreset } from './core/theme/cygnus.preset';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './state/auth/auth.reducer';
import { userReducer } from './state/user/user.reducer';
import { globalRefreshInterceptor } from './core/interceptors/global.refresh-interceptor';
import { httpErrorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { encryptionInterceptor } from './core/interceptors/encryption.interceptor';
import { DivisionListComponent } from './features/audits/organization/divisions/list/division-list.component';
import { CLIENT_MODE, CLIENT_MODE_VALUE } from './core/config/client-mode';
import { AuthService } from './core/services/auth.service';
import { NavigationHistoryService } from './shared/services/navigation-history.service';

export const appConfig: ApplicationConfig = {
    providers: [
        // Which client this build is for — decides which static seed file each
        // data source reads from. Toggle it in core/config/client-mode.ts, which the
        // module-level seed files read directly; this just exposes it to DI.
        { provide: CLIENT_MODE, useValue: CLIENT_MODE_VALUE },
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation(),
            withPreloading(PreloadAllModules)),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                globalRefreshInterceptor,
                httpErrorInterceptor,
                loggingInterceptor,
                encryptionInterceptor
            ])
        ),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: CygnusPreset, options: { darkModeSelector: '.app-dark' } } }),
        provideStore({ auth: authReducer, user: userReducer }),
        provideStoreDevtools({
            maxAge: 25, // devtools will keep only last 25 snapshots like last 25 states, ie last 25 dispatched actions
            logOnly: !isDevMode(), //returns whether angular is in development mode if logOnly false then devtools can dispatch, time travel and read state, if logonly true devtools can only view logs
            autoPause: true, // When the Redux DevTools window is closed: NgRx stops recording actions, when we open it again: the recording gets resumes again
            //Why this exists:
            // large apps dispatch a LOT of actions
            // recording everything costs memory
            trace: false, //if true then traces from where the action is dispatche from 
            connectInZone: true, //need to leaen
        }),
        // Create NavigationHistoryService on app start so it subscribes to router
        // events before the first NavigationEnd — otherwise it's only created when
        // the first [btn-back] renders and misses the pages visited before that.
        provideAppInitializer(() => {
            inject(NavigationHistoryService);
        }),
        // Restore the logged-in user on app start (get-profile → setUserDetails).
        // checkAuth() returns Promise<Observable>, so await it and then subscribe via firstValueFrom;
        // its catchError returns of(null), so a failed check never blocks bootstrapping.
        // provideAppInitializer(async () => {
        //     const authService = inject(AuthService);
        //     const checkAuth$ = await authService.checkAuth();
        //     return firstValueFrom(checkAuth$);
        // }),
    ]
};
