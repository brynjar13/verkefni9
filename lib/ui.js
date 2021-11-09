
// import { doc } from 'prettier';
import { el, empty } from './helpers.js';
import { fetchNews } from './news.js';
/**
 * Föll sem sjá um að kalla í `fetchNews` og birta viðmót:
 * - Loading state meðan gögn eru sótt
 * - Villu state ef villa kemur upp við að sækja gögn
 * - Birta gögnin ef allt OK
 * Fyrir gögnin eru líka búnir til takkar sem leyfa að fara milli forsíðu og
 * flokks *án þess* að nota sjálfgefna <a href> virkni—við tökum yfir og sjáum
 * um sjálf með History API.
 */

/**
 * Sér um smell á flokk og birtir flokkinn *á sömu síðu* og við erum á.
 * Þarf að:
 * - Stoppa sjálfgefna hegðun <a href>
 * - Tæma `container` þ.a. ekki sé verið að setja efni ofan í annað efni
 * - Útbúa link sem fer til baka frá flokk á forsíðu, þess vegna þarf `newsItemLimit`
 * - Sækja og birta flokk
 * - Bæta við færslu í `history` þ.a. back takki virki
 *
 * Notum lokun þ.a. við getum útbúið föll fyrir alla flokka með einu falli. Notkun:
 * ```
 * link.addEventListener('click', handleCategoryClick(categoryId, container, newsItemLimit));
 * ```
 *
 * @param {string} id ID á flokk sem birta á eftir að smellt er
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
function handleCategoryClick(id, container, newsItemLimit) {
  const main = document.querySelector('.newsList__list');
  empty(main);
  fetchAndRenderCategory(id, container, newsItemLimit);
  return (e) => {
    e.preventDefault();

    // TODO útfæra
  };
}

/**
 * Eins og `handleCategoryClick`, nema býr til link sem fer á forsíðu.
 *
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
async function handleBackClick(container, newsItemLimit) {
  const main = document.querySelector('.layout__main');
  empty(main);
  console.log(`${window.location.state}`)
  await fetchAndRenderLists(container,newsItemLimit);
  return (e) => {
   e.preventDefault();
  }
}


/**
 * Útbýr takka sem fer á forsíðu.
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {HTMLElement} Element með takka sem fer á forsíðu
 */
export function createCategoryBackLink(container) {
  const back = el('button', 'Til baka');
  back.classList.add('news__links');
  back.classList.add('news__link');
  container.appendChild(back);
}

/**
 * Sækir grunnlista af fréttum, síðan hvern flokk fyrir sig og birtir nýjustu
 * N fréttir úr þeim flokk með `fetchAndRenderCategory()`
 * @param {HTMLElement} container Element sem mun innihalda allar fréttir
 * @param {number} newsItemLimit Hámark fjöldi frétta sem á að birta í yfirliti
 */
export async function fetchAndRenderLists(container, newsItemLimit) {
  // Byrjum á að birta loading skilaboð

  // Birtum þau beint á container
  const loadingAll = el('p','sæki lista af gögnum...');
  const loading = el('p', 'sæki gögn...')
  const villa = el('p','villa kom upp')
  container.appendChild(loadingAll);
  // Sækjum yfirlit með öllum flokkum, hér þarf að hugsa um Promises!
  const allt = await fetchNews();
  // Fjarlægjum loading skilaboð
  if (allt !== null) {
    container.removeChild(loadingAll);
  } else {
      container.removeChild(loadingAll);
      container.appendChild(villa);
    }
  // Athugum hvort villa hafi komið upp => fetchNews skilaði null
  
  // Athugum hvort engir fréttaflokkar => fetchNews skilaði tómu fylki

  // Búum til <section> sem heldur utan um allt
  for (let i = 0; i<newsItemLimit; i++) {
    const id = allt[i].id;
    const frettir = await fetchAndRenderCategory(id, container, newsItemLimit);
    const allNews = el('button','Allar fréttir');
    allNews.classList.add('news__links');
    allNews.classList.add('news__link');
    const section = document.querySelectorAll('section');
    const link = document.querySelectorAll('button');
    section[i].removeChild(link[i]);
    section[i].appendChild(allNews);
    allNews.addEventListener('click', () => handleCategoryClick(id, container, 20));
  } 
  


  
  // Höfum ekki-tómt fylki af fréttaflokkum! Ítrum í gegn og birtum

   

  // Þegar það er smellt á flokka link, þá sjáum við um að birta fréttirnar, ekki default virknin
}

/**
 * Sækir gögn fyrir flokk og birtir í DOM.
 * @param {string} id ID á category sem við erum að sækja
 * @param {HTMLElement} parent Element sem setja á flokkinn í
 * @param {HTMLELement | null} [link=null] Linkur sem á að setja eftir fréttum
 * @param {number} [limit=Infinity] Hámarks fjöldi frétta til að sýna
 */
export async function fetchAndRenderCategory(
  id,
  parent,
  limit = Infinity
) {
  // Búum til <section> sem heldur utan um flokkinn
  const section = document.createElement('section');
  section.classList.add('news');
  // Bætum við parent og þannig DOM, allar breytingar héðan í frá fara gegnum
  // container sem er tengt parent
  parent.append(section);

  // Setjum inn loading skilaboð fyrir flokkinn
  const loading = el('p','sæki gögn...');
  loading.classList.add('news_p');
  const villa = el('p','villa kom upp');
  villa.classList.add('news_p');
  const noNews = el('p','það eru engar fréttir');
  noNews.classList.add('news_p');
  section.append(loading);
  // Sækjum gögn fyrir flokkinn og bíðum
  const flokkur = await fetchNews(id);
  // Fjarlægjum loading skilaboð
  if (flokkur !== null) {
    section.removeChild(loading);
  } else {
    section.removeChild(loading);
  }
  // Ef það er linkur, bæta honum við

  // Villuskilaboð ef villa og hættum

  // Skilaboð ef engar fréttir og hættum
  // Bætum við titli

  // Höfum fréttir! Ítrum og bætum við <ul>
  try {
    const title = el('h2',flokkur.title);
    const ul = el('ul');
    title.classList.add('news__title');
    ul.classList.add('news__list');
    ul.classList.add('news__item');
    if (flokkur.items.length === 0) {
      section.appendChild(noNews);
    } else {
      section.appendChild(title);
      section.appendChild(ul);
      if (limit<flokkur.items.length) {
        for (let i = 0; i<limit; i++) {
          const frettir = el('a', flokkur.items[i].title);
          frettir.setAttribute('href', `${flokkur.items[i].link}`);
          ul.appendChild(el('li', frettir));
        } createCategoryBackLink(section);
      } else {
        for (let i = 0; i<flokkur.items.length; i++) {
          const frettir = el('a', flokkur.items[i].title);
          frettir.setAttribute('href', `${flokkur.items[i].link}`);
          ul.appendChild(el('li', frettir));
        } createCategoryBackLink(section);
      }
    }
  } catch (error) {
    section.appendChild(villa);
    createCategoryBackLink(section);
  }
}
