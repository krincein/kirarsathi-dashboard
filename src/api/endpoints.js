export const endpoints = {
  auth: {
    loginUser: '/auth/login',
    signupUser: '/auth/signup',
  },
  main: {
    getProfileById: '/user/get-profile/',
    getMyProfile: '/user/my-profile',
  },
  admin: {
    getUsers: '/admin/get-all-users',
    updateUserStatus: '/admin/update-status/',
    updateUserRole: '/admin/update-role/',
    getUserCount: '/admin/get-user-count'
  },
};
