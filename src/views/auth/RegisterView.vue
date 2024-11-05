<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-3xl font-bold text-center">Create Account</h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { authAPI } from "@/services/api";

const router = useRouter();
const store = useStore();
const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");

const handleSubmit = async () => {
  if (password.value !== passwordConfirmation.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await authAPI.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    store.commit("setToken", response.data.token);
    store.commit("setUser", response.data.user);
    router.push("/stories");
  } catch (error: any) {
    alert(error.response?.data?.errors?.join("\n") || "Registration failed");
  }
};
</script>
