import api from './index'

export const userAPI = {
  // Get current user profile by ID
  getUserById: (userId) => {
    return api.get(`/user/${userId}`)
  },

  // Update user profile by ID
  updateUserById: (userId, userData) => {
    return api.put(`/user/${userId}`, userData)
  },

  // Delete user by ID
  deleteUserById: (userId) => {
    return api.delete(`/user/${userId}`)
  }
}

export default userAPI
