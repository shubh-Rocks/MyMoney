"use client";

import { apiClient } from "@/lib/api.Client";
import { loginSchema } from "@/validations/auth.validations";
import { useRouter } from "next/navigation";
import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData || null);
      } catch (error) {
        console.error("user not found", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const [loginState, loginAction, isLoginPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedfields = loginSchema.safeParse({ email, password });
      if (!validatedfields.success) {
        return {
          error: "form validation error",
          fieldErrors: validatedfields.error.flatten().fieldErrors,
        };
      }

      try {
        const data = await apiClient.login(email, password);
        setUser(data.user);
        router.push("/dashboard");
        return { success: true, user: data.user };
      } catch (error) {
        return { error: "Invalid Credentials. please try again" };
      }
    },
    { error: "", success: undefined, user: undefined },
  );

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("logout error:", error);
    }
  };

  const updateLocalUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        loginState,
        isLoginPending,
        isLoading,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new error("useAuth must be used within an AuthProvider");
  }
  return context;
};
