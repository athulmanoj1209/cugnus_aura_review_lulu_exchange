import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '@/app/state/auth/auth.selector';
import { AuthService } from '@/app/core/services/auth.service';

function amountGreaterThanZero(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return value > 0 ? null : { minAmount: true };
}

@Component({
    selector: 'app-create-transaction',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SelectModule,
        InputNumberModule,
        ButtonModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './create-transaction.html',
    styleUrl: './create-transaction.scss',
})
export class CreateTransaction {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private messageService = inject(MessageService);
    private cryptoService = inject(AuthService);

    authStore = inject(Store);
    accessToken: Signal<string | null> = this.authStore.selectSignal(selectAccessToken);

    transactionTypes = [
        { label: 'Debit', value: 'debit' },
        { label: 'Credit', value: 'credit' }
    ];

    currencies = [
        { label: 'INR', value: 'INR' },
        { label: 'USD', value: 'USD' }
    ];

    form: FormGroup = this.fb.group({
        transactionType: [null, Validators.required],
        currency: [null, Validators.required],
        amount: [null, [Validators.required, amountGreaterThanZero]]
    });

    async onSubmit(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload = this.form.value;

        const encryptedAccessToken = this.accessToken();
        const decryptedAccessToken = await this.cryptoService.decryptAndVerifyAccessToken(encryptedAccessToken!);
        
        this.http.post<any>(`${environment.apiBaseUrl}/Audit/create-transaction`, { ...payload, transactionTime: new Date().toISOString() }, {
            // All options go in this single object
            headers: {
                'Authorization': `Bearer ${decryptedAccessToken}`,
                'Accept-Language': 'es-PR', // Note: kebab-case usually needs quotes
            },
            // withCredentials: true,
            observe: 'response'
        }
        ).subscribe({
            next: (response: HttpResponse<any>) => {
                if (response.status === 200) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transaction created successfully.' });
                    this.form.reset();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create transaction.' });
                }
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create transaction.' });
            }
        });
    }
}
