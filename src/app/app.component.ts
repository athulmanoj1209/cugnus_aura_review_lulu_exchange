import { Component, DestroyRef, inject, NgZone, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Localstorage, LocalStoragekeys } from './shared/services/localstorage.service';
import { Store } from '@ngrx/store';
import { AuthState } from './state/auth/auth.reducer';
import { UserState } from './state/user/user.reducer';
import { clearUserDetails } from './state/user/user.action';
import { clearCredentials, updateCredentials } from './state/auth/auth.action';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RightDrawerHostComponent } from './shared/components/right-drawer-host/com/right-drawer-host.component';
import { ConfirmActionDialogComponent } from './shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { ToastContainerComponent } from './shared/components/toast/com/toast-container.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, RightDrawerHostComponent, ConfirmActionDialogComponent,ToastContainerComponent],
    template: `<router-outlet></router-outlet> <app-right-drawer-host></app-right-drawer-host> <app-confirm-action-dialog global /> <app-toast-container />`
})
export class AppComponent { }
