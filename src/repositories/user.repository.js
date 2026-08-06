import prisma from "@/lib/prisma";

class UserRepositry {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
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
          },
        },
      },
    });
  }
}

export const userRepository = new UserRepositry();
