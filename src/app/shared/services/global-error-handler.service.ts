import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService, SourceOfLog } from './logger.service';


/**
 * Zoneless-friendly global error handler.
 * Catches every uncaught exception (template errors, lifecycle hook errors,
 * unhandled promise rejections) and forwards them to the LoggerService.
 *
 * We use Injector lazily because ErrorHandler is instantiated very early,
 * before most of the DI tree is ready.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const logger = this.injector.get(LoggerService);
        const original = error?.rejection ?? error?.originalError ?? error;

        let message: string;
        let stack: string | undefined;

        if (original instanceof HttpErrorResponse) {
            message = `HTTP ${original.status} ${original.statusText} - ${original.url}`;
        } else if (original instanceof Error) {
            message = original.message;
            stack = original.stack ?? ' ';
           
        } else {
            message = typeof original === 'string' ? original : JSON.stringify(original);
        }

        logger.error(message, SourceOfLog.Frontend, stack);

        // Keep the default console.error behaviour so devs still see the red stack.
        // eslint-disable-next-line no-console
        console.error(original);
    }
}