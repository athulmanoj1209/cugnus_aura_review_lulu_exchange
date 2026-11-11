import { LayoutService } from '@/app/layout/service/layout.service';
import { Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
    standalone: true,
    selector: 'app-sales-by-category-widget',
    imports: [ChartModule],
    template: ` <div class="card h-full">
        <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-12">{{ salesByCategory }}</div>
        <p-chart type="pie" [data]="pieData()" height="300" [options]="pieOptions()"></p-chart>
    </div>`
})
export class SalesByCategoryWidget {
    layoutService: LayoutService = inject(LayoutService);

    salesByCategory = $localize`Sales by Category`;

    pieData = signal<any>(null);
    pieOptions = signal<any>(null);

    chartEffect = effect(() => {
        this.layoutService.layoutConfig().darkTheme;
        setTimeout(() => this.initChart(), 150);
    });

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieData.set({
            labels: ['Electronics', 'Fashion', 'Household'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--p-primary-700'), documentStyle.getPropertyValue('--p-primary-400'), documentStyle.getPropertyValue('--p-primary-100')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-primary-600'), documentStyle.getPropertyValue('--p-primary-300'), documentStyle.getPropertyValue('--p-primary-200')]
                }
            ]
        });

        this.pieOptions.set({
            animation: {
                duration: 0
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700
                        },
                        padding: 28
                    },
                    position: 'bottom'
                }
            }
        });
    }
}
