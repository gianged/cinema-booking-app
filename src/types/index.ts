/**
 * Central Type Exports
 * Barrel file for all type definitions
 */

// Model Types
export type {
  User,
  Film,
  Category,
  ShowSchedule,
  Ticket,
  Review,
  FilmCategory,
} from './models';

// API Types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateFilmRequest,
  UpdateFilmRequest,
  FilmResponse,
  FilmListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoryListResponse,
  CreateShowRequest,
  UpdateShowRequest,
  ShowResponse,
  ShowListResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketResponse,
  TicketListResponse,
  ApiError,
  ApiSuccessResponse,
  PaginationParams,
  PaginatedResponse,
} from './api';

// Component Types
export type {
  BaseComponentProps,
  LoadingProps,
  MovieCardProps,
  SkeletonType,
  LoadingSkeletonProps,
  ErrorBoundaryProps,
  ErrorBoundaryState,
  TableColumn,
  TableProps,
  FormField,
  FormProps,
  ModalProps,
  FilmListProps,
  ShowListProps,
  CategoryListProps,
  TicketListProps,
} from './components';

// Hook Types
export type {
  AsyncState,
  UseAsyncReturn,
  UseLoadingReturn,
  UseApiState,
  UseApiOptions,
  UseApiReturn,
  UsePaginationReturn,
  UseDebounceReturn,
  UseLocalStorageReturn,
} from './hooks';

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = number | string;
export type Timestamp = Date | string;

// Enum Types
export enum UserRole {
  ADMIN = 'a',
  USER = 'u',
}

export enum ActiveStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

// Helper Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
