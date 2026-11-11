import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

// Key must match the one registered in provideStore() in app.config.ts
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);
export const selectSessionExpiration = createSelector(selectAuthState, (state) => state.sessionExpiration);
export const selectIsAuthenticated = createSelector(selectAccessToken, (accessToken) => !!accessToken);
