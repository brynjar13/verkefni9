// TODO importa því sem nota þarf

import { fetchNews } from './lib/news.js';
import { el, empty } from './lib/helpers.js';
import { fetchAndRenderCategory, fetchAndRenderLists } from './lib/ui.js';

/** Fjöldi frétta til að birta á forsíðu */
const CATEGORY_ITEMS_ON_FRONTPAGE = 5;
/** Vísun í <main> sem geymir allt efnið og við búum til element inn í */
export const main = document.querySelector('main');
const container = el('div')
container.classList.add('newsList__list')
main.appendChild(container)
/**
 * Athugar útfrá url (`window.location`) hvað skal birta:
 * - `/` birtir yfirlit
 * - `/?category=X` birtir yfirlit fyrir flokk `X`
 */
function route() {
  fetchAndRenderLists(container, CATEGORY_ITEMS_ON_FRONTPAGE)
  // Athugum hvort það sé verið að biðja um category í URL, t.d.
  // /?category=menning

  // Ef svo er, birtum fréttir fyrir þann flokk

  // Annars birtum við „forsíðu“
}

/**
 * Sér um að taka við `popstate` atburð sem gerist þegar ýtt er á back takka í
 * vafra. Sjáum þá um að birta réttan skjá.
 */
window.onpopstate = () => {
  empty(container);
  
  route();
};


// Í fyrsta skipti sem vefur er opnaður birtum við það sem beðið er um út frá URL
route();
