import { cashFlowRepository } from "@/repositories/cash.flow.repository";
import { groqService } from "./groq.service";

class CashFlowService {
  async getForecastDataset(userId, days = 30) {
    const today = new Date();
    const historyStartDate = new Date(today);
    historyStartDate.setDate(today.getDate() - 90);

    const forcastingEndDate = new Date(today);
    forcastingEndDate.setDate(today.getDate() + days);

    const [dailyColloection, upcomingDueLoans] = await Promise.all([
      cashFlowRepository.getDailyCollections(userId, historyStartDate, today),

      cashFlowRepository.getUpcomingDueLoans(userId, today, forcastingEndDate),
    ]);

    const totalHistoricalCollection = dailyColloection.reduce(
      (sum, item) => sum + item.sum,
      0,
    );

    const collectionDays = dailyColloection.length;

    const averageDailyCollection =
      collectionDays > 0 ? totalHistoricalCollection / collectionDays : 0;

    const upcommingDueAmount = upcomingDueLoans.reduce(
      (sum, loan) => sum + loan.remainingAmount,
      0,
    );

    return {
      forcastDays: days,
      historical: {
        periodDays: 90,
        totalCollection: totalHistoricalCollection,
        collectionDays,
        averageDailyCollection,
        dailyColloection,
      },

      upcoming: {
        totalDueAmount: upcomingDueLoans,
        loanCount: upcomingDueLoans.length,
        loans: upcomingDueLoans,
      },
    };
  }

  async generateForcast(userId, days = 30) {
    const forecastData = await this.getForecastDataset(userId, days);

    const result = await groqService.forecastCashFlow(forecastData, days);

    return {
      forecastDays: days,

      historical: forecastData.historical,

      upcoming: forecastData.upcoming,

      forecast: result.forecast,
    };
  }
}

export const cashFlowService = new CashFlowService();
