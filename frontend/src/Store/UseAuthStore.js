import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registeredUser: null,

      registerUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((res) => setTimeout(res, 2000));

          const savedUser = {
            identifier: userData.whatsapp,
            fullName: userData.fullName,
            nik: userData.nik,
            whatsapp: userData.whatsapp,
            email: userData.email || null,
            password: userData.password, 
            invitationCode: userData.invitationCode,
            role: 'Administrator',
            registeredAt: new Date().toISOString(),
          };

          set({ registeredUser: savedUser, isLoading: false, error: null });
          return { success: true };
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.message || 'Registrasi gagal.';
          set({ error: errorMessage, isLoading: false });
          return { success: false, message: errorMessage };
        }
      },

      loginUser: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { registeredUser } = get();

          if (!registeredUser) {
            set({ isLoading: false });
            return {
              success: false,
              needsRegister: true,
              message: 'Anda belum memiliki akun. Silakan daftar terlebih dahulu.',
            };
          }

          await new Promise((res) => setTimeout(res, 1500));

          const identifierMatch =
            credentials.identifier === registeredUser.identifier ||
            credentials.identifier === registeredUser.whatsapp ||
            credentials.identifier === registeredUser.email;
          const passwordMatch = credentials.password === registeredUser.password;

          if (!identifierMatch || !passwordMatch) {
            const msg = 'Nomor WA/Email atau password salah.';
            set({ error: msg, isLoading: false });
            return { success: false, message: msg };
          }
          const loggedInUser = {
            fullName: registeredUser.fullName,
            identifier: registeredUser.identifier,
            whatsapp: registeredUser.whatsapp,
            email: registeredUser.email || null,
            nik: registeredUser.nik,           
            role: registeredUser.role || 'Administrator',
            registeredAt: registeredUser.registeredAt,
          };

          set({
            user: loggedInUser,
            token: `token_${Date.now()}`,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.message || 'Login gagal.';
          set({ error: errorMessage, isLoading: false });
          return { success: false, message: errorMessage };
        }
      },

      updateUser: (updatedFields) => {
        set((state) => ({
          user: { ...state.user, ...updatedFields },
          registeredUser: state.registeredUser
            ? { ...state.registeredUser, ...updatedFields }
            : state.registeredUser,
        }));
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'koopcare-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        registeredUser: state.registeredUser,
      }),
    }
  )
);

export default useAuthStore;