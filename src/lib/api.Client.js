
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

  //    Auth method

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

  // user method
  // async updatedUser() {
  //   return this.request("/api/user/profile", { method: "PUT" });
  // }

  // async addBorrower(borrowerData) {
  //   return this.request("api/addLoan", {
  //     method: "POST",
  //     body: JSON.stringify(borrowerData),
  //   });
  // }
}

export const apiCLient = new ApiClient();
