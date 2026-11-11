import { createReducer, on } from "@ngrx/store";
import { clearUserDetails, setUserDetails, updateUserDetails } from "./user.action";

export enum PrefferedLanguages {
    EnglishUS = 'en-US',
    SpanishPR = 'es-PR',
    GermanDefault = 'de-DE',
    frenchDefault = 'fr-FR',
    arabicSA = 'ar-SA'
}

export enum LanguagesRoutes {
    EnglishUSRoute = '/translation-demo/',
    SpanishPRRoute = '/translation-demo/es-PR/',
    GermanDefaultRoute = '/translation-demo/de-DE/',
    FrenchDefaultRoute = '/translation-demo/fr-FR/',
    ArabicSARoute = '/translation-demo/ar-SA/',
}

export interface UserState {
    id: number | null;
    userName: string | null;
    email: string | null;
    profileRole?: string;
    billingRole?: string;
    prefferedLanguage?: PrefferedLanguages;
    timeZone?: string;
}

export const initialUserState: UserState = {
    id: null,
    userName: null,
    email: null,
    profileRole: undefined,
    billingRole: undefined,
    prefferedLanguage: undefined,
    timeZone: undefined
};

export const userReducer = createReducer(
    initialUserState,
    on(setUserDetails, (state, { id, userName, email, profileRole, billingRole, prefferedLanguage, timeZone } : UserState ) => ({
        ...state,
        id,
        userName,
        email,
        profileRole,
        billingRole,
        prefferedLanguage,
        timeZone
    })),
    on(updateUserDetails, (state, { id, userName, email, profileRole, billingRole, prefferedLanguage, timeZone }) => ({
        ...state,
        ...(id !== undefined && { id }),
        ...(userName !== undefined && { userName }),
        ...(email !== undefined && { email }),
        ...(profileRole !== undefined && { profileRole }),
        ...(billingRole !== undefined && { billingRole }),
        ...(prefferedLanguage !== undefined && { prefferedLanguage }),
        ...(timeZone !== undefined && { timeZone })
    })),
    on(clearUserDetails, () => ({ ...initialUserState }))
);
