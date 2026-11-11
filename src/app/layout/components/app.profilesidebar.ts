import { Component, computed, inject, isDevMode, OnInit, signal, Signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { LayoutService } from '@/app/layout/service/layout.service';
import { Store } from '@ngrx/store';
import { clearCredentials } from '@/app/state/auth/auth.action';
import { UserState, LanguagesRoutes, PrefferedLanguages } from '@/app/state/user/user.reducer';
import { clearUserDetails, setUserDetails, updateUserDetails } from '@/app/state/user/user.action';
import { selectAccessToken } from '@/app/state/auth/auth.selector';
import { selectUserState, selectUserId, selectUserUserName, selectUserEmail, selectUserProfileRole, selectUserPrefferedLanguage, selectUserTimeZone } from '@/app/state/user/user.selector';
import { UserProfileNew } from '@/app/apps/poc/user-profile-new/user-profile-new';
import { UserBillingNew } from '@/app/apps/poc/user-billing-new/user-billing-new';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';
import { Localstorage, LocalStoragekeys } from '@/app/shared/services/localstorage.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { retry } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';


@Component({
    selector: '[app-profilesidebar]',
    imports: [ButtonModule, DrawerModule, BadgeModule, UserProfileNew, UserBillingNew, FormsModule, SelectModule, Toast, DatePipe],
    providers: [MessageService],
    template: `
        <p-toast />
        <p-drawer [visible]="visible()" (onHide)="onDrawerHide()" position="right" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-profile-sidebar w-full sm:w-25rem">
            <div class="flex flex-col mx-auto md:mx-0">
                <span class="mb-2 font-semibold">Welcome</span>
                <span class="text-surface-500 dark:text-surface-400 font-medium">{{ userName() }}</span>
                <span class="text-surface-400 dark:text-surface-500 text-sm mb-8">{{ userEmail() }}</span>

                <div class="font-semibold text-xl">Select Language</div>
                    <p-select [(ngModel)]="dropdownValue" [options]="dropdownValues" optionLabel="language_name" (onChange)="onLanguageChange($event)" placeholder="Select" />

                <!-- <div class="font-semibold text-xl mt-4 mb-2">Select Time Zone</div> -->
                    <!-- <p-select [(ngModel)]="selectedTimeZone" [options]="timeZones" optionLabel="name" (onChange)="onTimezoneChange($event)" placeholder="Select Time Zone" /> -->

                <ul class="list-none m-0 p-0 mt-3">
                    <!-- <div *ngIf="this.profileRoleUpdatedInGlobal">profile role has been updated in global state</div> -->
                    <!-- <div *ngIf="this.profileRoleUpdated">profile role has been updated in props output</div> -->
                    <app-user-profile-new [user]="userState()" (profileRoleChangedUserData)="receivedUpdatedUserDetails($event)"></app-user-profile-new>
                    <app-user-billing-new [user]="userState()"></app-user-billing-new>
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-cog text-xl text-primary"></i>
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Settings</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Exercitation veniam</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-power-off text-xl text-primary"></i>
                            </span>
                            <button class="ml-4" (click)="signOut()">
                                <span class="mb-2 font-semibold">Sign Out</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Sed ut perspiciatis</p>
                            </button>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="flex flex-col mt-8 mx-auto md:mx-0">
                <span class="mb-2 font-semibold">Notifications</span>
                <span class="text-surface-500 dark:text-surface-400 font-medium mb-8">You have 3 notifications</span>

                <ul class="list-none m-0 p-0">
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-comment text-xl text-primary"></i>
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Response received</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">5 min ago</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-trash text-xl text-primary"></i>
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">opened by John Doe</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">15min ago</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-folder text-xl text-primary"></i>
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">updated by Jane Smith</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">3h ago</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- <div class="flex flex-col mt-8 mx-auto md:mx-0">
                <span class="mb-2 font-semibold">Messages</span>
                <span class="text-surface-500 dark:text-surface-400 font-medium mb-8">You have new messages</span>

                <ul class="list-none m-0 p-0">
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <img src="/demo/images/avatar/circle/avatar-m-8.png" alt="Avatar" class="w-8 h-8" />
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">James Robinson</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">10 min ago</p>
                            </div>
                            <p-badge value="3" class="ml-auto"></p-badge>
                        </a>
                    </li>
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <img src="/demo/images/avatar/circle/avatar-f-8.png" alt="Avatar" class="w-8 h-8" />
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Mary Watson</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">15min ago</p>
                            </div>
                            <p-badge value="1" class="ml-auto"></p-badge>
                        </a>
                    </li>
                    <li>
                        <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <img src="/demo/images/avatar/circle/avatar-f-4.png" alt="Avatar" class="w-8 h-8" />
                            </span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Aisha Webb</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">3h ago</p>
                            </div>
                            <p-badge value="2" class="ml-auto"></p-badge>
                        </a>
                    </li>
                </ul>
            </div> -->
        </p-drawer>
    `
})
export class AppProfileSidebar implements OnInit {
    visible = computed(() => !!this.layoutService.layoutState().profileSidebarVisible);

    inputTerm = signal('');
    router = inject(Router);
    dropdownValue: any = signal(null);
    dropdownValues: any[] = [];
    apiData = signal<any>(null);
    profileRoleUpdated = signal(false);
    profileRoleUpdatedInGlobal = signal(false);
    usersCurrentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    currentTime = new Date().toISOString();

    selectedTimeZone: any = null;
    timeZones = [
        { name: 'UTC', value: 'UTC' },
        { name: 'Local Time Zone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { name: 'Eastern Standard', value: 'America/New_York' },
        { name: 'Central European', value: 'Europe/Paris' },
        { name: 'India Standard', value: 'Asia/Kolkata' },
        { name: 'China Standard', value: 'Asia/Shanghai' },
        { name: 'Japan Standard', value: 'Asia/Tokyo' },
        { name: 'Gulf Standard', value: 'Asia/Dubai' },
        { name: 'Central European', value: 'Europe/Madrid' },
        { name: 'Central European', value: 'Europe/Berlin' },
        { name: 'Central European', value: 'Europe/Paris' },
        { name: 'French Polynesia', value: 'Pacific/Tahiti' },
    ];

    // Whole user object is still needed for the child [user] inputs and the localStorage spread
    userState: Signal<UserState>;
    userId: Signal<number | null>;
    userName: Signal<string | null>;
    userEmail: Signal<string | null>;
    userProfileRole: Signal<string | undefined>;
    userPrefferedLanguage: Signal<PrefferedLanguages | undefined>;
    userTimeZone: Signal<string | undefined>;
    accessToken: Signal<string | null>;

    private http = inject(HttpClient);
    private localStorage = inject(Localstorage);
    private authService = inject(AuthService);

    DateTime: Date | null = null;

    store = inject(Store);
    messageService = inject(MessageService);

    constructor(public layoutService: LayoutService) {
        this.userState = this.store.selectSignal(selectUserState);
        this.userId = this.store.selectSignal(selectUserId);
        this.userName = this.store.selectSignal(selectUserUserName);
        this.userEmail = this.store.selectSignal(selectUserEmail);
        this.userProfileRole = this.store.selectSignal(selectUserProfileRole);
        this.userPrefferedLanguage = this.store.selectSignal(selectUserPrefferedLanguage);
        this.userTimeZone = this.store.selectSignal(selectUserTimeZone);
        this.accessToken = this.store.selectSignal(selectAccessToken);
    }

    async ngOnInit(): Promise<void> {

        const date = new Date(); // Current local time

        const userTimeZone = this.userTimeZone() || '';

        if (!userTimeZone || userTimeZone == '') {
            const userData = await this.localStorage.getItem(LocalStoragekeys.UserData);
            this.store.dispatch(updateUserDetails({ timeZone: userData?.timeZone }));
        }

        const dubaiISO = date.toLocaleString('en-US', {
            timeZone: userTimeZone,
            hour12: false
        });

        // You now have a string of what time it is in Tokyo right now
        console.log(`Current time in Dubai: ${dubaiISO}`);

        const rawExpiry = await this.localStorage.getItem(LocalStoragekeys.UserSessionExpiration);

        console.log('Raw expiry from storage:', rawExpiry);

        console.log("time options is :", Intl.DateTimeFormat().resolvedOptions().hour12);

        this.DateTime = rawExpiry ? new Date(rawExpiry) : null;

        // this.http.get<HttpResponse<any>>(`${environment.apiBaseUrl}/Audit/get-languages`).subscribe({
        //     next: (response: any) => {
        //         this.dropdownValues = response.data;
        //     },
        //     error: () => {
        //         alert("failed to fetch language and region");
        //     }
        // });

        // to test the refresh endpoint
        // this.http.get('http://localhost:5250/api/Audit/sample', { withCredentials: true }).subscribe({});

        // this.http.get('http://localhost:5250/api/Audit/check-retr', { withCredentials: true }).pipe(retry(3)).subscribe({});

        if (!this.userId()) {
            const userData = await this.localStorage.getItem(LocalStoragekeys.UserData);
            if (userData) {
                this.store.dispatch(setUserDetails({
                    id: userData?.id,
                    userName: userData?.userName,
                    email: userData?.email,
                    profileRole: userData?.profileRole,
                    billingRole: userData?.billingRole,
                    prefferedLanguage: userData?.prefferedLanguage,
                }));
            }

            if (this.userProfileRole() !== "" || !!this.userProfileRole()) {
                this.profileRoleUpdatedInGlobal.set(true);
            }

            // console.log('User State in parent profile sidebar:', this.userState());
            // this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe((data) => {
            //     console.log('HTTP response received:', data);
            //     this.apiData.set(data);
            // });
        }


        // if (this.userState()?.prefferedLanguage || !isDevMode()) {
        //     const lang = this.userState()?.prefferedLanguage;
        //     const baseUrl = '/translation-demo/';

        //     switch (lang) {
        //         case 'en-US':
        //             // Forces browser to load the English bundle at the root
        //             window.location.href = baseUrl;
        //             break;
        //         case 'es-PR':
        //             // Forces browser to load the Spanish bundle in the subfolder
        //             window.location.href = baseUrl + 'es-PR/';
        //             break;
        //         default:
        //             window.location.href = baseUrl;
        //     }
        // }

        const englishUSUrl = LanguagesRoutes.EnglishUSRoute;
        const spanishPRUrl = LanguagesRoutes.SpanishPRRoute;
        const FrenchDefaultUrl = LanguagesRoutes.FrenchDefaultRoute;
        const GermanDefaultUrl = LanguagesRoutes.GermanDefaultRoute;
        const ArabicSAUrl = LanguagesRoutes.ArabicSARoute;
        const currentPath = window.location.pathname;

        let lang = this.userPrefferedLanguage();

        if (lang == null) {
            const userData = await this.localStorage.getItem(LocalStoragekeys.UserData);
            lang = userData?.prefferedLanguage;

            this.store.dispatch(
                updateUserDetails({ prefferedLanguage: lang })
            );
        }

        // if (lang === PrefferedLanguages.EnglishUS && currentPath !== LanguagesRoutes.EnglishUSRoute) {
        //     window.location.href = LanguagesRoutes.EnglishUSRoute;
        // } else if (lang === PrefferedLanguages.SpanishPR && currentPath !== LanguagesRoutes.SpanishPRRoute) {
        //     window.location.href = LanguagesRoutes.SpanishPRRoute;
        // } else if (lang === PrefferedLanguages.arabicSA && currentPath !== LanguagesRoutes.ArabicSARoute) {
        //     window.location.href = LanguagesRoutes.ArabicSARoute;
        // } else if (lang === PrefferedLanguages.frenchDefault && currentPath !== LanguagesRoutes.FrenchDefaultRoute) {
        //     window.location.href = LanguagesRoutes.FrenchDefaultRoute;
        // }

    }

    receivedUpdatedUserDetails(updatedUser: UserState) {
        console.log('Received updated user details from child component:', updatedUser);
        this.profileRoleUpdated.set(true);
    }

    // const selected = this.dropdownValues.find(
    //   x => x.language_code === this.dropdownValue
    // );

    // console.log(selected?.language_name); // "English-US"

    onLanguageChange(event: any) {
        console.log('Selected language code:', event);
        const selectedLanguage = event.value.language_code as PrefferedLanguages;
        // return;

        // localStorage.setItem(
        //     'UserData',
        //     JSON.stringify({
        //         ...this.userState(),
        //         prefferedLanguage: selectedLanguage
        //     })   // todo encrypt user data
        // );

        this.localStorage.setItem(LocalStoragekeys.UserData, {
            ...this.userState(),
            prefferedLanguage: selectedLanguage
        });

        this.store.dispatch(
            updateUserDetails({ prefferedLanguage: selectedLanguage })
        );

        // uncommets only at build time
        // switch (selectedLanguage) {
        //     case PrefferedLanguages.EnglishUS:
        //         window.location.href = LanguagesRoutes.EnglishUSRoute;
        //         break;

        //     case PrefferedLanguages.SpanishPR:
        //         window.location.href = LanguagesRoutes.SpanishPRRoute;
        //         break;

        //     case PrefferedLanguages.GermanDefault:
        //         window.location.href = LanguagesRoutes.GermanDefaultRoute;
        //         break;

        //     case PrefferedLanguages.frenchDefault:
        //         window.location.href = LanguagesRoutes.FrenchDefaultRoute;
        //         break;

        //     case PrefferedLanguages.arabicSA:
        //         window.location.href = LanguagesRoutes.ArabicSARoute;
        //         break;

        //     default:
        //         window.location.href = LanguagesRoutes.EnglishUSRoute;
        // }
    }


    async onTimezoneChange(event: any) {
        const selectedValue = event.value?.value;
        if (!selectedValue) return;

        const decryptedToken = await this.authService.decryptAndVerifyAccessToken(this.accessToken() ?? '');
        if (!decryptedToken) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to authenticate. Please log in again.' });
            return;
        }

        // this.http.put(
        //     'http://localhost:5251/api/Audit/update-timezone',
        //     { timeZone: selectedValue },
        //     { headers: { Authorization: `Bearer ${decryptedToken}` } }
        // ).subscribe({
        //     next: () => {
        //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Time zone updated successfully.' });
        //     },
        //     error: () => {
        //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update time zone.' });
        //     }
        // });
    }

    onDrawerHide() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: false
        }));
    }

    signOut() {
        // localStorage.removeItem('UserAccessToken');
        // localStorage.removeItem('UserData');
        // this.localStorage.removeItem(LocalStoragekeys.UserAccessToken);
        this.http.post(`${environment.apiBaseUrl}/Audit/logout`, {}, { withCredentials: true }).subscribe({
            next: () => {
                console.log('Logged out successfully');
                this.store.dispatch(clearCredentials());
                this.store.dispatch(clearUserDetails());
                this.localStorage.removeItem(LocalStoragekeys.UserData);
                this.messageService.add({ severity: 'success', summary: 'success', detail: 'You have been logged out successfully.' });
            },
            error: (err) => {
                console.error('Logout failed', err);
                this.messageService.add({ severity: 'error', summary: 'error', detail: 'Failed to logout' });
            }
        });
        this.onDrawerHide();
    }

    search() {
        console.log('Searching for:', this.inputTerm());
    }
}
