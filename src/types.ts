export type CategoryId =
  | 'grocery'
  | 'pharmacy'
  | 'vegetable_bazaar'
  | 'fruits'
  | 'clothing'
  | 'electronics'
  | 'restaurant'
  | 'household'
  | 'stationery'
  | 'all';

export interface Category {
  id: CategoryId;
  nameBn: string;
  nameEn: string;
  iconName: string;
  count: number;
}

export interface ProductItem {
  id: string;
  nameBn: string;
  category: CategoryId;
  price: number;
  unit: string;
  imageUrl: string;
  shopId: string;
  shopName: string;
  shopArea: string;
  isAvailable: boolean;
  stockStatus: 'ইন স্টক' | 'সীমিত স্টক';
  descriptionBn: string;
  originalPrice?: number;
}

export interface Shop {
  id: string;
  nameBn: string;
  categoryBn: string;
  categoryId: CategoryId;
  addressBn: string;
  area: string;
  distance: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  timingBn: string;
  phone: string;
  coverImage: string;
  bannerImage?: string;
  featuredProducts: {
    nameBn: string;
    price: number;
  }[];
  deliveryAvailable: boolean;
  minOrder?: number;
  lat: number;
  lng: number;
  ownerName?: string;
  ownerPhone?: string;
  isOwner?: boolean;
}

export interface ShopInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  items: string;
  totalAmount: number;
  timeBn: string;
  status: 'নতুন' | 'প্রসেসিং' | 'সম্পন্ন' | 'বাতিল';
  type: 'order' | 'call';
}

export interface PriceComparisonOption {
  shopId: string;
  shopName: string;
  shopArea: string;
  distance: string;
  price: number;
  isLowest?: boolean;
  inStock: boolean;
}

export interface PriceComparisonItem {
  id: string;
  productNameBn: string;
  unitBn: string;
  categoryBn: string;
  standardPrice: number;
  imageUrl: string;
  shops: PriceComparisonOption[];
}
