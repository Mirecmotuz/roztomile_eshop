export type ProductCategory = 'sviečky' | 'včelí vosk' | 'balzamy';

export type ProductBadge = 'Novinka' | 'Bestseller';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  scent?: string;
  materials: string;
  badge?: ProductBadge;
  images: string[];
  inStock: boolean;
  weight?: string;
  burnTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PacketaPoint {
  id: string;
  name: string;
  address: string;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
  packetaPoint: PacketaPoint | null;
}

export interface Order {
  id: string;
  variableSymbol: string;
  items: CartItem[];
  formData: OrderFormData;
  totalAmount: number;
  createdAt: Date;
}
