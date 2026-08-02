import { AppError } from "@/errors/app-error";
import { generateToken, verifyPassword } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";

class AuthService {
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        "invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError(
        "invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const token = await generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }
}

export const authService = new AuthService();
