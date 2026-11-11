import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';
import { Localstorage, LocalStoragekeys } from '@/app/shared/services/localstorage.service';
import { Store } from '@ngrx/store';
import { updateUserDetails } from '@/app/state/user/user.action';
import { selectUserTimeZone } from '@/app/state/user/user.selector';
import { LayoutService } from '@/app/layout/service/layout.service';
import { DateTime } from 'luxon';

interface AddMethodsAndRule {
    id: number;
    methodName: string;
    methodExpiry: string; // DateTimeOffset arrives as ISO string, e.g. "2026-05-13T18:00:00+04:00"
}

@Component({
    selector: 'app-application-request',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './application-request.html',
    styleUrl: './application-request.scss'
})
export class ApplicationRequest implements OnInit {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private messageService = inject(MessageService);
    private userTimeZoneState: Signal<string | undefined>;
    private localStorage = inject(Localstorage);
    userTimeZone: string | null = null;

    store = inject(Store);

    private readonly getMethodUrl = `${environment.apiBaseUrl}/Audit/get-method`;

    /** Raw ISO string (with offset) received from the API */
    private methodExpiry: string | null = null;

    /** Expiry formatted in the user's timezone — used for display */
    requestExpiry: string | null = null;

    constructor(public layoutService: LayoutService) {
        this.userTimeZoneState = this.store.selectSignal(selectUserTimeZone);
    }

    async ngOnInit(): Promise<void> {
        this.userTimeZone = this.userTimeZoneState() || '';

        if (!this.userTimeZone) {
            const userData = await this.localStorage.getItem(LocalStoragekeys.UserData);
            this.store.dispatch(updateUserDetails({ timeZone: userData?.timeZone }));
            this.userTimeZone = userData?.timeZone || 'UTC';
        }

        this.fetchMethodExpiry(this.userTimeZone);
    }

    form: FormGroup = this.fb.group({
        requestName: ['', [Validators.required, Validators.minLength(3)]],
        requestDescription: ['', [Validators.required, Validators.minLength(10)]]
    });

    private fetchMethodExpiry(userTimeZone: string | null): void {
        const params = new HttpParams().set('methodName', 'submit_request');

        this.http.get<any>(this.getMethodUrl, { params }).subscribe({
            next: (response) => {
                this.methodExpiry = response?.data?.methodExpiry ?? null;
                console.log('Fetched method expiry:', this.methodExpiry);

                if (!this.methodExpiry) return;

                // Format for display in the user's local timezone
                this.requestExpiry = new Date(this.methodExpiry).toLocaleString('en-US', {
                    timeZone: userTimeZone!,
                    hour12: false,
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Could not verify method expiry. Submission may be blocked.'
                });
            }
        });
    }

    /**
     * Compares "now" against the fetched MethodExpiry in the user's timezone.
     * DateTimeOffset from .NET serialises with a UTC offset, so Date.parse handles it
     * correctly — the comparison is timezone-aware by design.
     */
    checkExpired(): boolean {
        if (!this.methodExpiry) return false;

        // let userTimeZone = this.userTimeZoneState(); // Default to Dubai if timezone is unavailable


        // Convert both instants to the user's local wall-clock time for comparison
        // const nowInTz = new Date(
        //     new Date().toLocaleString('en-US', { timeZone: this.userTimeZone! })
        // );

        // const expiryInTz = new Date(
        //     new Date(this.userTimeZone!).toLocaleString('en-US', { timeZone: this.userTimeZone! })
        // );


        const nowInTz = DateTime.fromJSDate(new Date())
            .setZone(this.userTimeZone!);

        const expiryInTz = DateTime.fromJSDate(new Date(this.methodExpiry))
            .setZone(this.userTimeZone!);

        if (!nowInTz || !expiryInTz) return false;

        return nowInTz > expiryInTz;
    }

    onSubmit(): void {
        // if (this.form.invalid) {
        //     this.form.markAllAsTouched();
        //     return;
        // }

        console.log("check expiry", this.checkExpired());

        const isExpired = this.checkExpired();

        if (isExpired) {
            this.messageService.add({
                severity: 'error',
                summary: 'Request Expired',
                detail: `Submission is no longer allowed. Method expired on ${this.requestExpiry}.`
            });
            return;
        }

        const payload = this.form.value;

        this.http.post<any>(`${environment.apiBaseUrl}/Application/submit-request`, payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Application request submitted successfully.'
                });
                this.form.reset();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to submit application request.'
                });
            }
        });
    }
}
