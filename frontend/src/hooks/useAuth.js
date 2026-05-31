import useAuthStore from '../store/authStore';
const useAuth = () => { const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore(); return { user, token, isAuthenticated, login, logout, updateUser }; };
export default useAuth;