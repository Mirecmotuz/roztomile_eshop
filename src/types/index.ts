export type ProductCategory = 'svíčky' | 'včelí vosk' | 'balzámy';

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
  variants?: string[];
  enableVariantImageSwitch?: boolean;
  variantImages?: Record<string, string>;
  handmadeTitle?: string;
  handmadeDescription?: string;
  dimensions?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  variant?: string;
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
  deliveryMethod: 'packeta' | 'pickup';
  packetaPoint: PacketaPoint | null;
}

export interface Order {
  id: string;
  variableSymbol: string;
  items: OrderItem[];
  formData: OrderFormData;
  totalAmount: number;
  createdAt: Date;
}
