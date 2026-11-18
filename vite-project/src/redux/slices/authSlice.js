import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: "",
    accessToken: localStorage.getItem("access_token") || "",
    refreshToken: "",
    isAuthenticated: localStorage.getItem("isAuthentication") === "true",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    }
  }
})

export const { setUser, setAccessToken, setRefreshToken, setIsAuthenticated } = authSlice.actions

export default authSlice.reducer;