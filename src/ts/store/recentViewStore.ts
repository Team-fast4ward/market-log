import { RecentView } from '../interface/store';

export const recentViewStore = {
  setLocalStorage(product: RecentView[]): void {
    localStorage.setItem('recentView', JSON.stringify(product));
  },
  getLocalStorage(): RecentView[] {
    return JSON.parse(localStorage.getItem('recentView')) || [];
  },
  removeLocalStorage(): void {
    return localStorage.removeItem('recentView');
  },
  clearLocalStorage(): void {
    localStorage.clear();
  },
};
