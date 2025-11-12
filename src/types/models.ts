/**
 * Database Model Types
 * Strongly typed interfaces for all database models
 */

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'a' | 'u'; // a = admin, u = user
  isActive: 0 | 1;
}

export interface Film {
  id: number;
  filmName: string;
  filmDescription: string;
  poster: Buffer | string;
  backdrop: Buffer | string;
  premiere: Date | string;
  trailer: string;
  isActive: 0 | 1;
  categories?: string;
}

export interface Category {
  id: number;
  categoryName: string;
  isActive: 0 | 1;
}

export interface ShowSchedule {
  id: number;
  film: string | number;
  showPrice: number;
  showDay: Date | string;
  beginTime: string;
  endTime: string;
  room: string;
  isActive: 0 | 1;
  filmName?: string;
}

export interface Ticket {
  idTicket: number;
  idUser: number;
  idShow: number;
  ticketAmount: number;
  totalPrice: number;
  filmName?: string;
  username?: string;
  showDay?: string;
  showTime?: string;
}

export interface Review {
  id: number;
  filmId: number;
  userId: number;
  rate: number;
  content: string;
}

export interface FilmCategory {
  filmId: number;
  categoryId: number;
}
