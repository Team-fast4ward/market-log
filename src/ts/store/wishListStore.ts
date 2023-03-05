import { WishListStore } from '../interface/store';

/** 찜하기 목록 localStorage */
export const wishListStore = {
  setLocalStorage(product: WishListStore[]): void {
    localStorage.setItem('wishList', JSON.stringify(product));
  },
  getLocalStorage(): WishListStore[] {
    return JSON.parse(localStorage.getItem('wishList')) || [];
  },
  removeLocalStorage(): void {
    return localStorage.removeItem('wishList');
  },
  clearLocalStorage(): void {
    localStorage.clear();
  },
};
