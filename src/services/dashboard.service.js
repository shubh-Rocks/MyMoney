import { dashboardRepository } from "@/repositories/dashboard.repository";

class DasboardService {
  async dashboardDetails(userId) {
    const totalLentamount =
      await dashboardRepository.getTotalLentAmount(userId);
    const totalPendingAmount =
      await dashboardRepository.getTotalPendingAmount(userId);
    const todayDueamount = await dashboardRepository.getTodayDueAmount(userId);
    const overdueamount = await dashboardRepository.getOverdueAmount(userId);

    const activeBorrowers =
      await dashboardRepository.getActiveBorrowersCount(userId);
    const todayborrowers =
      await dashboardRepository.getTodayDueBorrowerscount(userId);
    const overdueBorrowers =
      await dashboardRepository.getOverdueBorrowers(userId);
    return {
      totalLentamount,
      totalPendingAmount,
      todayDueamount,
      overdueamount,
      activeBorrowers,
      todayborrowers,
      overdueBorrowers,
    };
  }
}

export const dashboardService = new DasboardService();
