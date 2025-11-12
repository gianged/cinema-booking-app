/**
 * API Request and Response Types
 * Type definitions for all API interactions
 */

import { User, Film, Category, ShowSchedule, Ticket } from './models';

// ===============================
// Authentication Types
// ===============================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// ===============================
// User Types
// ===============================

export interface CreateUserRequest {
  username: string;
  password: string;
  role: 'a' | 'u';
  isActive: 0 | 1;
}

export interface UpdateUserRequest {
  password: string;
  role: 'a' | 'u';
  isActive: 0 | 1;
}

// ===============================
// Film Types
// ===============================

export interface CreateFilmRequest {
  filmName: string;
  filmDescription: string;
  poster: string; // Base64 string
  backdrop: string; // Base64 string
  premiere: string;
  trailer: string;
  isActive: 0 | 1;
  categories: number[];
}

export interface UpdateFilmRequest {
  filmName: string;
  filmDescription: string;
  premiere: string;
  trailer: string;
  isActive: 0 | 1;
  categories: number[];
}

export type FilmResponse = Film;

export type FilmListResponse = Film[];

// ===============================
// Category Types
// ===============================

export interface CreateCategoryRequest {
  categoryName: string;
  isActive: 0 | 1;
}

export interface UpdateCategoryRequest {
  categoryName: string;
  isActive: 0 | 1;
}

export type CategoryResponse = Category;

export type CategoryListResponse = Category[];

// ===============================
// Show Schedule Types
// ===============================

export interface CreateShowRequest {
  film: number;
  showPrice: number;
  showDay: string;
  beginTime: string;
  room: string;
  isActive: 0 | 1;
}

export interface UpdateShowRequest {
  film: number;
  showPrice: number;
  showDay: string;
  beginTime: string;
  room: string;
  isActive: 0 | 1;
}

export type ShowResponse = ShowSchedule;

export type ShowListResponse = ShowSchedule[];

// ===============================
// Ticket Types
// ===============================

export interface CreateTicketRequest {
  idUser: number;
  idShow: number;
  ticketAmount: number;
  totalPrice: number;
}

export interface UpdateTicketRequest {
  idUser: number;
  idShow: number;
  ticketAmount: number;
  totalPrice: number;
}

export type TicketResponse = Ticket;

export type TicketListResponse = Ticket[];

// ===============================
// Generic API Types
// ===============================

export interface ApiError {
  error: string;
  message: string;
}

export interface ApiSuccessResponse<T = unknown> {
  message: string;
  data?: T;
  affectedCount?: number;
  deletedCount?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
