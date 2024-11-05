import { createStore } from "vuex";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface State {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
}

export default createStore<State>({
  state: {
    user: null,
    isLoggedIn: false,
    token: localStorage.getItem("token"),
  },

  mutations: {
    setUser(state, user: User | null) {
      state.user = user;
      state.isLoggedIn = !!user;
    },
    setToken(state, token: string | null) {
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
  },

  actions: {
    logout({ commit }) {
      commit("setToken", null);
      commit("setUser", null);
    },
  },
});
