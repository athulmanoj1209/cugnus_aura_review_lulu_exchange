import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@/app/environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AppConfigurator } from '@/app/layout/components/app.configurator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-new-password',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        ButtonModule,
        RouterModule,
        AppConfigurator,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        PasswordModule,
        RippleModule
    ],
    standalone: true,
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class NewPassword {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);

    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    resetPasswordForm: FormGroup = this.fb.group(
        {
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
        },
        {
            validators: [this.passwordMatchValidator()]
        }
    );

    passwordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password')?.value;
            const repeatPassword = control.get('repeatPassword')?.value;

            if (password && repeatPassword && password !== repeatPassword) {
                return { passwordMismatch: true };
            }

            return null;
        };
    }

    onSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        const payload = {
            email: this.resetPasswordForm.value.email,
            password: this.resetPasswordForm.value.password
        };

        this.http.put(`${environment.apiBaseUrl}/Audit/resetpassword-notauth`, payload, {
            observe: 'response'
        }).subscribe({
            next: (response: HttpResponse<any>) => {
                if (response.status === 200) {
                    this.router.navigate(['auth/login']);
                } else {
                    alert('Password not saved successfully');
                }
            },
            error: () => {
                alert('Password not saved successfully');
            }
        });
    }
}
