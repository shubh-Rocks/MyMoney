import prisma from "@/lib/prisma";

class UserProfile {
  async findUserProfile(userId) {
    return await prisma.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async updateprofile(userId, updateData) {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        fullName: updateData.fullName || "",
        phone: updateData.phone || "",
        gender: updateData.gender || null,
        businessName: updateData.businessName || "Default Business", // <-- Yahan dena zaroori hai agar schema me required hai
        ...updateData,
      },
    });
  }
}

export const userProfile = new UserProfile();
