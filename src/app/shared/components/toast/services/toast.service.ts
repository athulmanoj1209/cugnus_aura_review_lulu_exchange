import { Toast, ToastType } from '@/app/shared/components/toast/models/toast.model';
import { Injectable, signal } from '@angular/core';



@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'info', title?: string, duration = 4000): void {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      duration,
    };

    this._toasts.update((list) => [...list, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  success(message: string, title = 'Success', duration?: number): void {
    this.show(message, 'success', title, duration);
  }

  error(message: string, title = 'Error', duration = 6000): void {
    this.show(message, 'error', title, duration);
  }

  warning(message: string, title = 'Warning', duration?: number): void {
    this.show(message, 'warning', title, duration);
  }

  info(message: string, title = 'Info', duration?: number): void {
    this.show(message, 'info', title, duration);
  }

  dismiss(id: string): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}