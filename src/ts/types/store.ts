/** shoppingcart store */

export interface ShoppingCartStore {
  count: number;
  id: string;
  price?: number;
  qty?: number;
  pricePerOne: number;
  thumbnail: string;
  title: string;
}
export type ShoppingCartStoreValue = ShoppingCartStore[];

export interface WishListStore {
  count: number;
  id: string;
  price?: number;
  pricePerOne: number;
  thumbnail: string;
  title: string;
}
export type WishListStoreValue = WishListStore[];

export interface RecentView {
  id: string;
  thumbnail: string;
  title: string;
}

export type RecentViewValue = RecentView[];
