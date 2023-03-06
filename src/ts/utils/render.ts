import { getAllProducts } from '../api';
import { renderInitHeaderLogin } from '../page/loginPage';
import { renderCategoryNav } from '../page/mainPage/mainPage';
import { $ } from './dom';

/** Navigo innerHTML template */
export const renderPage = async (html: string): Promise<void> => {
  renderInitHeaderLogin();
  $('.app').innerHTML = html;
  renderCategoryNav(await getAllProducts());
};
