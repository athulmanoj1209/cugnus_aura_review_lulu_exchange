import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileDownloadService {

  /**
   * Download a file by URL (path or full URL) or from an in-memory File object.
   * Strategy:
   *  1. File object  → createObjectURL → anchor click
   *  2. URL/path     → fetch as blob   → anchor click   (forces Save dialog)
   *  3. fetch fails  → window.open fallback             (opens in new tab)
   */
  download(source: string | File, filename: string): void {
    if (source instanceof File) {
      const url = URL.createObjectURL(source);
      this.anchorClick(url, filename);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return;
    }

    // Fetch as blob — works for same-origin and CORS-enabled URLs
    fetch(source, { credentials: 'same-origin' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        this.anchorClick(url, filename);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      })
      .catch(() => {
        // Fallback: open in a new browser tab
        window.open(source as string, '_blank', 'noopener');
      });
  }

  private anchorClick(href: string, filename: string): void {
    const a    = document.createElement('a');
    a.href     = href;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    // Small delay before removal so the click registers
    setTimeout(() => document.body.removeChild(a), 200);
  }
}