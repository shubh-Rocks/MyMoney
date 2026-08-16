const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, config);
    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "network error",
      }));
      throw new Error(error.error || "Request failed");
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

  // Profile update method

  async updateProfile(profileData) {
    return this.request("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  }

  // borrower methods
  async addBorrower(borrowerData) {
    return this.request("/api/borrowers", {
      method: "POST",
      body: JSON.stringify(borrowerData),
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

  async recentPayments() {
    return this.request("/api/payments/recent");
  }

  async paymentsMethods() {
    return this.request("/api/payments/methods");
  }

  // Dashboard methods
  async BorrowersLoanSummary() {
    return this.request("/api/dashboard");
  }
}

export const apiClient = new ApiClient();
