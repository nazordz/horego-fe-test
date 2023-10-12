import { User } from "@/models";
import { createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface AuthenticationSliceState {
  token: string;
  // id: string;
  // name: string;
  // phone: string;
  // email: string;
  // role: string;
  // created_at: string;
  // updated_at: string;
  user: User|null;
}

const initialState: AuthenticationSliceState = {
  token: '',
  user: null,
  // id: '',
  // name: '',
  // phone: '',
  // email: '',
  // role: '',
  // created_at: '',
  // updated_at: '',
}

export const authenticationSlice = createSlice({
  name: 'authenticationSlice',
  initialState,
  reducers: {
    setAuthenticationData(state, action: PayloadAction<AuthenticationSliceState>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.token = '';
      state.user = null;
    }
  }
})

export const { setAuthenticationData, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;