import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@/app/environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';

import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AppConfigurator } from '@/app/layout/components/app.configurator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { PrefferedLanguages } from '@/app/state/user/user.reducer';
import { Store } from '@ngrx/store';
import { setCredentials } from '@/app/state/auth/auth.action';
import { setUserDetails } from '@/app/state/user/user.action';
import { Localstorage, LocalStoragekeys } from '@/app/shared/services/localstorage.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        CheckboxModule,
        InputTextModule,
        RouterModule,
        AppConfigurator,
        IconFieldModule,
        InputIconModule,
        ButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class Login {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);
    private localStorage = inject(Localstorage);

    constructor() { }

    private readonly store = inject(Store);

    LayoutService = inject(LayoutService);
    cookieService = inject(CookieService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false]
    });

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        // Intl.DateTimeFormat() - It helps work with dates and times for different countries.
        // resolvedOptions() - “Tell me the settings you are currently using.” like - "What country/time settings are you using?"
        // timeZone - “What’s your time zone?” It gives us the time zone of the user, like "America/New_York" or "Europe/Paris".
        const payload = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
            // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        this.http.post<any>(`${environment.apiBaseUrl}/Audit/auditor-login`, payload, { withCredentials: true, observe: 'response' }).subscribe({
            next: (response: HttpResponse<any>) => {
                if (response.status === 200) {
                    const refreshToken = response.body?.data?.refreshToken;
                    const accessToken = response.body?.data?.accessToken;
                    const userData = response.body?.data?.auditor;
                    const sessionExpiration = response.body?.data?.sessionExpiry ? new Date(response.body.data.sessionExpiry) : null;

                    // this.cookieService.set('UserRefreshToken', refreshToken, {
                    //     secure: true,
                    //     sameSite: 'Lax',
                    //     path: '/',
                    //     expires: new Date().getDate() + 7 // Set cookie to expire in 7 days
                    // });

                    const updatedUserData = {
                        ...userData,
                        prefferedLanguage: userData?.prefferedLanguage || PrefferedLanguages?.EnglishUS
                    };

                    if (accessToken) {
                        // localStorage.setItem('UserAccessToken', accessToken);
                        // localStorage.setItem('UserData',JSON.stringify(updatedUserData));
                        // this.localStorage.setItem(LocalStoragekeys.UserAccessToken, accessToken);
                        this.localStorage.setItem(LocalStoragekeys.UserData, updatedUserData);
                        this.localStorage.setItem(LocalStoragekeys.UserSessionExpiration, sessionExpiration?.toISOString());
                        this.store.dispatch(setCredentials({ accessToken: response.body?.data?.accessToken || null, sessionExpiration: sessionExpiration }));
                        this.store.dispatch(setUserDetails({
                            id: updatedUserData?.id,
                            userName: updatedUserData?.userName,
                            email: updatedUserData?.email,
                            profileRole: updatedUserData?.profileRole,
                            billingRole: updatedUserData?.billingRole,
                            prefferedLanguage: updatedUserData?.prefferedLanguage,
                            timeZone: updatedUserData?.timeZone
                        }));
                    }

                    this.router.navigate(['/']);
                } else {
                    alert('User login was unsuccessful');

                }
            },
            error: () => {
                alert('User login was unsuccessful');
                // this.router.navigate(['/']);
            }
        });
    }
}
