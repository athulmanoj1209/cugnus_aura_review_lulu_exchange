import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppConfigurator } from '@/app/layout/components/app.configurator';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/app/layout/service/layout.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-lockscreen',
    imports: [ButtonModule, RouterModule, AppConfigurator, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
    standalone: true,
    templateUrl: './lockscreen.component.html',
    styleUrl: './lockscreen.component.scss'
})
export class LockScreen {
    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());
}
