<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-3xl font-bold text-center">Create Account</h2>

      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

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
            minlength="6"
            class="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            required
            minlength="6"
            class="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isLoading ? "Creating Account..." : "Register" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { authAPI } from "@/services/api";

const router = useRouter();
const { setToken, setUser } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long";
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = "";

    const response = await authAPI.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    setToken(response.data.token);
    setUser(response.data.user);

    router.push("/stories");
  } catch (error: any) {
    const errors = error.response?.data?.errors;
    errorMessage.value = Array.isArray(errors) ? errors.join("\n") : "Registration failed. Please try again.";
    console.error("Registration failed:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
