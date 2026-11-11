import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppConfigurator } from '@/app/layout/components/app.configurator';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '@/app/layout/service/layout.service';
import { RippleModule } from 'primeng/ripple';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-verification',
    imports: [ButtonModule, RouterModule, AppConfigurator, FormsModule, InputNumberModule, RippleModule],
    standalone: true,
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss'
})
export class Verification {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    focusOnNext(inputEl: InputNumber) {
        inputEl.input.nativeElement.focus();
    }
}
