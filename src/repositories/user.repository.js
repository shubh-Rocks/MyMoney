import prisma from "@/lib/prisma";

class UserRepositry {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });
  }

  findById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,

        profile: {
          select: {
            fullName: true,
            phone: true,
            businessName: true,
            avatarUrl: true,
            gender: true,
            emailVerified: true,
          },
        },
      },
    });
  }

  findByPhone(phone) {
    return prisma.user.findFirst({
      where: {
        profile: {
          phone: phone,
        },
      },
    });
  }

  createWithProfile({ fullName, email, passwordHash, profile }) {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: profile,
        },
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            fullName: true,
            phone: true,
            businessName: true,
            emailVerified: true,
          },
        },
      },
    });
  }

  updateEmailVerified(userId) {
    return prisma.userProfile.update({
      where: {
        userId,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  upsertVerificationToken({ email, otp, expiresAt }) {
    return prisma.verificationToken.upsert({
      where: {
        email,
      },
      update: {
        otp,
        expiresAt,
      },
      create: {
        email,
        otp,
        expiresAt,
      },
    });
  }

  findVerificationToken(email) {
    return prisma.verificationToken.findUnique({
      where: {
        email,
      },
    });
  }

  deleteVerificationToken(email) {
    return prisma.verificationToken.deleteMany({
      where: {
        email,
      },
    });
  }
}

export const userRepository = new UserRepositry();
