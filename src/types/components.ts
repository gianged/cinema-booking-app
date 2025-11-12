/**
 * Component Props Types
 * Type definitions for React component props
 */

import { ReactNode, CSSProperties } from 'react';
import { Film, ShowSchedule, Category, Ticket } from './models';

// ===============================
// Common Component Types
// ===============================

export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
}

// ===============================
// Movie Card Types
// ===============================

export interface MovieCardProps {
  id: number;
  filmName: string;
  filmDescription: string;
  poster: Buffer | string;
  backdrop?: Buffer | string;
  premiere: Date | string;
  trailer?: string;
  categories?: string;
  rating?: number;
  isActive: number;
  onClick?: () => void;
}

// ===============================
// Loading Skeleton Types
// ===============================

export type SkeletonType = 'card' | 'list' | 'table' | 'detail';

export interface LoadingSkeletonProps {
  count?: number;
  type?: SkeletonType;
}

// ===============================
// Error Boundary Types
// ===============================

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// ===============================
// Table Types
// ===============================

export interface TableColumn<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sorter?: boolean;
  filters?: Array<{ text: string; value: unknown }>;
  width?: number | string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: boolean;
  rowKey: keyof T | ((record: T) => string);
  onRow?: (record: T) => void;
}

// ===============================
// Form Types
// ===============================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'time';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  rules?: Array<{ required?: boolean; message?: string; pattern?: RegExp }>;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  initialValues?: Record<string, unknown>;
  loading?: boolean;
  submitText?: string;
}

// ===============================
// Modal Types
// ===============================

export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onOk?: () => void | Promise<void>;
  okText?: string;
  cancelText?: string;
  width?: number | string;
  footer?: ReactNode;
  confirmLoading?: boolean;
}

// ===============================
// List Component Types
// ===============================

export interface FilmListProps {
  films: Film[];
  loading?: boolean;
  onFilmClick?: (film: Film) => void;
}

export interface ShowListProps {
  shows: ShowSchedule[];
  loading?: boolean;
  onShowClick?: (show: ShowSchedule) => void;
}

export interface CategoryListProps {
  categories: Category[];
  loading?: boolean;
  onCategoryClick?: (category: Category) => void;
}

export interface TicketListProps {
  tickets: Ticket[];
  loading?: boolean;
  onTicketClick?: (ticket: Ticket) => void;
}
