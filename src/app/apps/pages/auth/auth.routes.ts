import { Routes } from '@angular/router';
import { Access } from './access/access.component';
import { Login } from './login/login.component';
import { Error } from './error/error.component';
import { Register } from './register/register.component';
import { ForgotPassword } from './forgot-password/forgot-password.component';

import { Verification } from './verification/verification.component';
import { LockScreen } from './lockscreen/lockscreen.component';
import { SessionConflictError } from './session-conflict-error/session-conflict-error.component';

import { ResetPasswordPageComponent } from '../../poc/Auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../../poc/Auth/forgot-password/forgot-password.component';
import { NewPassword } from './reset-password/reset-password.component';


export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'forgotpassword', component: ForgotPassword },
    
    { path: 'resetpassword', component: NewPassword },
    { path: 'verification', component: Verification },
    { path: 'lockscreen', component: LockScreen },
    { path: 'session-conflict', component: SessionConflictError },
    { path: 'reset-password', component: ResetPasswordPageComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
] as Routes;
