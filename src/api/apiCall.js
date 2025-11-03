import { instance } from './axios';
import { endpoints } from './endpoints';

export const auth = {
  login: (body) => {
    return instance.post(endpoints.auth.loginUser, body);
  },
  signup: (body) => {
    return instance.post(endpoints.auth.signupUser, body);
  },
};

export const main = {
  getProfileById: (id) => {
    return instance.get(endpoints.main.getProfileById + id);
  },
  getMyProfile: () => {
    return instance.get(endpoints.main.getMyProfile);
  },
};

export const admin = {
  getUsers: () => {
    return instance.get(endpoints.admin.getUsers);
  },
  updateUserStatus: (id, body) => {
    return instance.put(endpoints.admin.updateUserStatus + id, body);
  },
  updateUserRole: (id, body) => {
    return instance.put(endpoints.admin.updateUserRole + id, body);
  },
  getUserCount: () => {
    return instance.get(endpoints.admin.getUserCount);
  },
};