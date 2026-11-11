import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: '[app-footer]',
    standalone: true,
    imports: [CommonModule],
    styles: [`
        .footer-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 48px;
            padding: 0 1.5rem;
            // background: var(--menu-bg);
            border-top: 1px solid var(--surface-border);
            color: var(--menuitem-text-color);
            font-size: 0.8rem;
            position: sticky;
            bottom: 0;
            z-index: 100;
        }
    `],
    template: `
        <div class="footer-wrap">
            <span>&copy; {{ year }} All rights reserved.</span>
        </div>
    `
})
export class AppFooter {
    year = new Date().getFullYear();
}
