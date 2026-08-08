import { AppError } from "@/errors/app-error";
import { generateToken, hashPassword, verifyPassword } from "@/lib/auth";
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

  async register({ fullName, email, password, phone, businessName }) {
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError("Email Already exist ", 409, INVALID_CREDENTIALS);
    }

    if (phone) {
      const existingPhone = await userRepository.findByPhone(phone);
      if (existingPhone) {
        throw new AppError(
          "Phone number already registerd",
          409,
          INVALID_CREDENTIALS,
        );
      }
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.createWithProfile({
      fullName,
      email,
      passwordHash,

      profile: {
        fullName,
        phone,
        businessName,
      },
    });

    const token = await generateToken(user);
    return {
      user,
      token,
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("user not found", 404, "USER_NOT_FOUND");
    }

    return user;
  }
}

export const authService = new AuthService();
