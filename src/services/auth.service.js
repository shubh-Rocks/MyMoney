import { AppError } from "@/errors/app-error";
import { generateToken, hashPassword, verifyPassword } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { sendEmail } from "@/services/email.service";
import { randomInt } from "crypto";

const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () => randomInt(100000, 1000000).toString();

const buildOtpEmail = (otp) => ({
  subject: "Verify your Lein Dein account",
  text: `Your Lein Dein verification code is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; color: #0E3B53;">
      <h2>Verify your email</h2>
      <p>Your Lein Dein verification code is:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
    </div>
  `,
});

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

    if (!user.profile?.emailVerified) {
      await this.sendOtp(email);
      throw new AppError(
        "Please verify your email before logging in. We sent a new OTP to your email.",
        403,
        "EMAIL_NOT_VERIFIED",
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
      if (!existingEmail.profile?.emailVerified) {
        await this.sendOtp(email);
        return {
          user: {
            id: existingEmail.id,
            email: existingEmail.email,
            profile: existingEmail.profile,
          },
        };
      }

      throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
    }

    if (phone) {
      const existingPhone = await userRepository.findByPhone(phone);
      if (existingPhone) {
        throw new AppError(
          "Phone number already registered",
          409,
          "PHONE_ALREADY_EXISTS",
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

    await this.sendOtp(email);

    return {
      user,
    };
  }

  async sendOtp(email) {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const emailContent = buildOtpEmail(otp);

    await userRepository.upsertVerificationToken({ email, otp, expiresAt });
    await sendEmail(
      email,
      emailContent.subject,
      emailContent.text,
      emailContent.html,
    );
  }

  async verifyOtp({ email, otp }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.profile?.emailVerified) {
      await userRepository.deleteVerificationToken(email);
      const token = await generateToken(user);
      return {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      };
    }

    const verificationToken = await userRepository.findVerificationToken(email);

    if (!verificationToken) {
      throw new AppError("OTP not found. Please request a new one.", 400, "OTP_NOT_FOUND");
    }

    if (verificationToken.expiresAt < new Date()) {
      await userRepository.deleteVerificationToken(email);
      throw new AppError("OTP expired. Please request a new one.", 400, "OTP_EXPIRED");
    }

    if (verificationToken.otp !== otp) {
      throw new AppError("Invalid OTP", 400, "INVALID_OTP");
    }

    await userRepository.updateEmailVerified(user.id);
    await userRepository.deleteVerificationToken(email);

    const token = await generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  async resendOtp({ email }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.profile?.emailVerified) {
      throw new AppError("Email is already verified", 400, "EMAIL_ALREADY_VERIFIED");
    }

    await this.sendOtp(email);

    return {
      message: "OTP resent to your email.",
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
