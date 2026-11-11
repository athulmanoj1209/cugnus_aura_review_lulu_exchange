import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducer";

// Key must match the one registered in provideStore() in app.config.ts
export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserId = createSelector(selectUserState, (state) => state.id);
export const selectUserUserName = createSelector(selectUserState, (state) => state.userName);
export const selectUserEmail = createSelector(selectUserState, (state) => state.email);
export const selectUserProfileRole = createSelector(selectUserState, (state) => state.profileRole);
export const selectUserBillingRole = createSelector(selectUserState, (state) => state.billingRole);
export const selectUserPrefferedLanguage = createSelector(selectUserState, (state) => state.prefferedLanguage);
export const selectUserTimeZone = createSelector(selectUserState, (state) => state.timeZone);
