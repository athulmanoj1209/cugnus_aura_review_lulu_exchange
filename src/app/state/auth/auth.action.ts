
import { createAction, props } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const setCredentials = createAction('[Auth Component] setCredential', props<AuthState>());

export const clearCredentials = createAction('[Auth Component] clearCredential');

export const updateCredentials = createAction('[Auth Component] updateCredential', props<Partial<AuthState>>());