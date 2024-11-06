import api from "./api";

export const auth = {
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post("/sessions", { email, password });
      this.setToken(response.data.token);
      return response.data.user;
    } catch (error) {
      this.setToken(null);
      throw error;
    }
  },

  async register(userData: { email: string; password: string; name: string }) {
    try {
      const response = await api.post("/users", { user: userData });
      this.setToken(response.data.token);
      return response.data.user;
    } catch (error) {
      this.setToken(null);
      throw error;
    }
  },

  logout(): void {
    this.setToken(null);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};