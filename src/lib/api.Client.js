// Apne ApiClient ki file ke upar yeh check add karein:
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  // Agar server-side par hai aur env variable nahi hai, toh localhost use karein
  if (typeof window === "undefined") {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }
  return "";
};

const API_BASE_URL = getBaseUrl();
class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const isFormData = options.body instanceof FormData;
    const config = {
      credentials: "include",
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    };

    const response = await fetch(url, config);
    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({
        error: "network error",
      }));
      const message =
        typeof errorPayload.error === "string"
          ? errorPayload.error
          : errorPayload.error?.message ||
            errorPayload.message ||
            "Request failed";

      const error = new Error(message);
      error.details = errorPayload.details || errorPayload.error?.details;
      throw error;
    }
    return response.json();
  }

  //    Auth methods

  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  // OTP methods
  async verifyOtp(email, otp) {
    return this.request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendOtp(email) {
    return this.request("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Profile update method
  async updateProfile(profileData) {
    return this.request("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  }

  async getProfileInfo() {
    return this.request("/api/user/profile/");
  }

  // borrower methods
  async addBorrower(borrowerData, options = {}) {
    return this.request("/api/borrowers", {
      method: "POST",
      body: JSON.stringify(borrowerData),
      ...options,
    });
  }

  async getBorrower() {
    return this.request("/api/borrowers");
  }

  // Loanpayment methods
  async addLoanPayment(LoanpaymentsData) {
    return this.request("/api/payments", {
      method: "POST",
      body: JSON.stringify(LoanpaymentsData),
    });
  }

  async recentPayments(page = 1) {
    return this.request(`/api/payments/recent?page=${page}`);
  }

  async paymentsMethods() {
    return this.request("/api/payments/methods");
  }

  // Dashboard methods
  async BorrowersLoanSummary() {
    return this.request("/api/dashboard");
  }

  async loanSettlement(loanId, paymentMethod) {
    return this.request(`/api/loans/${loanId}/settle`, {
      method: "PATCH",
      body: JSON.stringify({
        paymentMethod,
      }),
    });
  }

  // Export Excel method

  async exportExcel(excelData) {
    return this.request("/api/excel", {
      method: "POST",
      body: JSON.stringify(excelData),
    });
  }

  // AI related methods
  async aiVoice(formData) {
    return this.request("/api/ai/voice", {
      method: "POST",
      body: formData,
    });
  }

  async getCashFlowForecast(range = 30) {
    return this.request(`/api/ai/cash-flow?range=${range}`);
  }

  // contact support api
  async sendQuery(queryData) {
    return this.request("/api/contact", {
      method: "POST",
      body: JSON.stringify(queryData),
    });
  }
}

export const apiClient = new ApiClient();
