import { LoginResponse, User } from "@/models"
import { store } from "@/store";
import { setAuthenticationData, logout } from "@/store/slices/authenticationSlice";
import http from "@/utils/http"

async function signIn(email: string, password: string): Promise<User|null> {
  try {
    const req = await http.post<LoginResponse>('/login', {
      email, password
    })
    store.dispatch(setAuthenticationData({
      token: req.data.token,
      user: req.data.user
    }))
    return req.data.user;
    
  } catch (error) {
    console.log(error);
    return null;
  }
}

function signOut() {
  try {
    http.post('/logout')
    store.dispatch(logout());
    return true;
  } catch (error) {
    return false;
  }
}

export {
  signIn, signOut
}