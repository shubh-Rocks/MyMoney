import { userProfile } from "@/repositories/user.profile.repository";

class ProfileUpdate {
  async getprofile(userId) {
    const getUserProfile = await userProfile.findUserProfile(userId);
    return getUserProfile;
  }

  async profileUpdate(userId, rawData) {
    const updateData = {};
    if (rawData.fullName) updateData.fullName = rawData.fullName;
    if (rawData.phone) updateData.phone = rawData.phone;
    if (rawData.gender) updateData.gender = rawData.gender;
    if (rawData.businessName) updateData.businessName = rawData.businessName;

    const updatedProfile = await userProfile.updateprofile(userId, updateData);

    return updatedProfile;
  }
}

export const profileUpdate = new ProfileUpdate();
