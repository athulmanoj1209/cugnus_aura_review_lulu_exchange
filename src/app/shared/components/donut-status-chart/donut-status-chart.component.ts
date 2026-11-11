import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';

export interface DonutLegendItem {
  label: string;
  value: number;
  color: string;
}

/**
 * Donut chart with a center total and a clickable, toggleable legend —
 * matches the "Audit Status Distribution" chart model used across the app.
 */
@Component({
  selector: 'app-donut-status-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './donut-status-chart.component.html',
  styleUrl: './donut-status-chart.component.scss',
})
export class DonutStatusChartComponent implements OnChanges {

  @Input() legend: DonutLegendItem[] = [];
  @Input() centerLabel = 'Total';
  @Input() cutout = '62%';
  @Input() maxWidth = 260;
  /** Appended to the center total and each legend value, e.g. '%'. */
  @Input() valueSuffix = '';

  @ViewChild('chartRef') private chartRef?: UIChart;

  chartData: any;
  chartOptions: any;

  /** Tracks which segments the user has toggled off via the legend. */
  hidden: boolean[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['legend']) {
      this.hidden = this.legend.map(() => false);
      this.chartData = {
        labels: this.legend.map(item => item.label),
        datasets: [{
          data: this.legend.map(item => item.value),
          backgroundColor: this.legend.map(item => item.color),
          borderWidth: 0,
          borderRadius: 10,
          spacing: 6,
          hoverOffset: 4,
        }],
      };
    }

    // Always kept in sync (not gated on changes['cutout']) — cutout is rarely
    // bound from parent templates, so ngOnChanges would otherwise never fire
    // for it and chartOptions would stay undefined, letting Chart.js fall
    // back to its own default legend on top of our custom one below.
    this.chartOptions = {
      cutout: this.cutout,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  get visibleTotal(): number {
    return this.legend
      .filter((_, i) => !this.hidden[i])
      .reduce((sum, item) => sum + item.value, 0);
  }

  /** Toggles visibility of a donut segment when its legend entry is clicked. */
  toggleSegment(index: number): void {
    const chart = this.chartRef?.chart;
    if (!chart) return;
    chart.toggleDataVisibility(index);
    chart.update();
    this.hidden[index] = !this.hidden[index];
  }
}
