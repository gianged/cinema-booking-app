// Centralized API service for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Types
export interface User {
  id: number;
  username: string;
  role: string;
  isActive: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Film {
  id: number;
  filmName: string;
  filmDescription: string;
  poster: Buffer | string;
  backdrop: Buffer | string;
  premiere: Date | string;
  trailer: string;
  isActive: number;
  categories?: string;
}

export interface Category {
  id: number;
  categoryName: string;
  isActive: number;
}

export interface ShowSchedule {
  id: number;
  film: string | number;
  showPrice: number;
  showDay: Date | string;
  beginTime: string;
  endTime: string;
  room: string;
  isActive: number;
  filmName?: string;
}

export interface Ticket {
  idTicket: number;
  idUser: number;
  idShow: number;
  ticketAmount: number;
  totalPrice: number;
}

// API Client Class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Try to load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // User/Auth APIs
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/security/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/security/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  logout() {
    this.clearToken();
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/security/user');
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/security/user/${id}`);
  }

  async createUser(userData: {
    username: string;
    password: string;
    role: string;
    isActive: number;
  }): Promise<User> {
    return this.request<User>('/security/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: number,
    userData: { password: string; role: string; isActive: number }
  ): Promise<{ message: string; affectedCount: number }> {
    return this.request(`/security/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<{ message: string; deletedCount: number }> {
    return this.request(`/security/user/${id}`, {
      method: 'DELETE',
    });
  }

  async cleanupUsers(): Promise<{ message: string; deletedCount: number }> {
    return this.request('/security/user/cleanup', {
      method: 'DELETE',
    });
  }

  // Film APIs
  async getCurrentFilms(): Promise<Film[]> {
    return this.request<Film[]>('/film/currentshow');
  }

  async getActiveFilms(): Promise<Film[]> {
    return this.request<Film[]>('/film/active');
  }

  async getAllFilms(): Promise<Film[]> {
    return this.request<Film[]>('/film');
  }

  async getFilmById(id: number): Promise<Film> {
    return this.request<Film>(`/film/${id}`);
  }

  async createFilm(filmData: {
    filmName: string;
    filmDescription: string;
    poster: string;
    backdrop: string;
    premiere: string;
    trailer: string;
    isActive: number;
    categories: number[];
  }): Promise<Film> {
    return this.request<Film>('/film', {
      method: 'POST',
      body: JSON.stringify(filmData),
    });
  }

  async updateFilm(
    id: number,
    filmData: {
      filmName: string;
      filmDescription: string;
      premiere: string;
      trailer: string;
      isActive: number;
      categories: number[];
    }
  ): Promise<{ message: string; affectedCount: number }> {
    return this.request(`/film/${id}`, {
      method: 'PUT',
      body: JSON.stringify(filmData),
    });
  }

  async deleteFilm(id: number): Promise<{ message: string; deletedCount: number }> {
    return this.request(`/film/${id}`, {
      method: 'DELETE',
    });
  }

  async cleanupFilms(): Promise<{ message: string; deletedCount: number }> {
    return this.request('/film/cleanup', {
      method: 'DELETE',
    });
  }

  // Category APIs
  async getActiveCategories(): Promise<Category[]> {
    return this.request<Category[]>('/category/active');
  }

  async getAllCategories(): Promise<Category[]> {
    return this.request<Category[]>('/category');
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.request<Category>(`/category/${id}`);
  }

  async createCategory(categoryData: {
    categoryName: string;
    isActive: number;
  }): Promise<Category> {
    return this.request<Category>('/category', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(
    id: number,
    categoryData: { categoryName: string; isActive: number }
  ): Promise<{ message: string; affectedCount: number }> {
    return this.request(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<{ message: string; deletedCount: number }> {
    return this.request(`/category/${id}`, {
      method: 'DELETE',
    });
  }

  // Show Schedule APIs
  async getActiveShows(filmId: number): Promise<ShowSchedule[]> {
    return this.request<ShowSchedule[]>(`/show/active/${filmId}`);
  }

  async getAllShows(): Promise<ShowSchedule[]> {
    return this.request<ShowSchedule[]>('/show');
  }

  async getShowById(id: number): Promise<ShowSchedule> {
    return this.request<ShowSchedule>(`/show/${id}`);
  }

  async createShow(showData: {
    film: number;
    showPrice: number;
    showDay: string;
    beginTime: string;
    room: string;
    isActive: number;
  }): Promise<ShowSchedule> {
    return this.request<ShowSchedule>('/show', {
      method: 'POST',
      body: JSON.stringify(showData),
    });
  }

  async updateShow(
    id: number,
    showData: {
      film: number;
      showPrice: number;
      showDay: string;
      beginTime: string;
      room: string;
      isActive: number;
    }
  ): Promise<{ message: string; affectedCount: number }> {
    return this.request(`/show/${id}`, {
      method: 'PUT',
      body: JSON.stringify(showData),
    });
  }

  async deleteShow(id: number): Promise<{ message: string; deletedCount: number }> {
    return this.request(`/show/${id}`, {
      method: 'DELETE',
    });
  }

  // Ticket APIs
  async getUserTickets(userId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/ticket/userview/${userId}`);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.request<Ticket[]>('/ticket');
  }

  async getTicketById(id: number): Promise<Ticket> {
    return this.request<Ticket>(`/ticket/${id}`);
  }

  async createTicket(ticketData: {
    idUser: number;
    idShow: number;
    ticketAmount: number;
    totalPrice: number;
  }): Promise<Ticket> {
    return this.request<Ticket>('/ticket', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(
    id: number,
    ticketData: {
      idUser: number;
      idShow: number;
      ticketAmount: number;
      totalPrice: number;
    }
  ): Promise<{ message: string; affectedCount: number }> {
    return this.request(`/ticket/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  }

  async deleteTicket(id: number): Promise<{ message: string; deletedCount: number }> {
    return this.request(`/ticket/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
export default api;
