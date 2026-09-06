import { cashFlowRepository } from "@/repositories/cash.flow.repository";
import { groqService } from "./groq.service";

class CashFlowService {
  async getForecastDataset(userId, days = 30) {
    const today = new Date();

    // Historical data: last 30 days
    const historyStartDate = new Date(today);
    historyStartDate.setDate(today.getDate() - 30);

    // Forecast + upcoming dues
    const forecastingEndDate = new Date(today);
    forecastingEndDate.setDate(today.getDate() + days);

    const [dailyCollections, upcomingDueLoans] = await Promise.all([
      cashFlowRepository.getDailyCollections(userId, historyStartDate, today),

      cashFlowRepository.getUpcomingDueLoans(userId, today, forecastingEndDate),
    ]);

    // Total amount collected historically
    const totalHistoricalCollection = dailyCollections.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

    // Total historical days
    const totalHistoricalDays = dailyCollections.length;

    // Days on which at least one payment was received
    const collectionDays = dailyCollections.filter(
      (item) => Number(item.amount || 0) > 0,
    ).length;

    // Average collection per day
    const averageDailyCollection =
      totalHistoricalDays > 0
        ? totalHistoricalCollection / totalHistoricalDays
        : 0;

    // Total upcoming amount
    const upcomingDueAmount = upcomingDueLoans.reduce(
      (sum, loan) => sum + Number(loan.remainingAmount || 0),
      0,
    );

    return {
      forecastDays: days,

      historical: {
        periodDays: totalHistoricalDays,
        totalCollection: totalHistoricalCollection,
        collectionDays,
        averageDailyCollection,
        dailyCollections,
      },

      upcoming: {
        totalDueAmount: upcomingDueAmount,
        loanCount: upcomingDueLoans.length,
        loans: upcomingDueLoans,
      },
    };
  }

  async generateForecast(userId, days = 30) {
    if (![30, 60, 90].includes(days)) {
      throw new Error("Forecast days must be 30, 60 or 90");
    }

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
