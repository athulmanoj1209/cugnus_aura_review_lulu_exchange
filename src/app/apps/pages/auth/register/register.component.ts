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
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        PasswordModule,
        InputTextModule,
        CheckboxModule,
        AppConfigurator,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        RippleModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class Register {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);

    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    registerForm: FormGroup = this.fb.group({
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmed: [false, Validators.requiredTrue]
    });

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const payload = {
            userName: this.registerForm.value.userName,
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
        };

        this.http.post(`${environment.apiBaseUrl}/Audit/auditor-register`, payload, {
            observe: 'response'
        }).subscribe({
            next: (response: HttpResponse<any>) => {
                if (response.status === 200) {
                    this.router.navigate(['auth/login']);
                } else {
                    alert('Auditor registration is unsuccessfull');
                    this.router.navigate(['/']);
                }
            },
            error: () => {
                alert('Auditor registration is unsuccessfull');
                this.router.navigate(['/']);
            }
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.registerForm.get(fieldName);
        return !!field && field.invalid && field.touched;
    }
}
