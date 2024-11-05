import api from "./api";
import type { User } from "@/types";

export const auth = {
  token: localStorage.getItem("token"),

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  async login(email: string, password: string) {
    const response = await api.post("/sessions", { email, password });
    this.setToken(response.data.token);
    return response.data.user;
  },

  async register(userData: { email: string; password: string; name: string }) {
    const response = await api.post("/users", { user: userData });
    this.setToken(response.data.token);
    return response.data.user;
  },

  logout() {
    this.setToken(null);
  },

  isAuthenticated() {
    return !!this.token;
  },
};
