export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  size: string;
  availability: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface ProductInsert {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  size: string;
  availability: boolean;
}

export interface ProductUpdate extends Partial<ProductInsert> {}

export type OrderPaymentStatus = 'pending' | 'submitted' | 'approved';

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_address_label?: string | null;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  delivery_type?: 'pickup' | 'shipping';
  payment_status?: OrderPaymentStatus;
  mpesa_message?: string | null;
  mpesa_sender_name?: string | null;
}

export interface PaymentSettingsRow {
  id: number;
  mpesa_buy_goods: string;
  mpesa_till_name: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  product?: Product;
}

