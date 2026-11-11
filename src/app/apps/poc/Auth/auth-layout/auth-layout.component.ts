import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

/** Shape of one carousel slide on the marketing panel. */
export interface AuthSlide {
  /** Big tagline. Use \n for line breaks. */
  tagline: string;
  /** Author / testimonial name. */
  authorName: string;
  /** Author title / company. */
  authorRole: string;
  /** Optional hero image URL. If set, replaces the decorative orbit pattern. */
  imageUrl?: string;
}

/* ============================================================
 *  Cygnus Audit — auth shell
 *
 *  Two-column layout that wraps any auth page (login, forgot,
 *  reset, register). Form goes into the projected content slot.
 *  Right column is a real carousel with prev/next + auto-advance.
 * ============================================================ */

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, DrawIconComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  /** Slides on the right-hand marketing card. Pass your own to override. */
  @Input() slides: AuthSlide[] = [
    {
      tagline: 'Simplify your\nAudit Process',
      authorName: 'Tasya and Xain',
      authorRole: 'Founder, Flo and Wer shop',
    },
    {
      tagline: 'Real-time\nCompliance Tracking',
      authorName: 'Aarav Mehta',
      authorRole: 'Head of Risk, Vega Capital',
    },
    {
      tagline: 'AI-powered\nWorking Papers',
      authorName: 'Lina Chen',
      authorRole: 'Audit Partner, Bridge & Co',
    },
    {
      tagline: 'One Source\nof Truth',
      authorName: 'Omar Khalid',
      authorRole: 'Compliance Lead, Aurora Bank',
    },
    {
      tagline: 'Engagements\nat a Glance',
      authorName: 'Priya Sharma',
      authorRole: 'Manager, KrishnaCorp',
    },
  ];

  /**
   * Auto-advance interval in ms. Set to 0 to disable auto-rotation.
   * Hovering the panel pauses the timer; mouseleave resumes it.
   */
  @Input() autoAdvanceMs = 6000;

  /** Current slide index (zero-based). */
  readonly index = signal(0);

  /** Convenience accessor for the active slide. */
  readonly current = computed<AuthSlide>(() => {
    const i = this.index();
    return this.slides[i] ?? this.slides[0];
  });

  private timerId: ReturnType<typeof setInterval> | null = null;
  private hovering = false;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  /* ---------------- Navigation ---------------- */

  next(): void {
    if (this.slides.length < 2) return;
    this.index.update(i => (i + 1) % this.slides.length);
    this.restartTimer();
  }

  prev(): void {
    if (this.slides.length < 2) return;
    this.index.update(i => (i - 1 + this.slides.length) % this.slides.length);
    this.restartTimer();
  }

  goTo(i: number): void {
    if (i < 0 || i >= this.slides.length) return;
    this.index.set(i);
    this.restartTimer();
  }

  /* ---------------- Pause-on-hover ---------------- */

  onHoverEnter(): void {
    this.hovering = true;
    this.stopTimer();
  }

  onHoverLeave(): void {
    this.hovering = false;
    this.startTimer();
  }

  /* ---------------- Timer internals ---------------- */

  private startTimer(): void {
    if (this.hovering) return;
    if (this.autoAdvanceMs <= 0) return;
    if (this.slides.length < 2) return;
    this.stopTimer();
    this.timerId = setInterval(() => this.next(), this.autoAdvanceMs);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private restartTimer(): void {
    this.stopTimer();
    this.startTimer();
  }
}