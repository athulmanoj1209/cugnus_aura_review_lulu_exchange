import { Component, ElementRef, HostListener, inject, Signal, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { selectAccessToken } from '@/app/state/auth/auth.selector';
import { selectUserEmail } from '@/app/state/user/user.selector';
import { Store } from '@ngrx/store';
import { Localstorage } from '@/app/shared/services/localstorage.service';

@Component({
  selector: '[app-topbar]',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppBreadcrumb,
    ButtonModule,
    TooltipModule,
  ],
  styles: [`
    .topbar-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 1.5rem;
      background: var(--menu-bg);
      border-bottom: var(--sidebar-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    /* ── Left ── */
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .topbar-menu-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: var(--menuitem-text-color);
      cursor: pointer;
      transition: background 0.15s;
      font-size: 1.1rem;

      &:hover { background: var(--menuitem-hover-bg-color); }
    }

    .topbar-greeting {
      display: flex;
      flex-direction: column;
      line-height: 1.2;

      &__label {
        font-size: 0.7rem;
        color: var(--menuitem-text-color);
        opacity: 0.7;
        font-weight: 500;
      }

      &__name {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--menuitem-text-color);
      }
    }

    /* ── Right ── */
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .topbar-icon-btn {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 50%;
      color: var(--menuitem-text-color);
      cursor: pointer;
      font-size: 1.05rem;
      transition: background 0.15s, color 0.15s;
      position: relative;

      &:hover {
        background: var(--menuitem-hover-bg-color);
      }
    }

    .topbar-divider {
      width: 1px;
      height: 24px;
      background: var(--menuitem-hover-bg-color);
      margin: 0 0.25rem;
    }

    .topbar-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #1e3a8a;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      flex-shrink: 0;
      transition: opacity 0.15s;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      &:hover { opacity: 0.88; }
    }
  `],
  template: `
    <div class="topbar-wrap">

      <!-- ── Left: hamburger + greeting ── -->
      <div class="topbar-left">
        <button #menubutton
                type="button"
                class="topbar-menu-btn"
                (click)="onMenuButtonClick()"
                aria-label="Toggle menu">
          <i class="pi pi-bars"></i>
        </button>

        <div class="topbar-greeting">
          <span class="topbar-greeting__label">Welcome,</span>
          <span class="topbar-greeting__name">{{ displayName }}</span>
        </div>
      </div>

      <!-- ── Right: action icons + avatar ── -->
      <div class="topbar-right">

        <button type="button"
                class="topbar-icon-btn"
                (click)="toggleDarkMode()"
                [pTooltip]="layoutService.isDarkTheme() ? 'Light Mode' : 'Dark Mode'" tooltipPosition="bottom"
                aria-label="Toggle dark mode">
          <i class="pi" [ngClass]="layoutService.isDarkTheme() ? 'pi-sun' : 'pi-moon'"></i>
        </button>

        <button type="button"
                class="topbar-icon-btn"
                (click)="toggleFullscreen()"
                pTooltip="Fullscreen" tooltipPosition="bottom"
                aria-label="Toggle fullscreen">
          <i class="pi" [ngClass]="isFullscreen ? 'pi-compress' : 'pi-expand'"></i>
        </button>

        <button type="button"
                class="topbar-icon-btn"
                pTooltip="Messages" tooltipPosition="bottom"
                aria-label="Messages">
          <i class="pi pi-comment"></i>
        </button>

        <!-- <button type="button"
                class="topbar-icon-btn"
                pTooltip="Calls" tooltipPosition="bottom"
                aria-label="Calls">
          <i class="pi pi-phone"></i>
        </button> -->

        <button type="button"
                class="topbar-icon-btn"
                (click)="onConfigButtonClick()"
                pTooltip="Settings" tooltipPosition="bottom"
                aria-label="Settings">
          <i class="pi pi-cog"></i>
        </button>

        <div class="topbar-divider"></div>

        <ng-container *ngIf="accessToken(); else loginBtn">
          <button type="button"
                  class="topbar-avatar"
                  (click)="onProfileButtonClick()"
                  pTooltip="Profile" tooltipPosition="bottom"
                  aria-label="Profile">
            <img *ngIf="avatarUrl; else initials" [src]="avatarUrl" alt="Profile" />
            <ng-template #initials>{{ userInitials }}</ng-template>
          </button>
        </ng-container>

        <ng-template #loginBtn>
          <button type="button"
                  class="topbar-icon-btn"
                  (click)="onLoginButtonClick()"
                  pTooltip="Login" tooltipPosition="bottom"
                  aria-label="Login">
            <i class="pi pi-sign-in"></i>
          </button>
        </ng-template>

      </div>
    </div>
  `,
})
export class AppTopbar {
  @ViewChild('menubutton') menuButton!: ElementRef;

  layoutService = inject(LayoutService);
  router        = inject(Router);

  authStore     = inject(Store);
  localStorage  = inject(Localstorage);

  accessToken:  Signal<string | null> = this.authStore.selectSignal(selectAccessToken);
  userEmail:    Signal<string | null> = this.authStore.selectSignal(selectUserEmail);

  isFullscreen = false;

  /** Display name: email prefix, then 'User'. */
  get displayName(): string {
    const email = this.userEmail();
    if (email) return email.split('@')[0];
    //const email = this.authState()?.email;
    //if (email) return email.split('@')[0];
    return 'User';
  }

  get userInitials(): string {
    return this.displayName
      .split(/[\s_]+/)
      .map((p: string) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  /** UserState has no avatar field yet, so the template always falls back to initials. */
  get avatarUrl(): string | null {
    return null;
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onLoginButtonClick()   { this.router.navigate(['/auth/login']); }
  onMenuButtonClick()    { this.layoutService.toggleMenu(); }
  onProfileButtonClick() { this.layoutService.toggleProfileSidebar(); }
  onConfigButtonClick()  { this.layoutService.toggleConfigSidebar(); }

  toggleDarkMode(): void {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}