import { createAction, props } from "@ngrx/store";
import { UserState, PrefferedLanguages } from "./user.reducer";

export interface UserDetails {
    id: number;
    userName: string;
    email: string;
    profileRole?: string;
    billingRole?: string;
    prefferedLanguage?: PrefferedLanguages;
    timezone?: string;
}

export const setUserDetails = createAction(
    '[User] setUserDetails',
    props<UserState>()
);

export const updateUserDetails = createAction(
    '[User] updateUserDetails',
    props<Partial<UserState>>()
);

export const clearUserDetails = createAction('[User] clearUserDetails');
