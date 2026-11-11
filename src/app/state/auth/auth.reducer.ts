import { createReducer, on } from "@ngrx/store";
import { clearCredentials, setCredentials, updateCredentials } from "./auth.action";
import { updateUserDetails } from "../user/user.action";


export interface AuthState {
    accessToken: string | null;
    sessionExpiration?: Date | null;
}

//create an initail state 
export const initialState: AuthState = {
    accessToken: null,
    sessionExpiration: null,
};

export const authReducer = createReducer(initialState,
    on(setCredentials, (state, { accessToken, sessionExpiration }) => ({ ...state, accessToken: accessToken, sessionExpiration: sessionExpiration })),
    on(clearCredentials, (state) => ({ ...state, accessToken: null, sessionExpiration: null })),
    on(updateCredentials, (state, { accessToken, sessionExpiration }) => ({
        ...state,
        ...(accessToken !== undefined && { accessToken }),
        ...(sessionExpiration !== undefined && { sessionExpiration })
    }))
);