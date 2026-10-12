export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string; // e.g., "100 g", "250 g"
  price: number; // in NPR
  sku: string;
  isActive: boolean;
  createdAt: string;
  batches?: Batch[];
  sellableStock?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  characterTitle?: string; // e.g. "The Fiery Artisan", "The Roasted Classic"
  tagline: string;
  description: string;
  ingredients: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
  minPrice?: number;
}

export interface Batch {
  id: string;
  variantId: string;
  batchCode: string;
  madeOn: string; // ISO date string (YYYY-MM-DD)
  bestBefore: string; // ISO date string (YYYY-MM-DD)
  quantityReceived: number;
  quantityRemaining: number;
  createdAt: string;
}

export type MovementType =
  | "batch_in"
  | "order"
  | "cancel"
  | "manual"
  | "offline_sale"
  | "write_off";

export interface InventoryMovement {
  id: string;
  variantId: string;
  batchId: string;
  changeAmount: number; // positive or negative
  type: MovementType;
  reason: string;
  createdBy: string;
  timestamp: string;
}

export interface DeliveryArea {
  id: string;
  name: string;
  deliveryFee: number; // in NPR
  isActive: boolean;
  createdAt: string;
}

export type FulfilmentType = "pickup" | "delivery";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface OrderItemBatch {
  id: string;
  orderItemId: string;
  batchId: string;
  quantity: number;
  batchCode?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantSize: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  batches?: OrderItemBatch[];
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "TVP-1001"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfilmentType: FulfilmentType;
  deliveryAreaId?: string;
  deliveryAreaName?: string;
  deliveryAddress?: string;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotalAmount: number;
  totalAmount: number;
  notes?: string;
  customerNotes?: string;
  adminNotes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

// Helper types for availability queries
export interface VariantAvailability {
  variantId: string;
  sellableStock: number;
  isAvailable: boolean;
  earliestBestBefore?: string;
}

export interface DashboardStockSummary {
  expiringBatches: (Batch & { productName: string; variantSize: string; daysRemaining: number })[];
  expiredWithStock: (Batch & { productName: string; variantSize: string })[];
  lowStockVariants: (ProductVariant & { productName: string; sellableStock: number })[];
}
