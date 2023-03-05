const $ = <T extends HTMLElement = HTMLDivElement>(selector: string) =>
  document.querySelector(selector) as T;
const $$ = <T extends HTMLElement = HTMLDivElement>(selector: string) =>
  document.querySelectorAll(selector) as unknown as T;

export { $, $$ };
