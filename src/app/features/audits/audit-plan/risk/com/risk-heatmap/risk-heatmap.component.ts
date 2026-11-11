import {
  Component, Input, Output, EventEmitter, OnChanges, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Risk, ResidualLevel, calcResidualLevel } from '../../models/risk.model';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  RiskExportFormats,
  RiskResidualLevels,
  type RiskExportFormat,
  RISK_HEATMAP_PNG_FILE_NAME,
  RISK_ID_PREFIX,
  RISK_LEVEL_THRESHOLDS,
  RISK_MAX_SCORE,
  RISK_SCALE_VALUES,
} from '../../constants/risk.constants';
import {
  RISK_HEATMAP_CANVAS_COLORS,
  RISK_IMPACT_LABELS,
  RISK_LIKELIHOOD_LABELS,
} from '../../constants/risk-labels.constants';
import {
  RISK_HEATMAP_MESSAGES,
  heatCellTooltip,
  risksPlottedLabel,
} from '../../constants/risk-messages.constants';

interface HeatCell {
  impact:     number; // row (1–5, displayed bottom→top)
  likelihood: number; // col (1–5, displayed left→right)
  score:      number;
  level:      ResidualLevel;
  risks:      Risk[];
}

@Component({
  selector: 'app-risk-heatmap',
  standalone: true,
  imports: [CommonModule, TooltipModule, DrawIconComponent],
  templateUrl: './risk-heatmap.component.html',
  styleUrl: './risk-heatmap.component.scss',
})
export class RiskHeatmapComponent implements OnChanges {
  @Input()  risks: Risk[] = [];
  @Output() riskClicked = new EventEmitter<Risk>();

  readonly exporting = signal<RiskExportFormat | null>(null);

  /** 5×5 grid: rows = impact 5→1 (top to bottom), cols = likelihood 1→5 */
  cells: HeatCell[][] = [];

  /** Impact levels for Y axis label (displayed top→bottom = 5→1) */
  readonly yLabels = [...RISK_SCALE_VALUES].reverse();
  readonly xLabels = RISK_SCALE_VALUES;

  readonly impactLabels: Record<number, string> = RISK_IMPACT_LABELS;
  readonly likelihoodLabels: Record<number, string> = RISK_LIKELIHOOD_LABELS;

  // Exposed for the template.
  readonly RiskExportFormats  = RiskExportFormats;
  readonly RiskResidualLevels = RiskResidualLevels;
  readonly levelThresholds    = RISK_LEVEL_THRESHOLDS;
  readonly maxScore           = RISK_MAX_SCORE;
  readonly exportingLabel     = RISK_HEATMAP_MESSAGES.Exporting;
  readonly risksPlottedLabel  = risksPlottedLabel;

  ngOnChanges(): void {
    this.buildGrid();
  }

  private cellLevel(score: number): ResidualLevel {
    return calcResidualLevel(score);
  }

  private buildGrid(): void {
    // Build map of (impact, likelihood) → risks
    const riskMap = new Map<string, Risk[]>();
    for (const r of this.risks) {
      const key = `${r.impact}-${r.likelihood}`;
      if (!riskMap.has(key)) riskMap.set(key, []);
      riskMap.get(key)!.push(r);
    }

    // Build 5 rows (impact 5→1) × 5 cols (likelihood 1→5)
    this.cells = this.yLabels.map(impact =>
      this.xLabels.map(likelihood => {
        const score = impact * likelihood;
        return {
          impact,
          likelihood,
          score,
          level: this.cellLevel(score),
          risks: riskMap.get(`${impact}-${likelihood}`) ?? [],
        };
      }),
    );
  }

  /** Tooltip for a cell */
  cellTooltip(cell: HeatCell): string {
    const base = heatCellTooltip(cell.impact, cell.likelihood, cell.score);
    if (!cell.risks.length) return base;
    return `${base}\n${cell.risks.map(r => r.id + ': ' + r.title).join('\n')}`;
  }

  /** Risk id without the RSK- prefix, shown inside a heat-map dot. */
  shortId(r: Risk): string {
    return r.id.replace(RISK_ID_PREFIX, '');
  }

  onRiskClick(r: Risk, event: Event): void {
    event.stopPropagation();
    this.riskClicked.emit(r);
  }

  countLevel(level: ResidualLevel): number {
    return this.risks.filter(r => r.residualLevel === level).length;
  }

  /* ── Export — no external libraries required ───────────────────── */

  exportPNG(): void {
    if (this.exporting()) return;
    this.exporting.set(RiskExportFormats.Png);
    try {
      const canvas = this.drawToCanvas();
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        this.triggerDownload(url, RISK_HEATMAP_PNG_FILE_NAME);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 'image/png');
    } finally {
      this.exporting.set(null);
    }
  }

  exportPDF(): void {
    if (this.exporting()) return;
    this.exporting.set(RiskExportFormats.Pdf);

    try {
      const canvas  = this.drawToCanvas();
      const imgData = canvas.toDataURL('image/png');
      const date    = new Date().toLocaleDateString();
      const count   = this.risks.length;

      /* Open a new tab — onload on the <img> guarantees the image is
         rendered before print() is called, avoiding blank PDFs.      */
      const win = window.open('', '_blank');
      if (!win) {
        alert(RISK_HEATMAP_MESSAGES.PopupBlocked);
        this.exporting.set(null);
        return;
      }

      win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${RISK_HEATMAP_MESSAGES.ExportTitle}</title>
  <style>
    @page  { size: A4 landscape; margin: 12mm; }
    *      { box-sizing: border-box; }
    body   { margin: 0; font-family: -apple-system, Arial, sans-serif; background: var(--surface-card); }
    .hdr   { margin-bottom: 8px; }
    h2     { margin: 0; font-size: 16pt; color: var(--text-color); }
    .meta  { margin: 3px 0 0; font-size: 9pt; color: var(--text-color-secondary); }
    .divider { border: none; border-top: 1px solid var(--surface-border); margin: 8px 0; }
    img    { width: 100%; height: auto; display: block; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="hdr">
    <h2>${RISK_HEATMAP_MESSAGES.ExportTitle}</h2>
    <p class="meta">Generated: ${date} &nbsp;&middot;&nbsp; ${risksPlottedLabel(count)}</p>
  </div>
  <hr class="divider"/>
  <img src="${imgData}"
       onload="window.focus(); window.print();"
       onerror="document.body.innerHTML='<p style=color:red>${RISK_HEATMAP_MESSAGES.ImageLoadFailed}</p>'"/>
</body>
</html>`);
      win.document.close();
    } finally {
      this.exporting.set(null);
    }
  }

  /* ── Canvas renderer ─────────────────────────────────────────────
   *  Draws the full heatmap to an off-screen canvas at 2× scale.
   *  No external libraries needed.
   * ──────────────────────────────────────────────────────────────── */
  private drawToCanvas(): HTMLCanvasElement {
    const S        = 2;            // retina scale
    const CELL     = 80  * S;
    const Y_AXIS_W = 120 * S;
    const X_AXIS_H = 48  * S;
    const PAD      = 16  * S;

    const W = PAD + Y_AXIS_W + 5 * CELL + PAD;
    const H = PAD + 5 * CELL + X_AXIS_H + PAD;

    const cv  = document.createElement('canvas');
    cv.width  = W;
    cv.height = H;
    const ctx = cv.getContext('2d')!;

    /* Background */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const CELL_COLORS  = RISK_HEATMAP_CANVAS_COLORS.Cell;
    const CELL_BORDERS = RISK_HEATMAP_CANVAS_COLORS.CellBorder;
    const DOT_COLORS   = RISK_HEATMAP_CANVAS_COLORS.Dot;

    const originX = PAD + Y_AXIS_W;
    const originY = PAD;

    /* ── Cells ── */
    this.cells.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const cx = originX + ci * CELL;
        const cy = originY + ri * CELL;
        const r  = 6 * S;

        /* Cell background */
        ctx.fillStyle   = CELL_COLORS[cell.level];
        ctx.strokeStyle = CELL_BORDERS[cell.level];
        ctx.lineWidth   = 1 * S;
        ctx.beginPath();
        this.roundRect(ctx, cx + 2, cy + 2, CELL - 4, CELL - 4, r);
        ctx.fill(); ctx.stroke();

        /* Score label */
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.font      = `${9 * S}px -apple-system,sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText(String(cell.score), cx + 6, cy + 14 * S);

        /* Risk dots */
        const n = cell.risks.length;
        cell.risks.forEach((risk, i) => {
          const spacing = Math.min(22 * S, (CELL - 20 * S) / Math.max(n, 1));
          const dotX = cx + CELL / 2 + (i - (n - 1) / 2) * spacing;
          const dotY = cy + CELL / 2;
          const dotR = 11 * S;

          ctx.beginPath();
          ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
          ctx.fillStyle = DOT_COLORS[risk.status] ?? RISK_HEATMAP_CANVAS_COLORS.DotFallback;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.8)';
          ctx.lineWidth   = 1.5 * S;
          ctx.stroke();

          ctx.fillStyle    = '#ffffff';
          ctx.font         = `bold ${7 * S}px -apple-system,sans-serif`;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.shortId(risk), dotX, dotY);
        });
        ctx.textBaseline = 'alphabetic';
      });
    });

    /* ── Y-axis (Impact) ── */
    this.yLabels.forEach((impact, i) => {
      const midY = originY + i * CELL + CELL / 2;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1e3a8a';
      ctx.font      = `bold ${10 * S}px -apple-system,sans-serif`;
      ctx.fillText(String(impact), originX - 8 * S, midY + 4);
      ctx.fillStyle = '#94a3b8';
      ctx.font      = `${8 * S}px -apple-system,sans-serif`;
      ctx.fillText(this.impactLabels[impact], originX - 8 * S, midY + 14 * S);
    });

    /* Y-axis title */
    ctx.save();
    ctx.translate(PAD + 10 * S, PAD + (5 * CELL) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748b';
    ctx.font      = `bold ${9 * S}px -apple-system,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Impact ↑', 0, 0);
    ctx.restore();

    /* ── X-axis (Likelihood) ── */
    this.xLabels.forEach((likelihood, i) => {
      const midX = originX + i * CELL + CELL / 2;
      const baseY = originY + 5 * CELL + 14 * S;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1e3a8a';
      ctx.font      = `bold ${10 * S}px -apple-system,sans-serif`;
      ctx.fillText(String(likelihood), midX, baseY);
      ctx.fillStyle = '#94a3b8';
      ctx.font      = `${8 * S}px -apple-system,sans-serif`;
      ctx.fillText(this.likelihoodLabels[likelihood], midX, baseY + 13 * S);
    });

    /* X-axis title */
    ctx.fillStyle = '#64748b';
    ctx.font      = `bold ${9 * S}px -apple-system,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Likelihood →', originX + (5 * CELL) / 2, originY + 5 * CELL + X_AXIS_H - 2);

    return cv;
  }

  /** Polyfill for ctx.roundRect — not available in all TypeScript lib versions */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
  ): void {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x,     y + h - r, r);
    ctx.lineTo(x,     y + r);
    ctx.arcTo(x,     y,     x + r, y,         r);
    ctx.closePath();
  }

  private triggerDownload(url: string, filename: string): void {
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}