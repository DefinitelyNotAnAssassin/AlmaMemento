import { ref } from 'vue';

const isAuthenticated = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('authToken');
  isAuthenticated.value = !!token;
};

export function useAuth() {
  return {
    isAuthenticated,
    checkAuth
  };
}
