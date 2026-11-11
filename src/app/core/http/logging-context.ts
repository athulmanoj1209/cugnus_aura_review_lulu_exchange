// logging-context.ts
import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface CallerInfo {
    method?: string;   // e.g. 'saveInvoice'
    page?: string;     // optional override (e.g. 'InvoiceEditPage')
}

export const CALLER_INFO = new HttpContextToken<CallerInfo>(() => ({}));

export function withCaller(info: CallerInfo, ctx = new HttpContext()) {
    return ctx.set(CALLER_INFO, info);
}