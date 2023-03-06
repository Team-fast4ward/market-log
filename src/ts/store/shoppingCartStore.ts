import { ShoppingCartStore } from '../types/store';

/** 장바구니 localStorage */
export const shoppingCartStore = {
  setLocalStorage(product: ShoppingCartStore[]): void {
    localStorage.setItem('shoppingCart', JSON.stringify(product));
  },
  getLocalStorage(): ShoppingCartStore[] {
    return JSON.parse(localStorage.getItem('shoppingCart')) || [];
  },
  removeLocalStorage(): void {
    return localStorage.removeItem('shoppingCart');
  },
  clearLocalStorage(): void {
    localStorage.clear();
  },
};
