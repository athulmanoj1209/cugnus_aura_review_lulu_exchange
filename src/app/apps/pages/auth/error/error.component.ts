import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppConfigurator } from '@/app/layout/components/app.configurator';

@Component({
    selector: 'app-error',
    imports: [ButtonModule, RouterModule, AppConfigurator],
    standalone: true,
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class Error {}
