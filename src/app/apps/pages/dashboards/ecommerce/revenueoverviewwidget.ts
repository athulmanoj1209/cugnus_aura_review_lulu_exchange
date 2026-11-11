import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';

interface Week {
    label: string;
    value: number;
    data: number[][];
}

@Component({
    standalone: true,
    selector: 'app-revenue-overview-widget',
    imports: [SelectModule, ChartModule, FormsModule],
    template: ` <div class="card h-full">
        <div class="flex items-start justify-between mb-12">
            <span class="text-surface-900 dark:text-surface-0 text-xl font-semibold">{{ revenueOverview }}</span>
            <p-select [options]="weeks" [(ngModel)]="selectedWeek" class="w-40" optionLabel="label" (onChange)="onWeekChange()"></p-select>
        </div>
        <p-chart type="bar" height="300" [data]="barData()" [options]="barOptions()"></p-chart>
    </div>`
})
export class RevenueOverViewWidget {
    layoutService: LayoutService = inject(LayoutService);
    revenueOverview = $localize`Revenue Overview`;

    weeks: Week[] = [
        {
            label: 'Last Week',
            value: 0,
            data: [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90]
            ]
        },
        {
            label: 'This Week',
            value: 1,
            data: [
                [35, 19, 40, 61, 16, 55, 30],
                [48, 78, 10, 29, 76, 77, 10]
            ]
        }
    ];

    selectedWeek: Week = this.weeks[0];

    barData = signal<any>(null);

    barOptions = signal<any>(null);

    chartEffect = effect(() => {
        this.layoutService.layoutConfig().darkTheme;
        setTimeout(() => this.initChart(), 150);
    });

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData.set({
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [
                {
                    label: 'Revenue',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: this.selectedWeek?.data[0]
                },
                {
                    label: 'Profit',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: this.selectedWeek?.data[1]
                }
            ]
        });

        this.barOptions.set({
            animation: {
                duration: 0
            },
            responsive: false,
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
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        });
    }

    onWeekChange() {
        this.initChart();
    }
}
