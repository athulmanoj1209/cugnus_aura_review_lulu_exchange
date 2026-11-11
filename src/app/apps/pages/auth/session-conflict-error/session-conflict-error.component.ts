import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppConfigurator } from '@/app/layout/components/app.configurator';

@Component({
    selector: 'app-session-conflict',
    imports: [ButtonModule, RouterModule, AppConfigurator],
    standalone: true,
    templateUrl: './session-conflict-error.component.html',
    styleUrl: './session-conflict-error.component.scss'
})
export class SessionConflictError {}
