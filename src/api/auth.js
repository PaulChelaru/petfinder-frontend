import api from './index'

export const authApi = {
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },
  
  register: (userData) => {
    return api.post('/auth/register', userData)
  },
  
  logout: () => {
    return api.post('/auth/logout')
  },
  
  refreshToken: () => {
    return api.post('/auth/refresh')
  }
}
