import { excelExportRepository } from "@/repositories/excel.export.repository";

class ExcelExportService {
  async getDetails({ userId, startDate, endDate, paymentType }) {
    const borrower = await excelExportRepository.getBorrowersByDateRange({
      userId,
      startDate,
      endDate,
      paymentType,
    });
    return borrower;
  }
}

export const excelExportService = new ExcelExportService();
