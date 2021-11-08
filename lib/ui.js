
import { main } from '../main.js';
import { el } from './helpers.js';
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
function handleBackClick(container, newsItemLimit) {
  return (e) => {
    e.preventDefault();

    // TODO útfæra
  };
}

/**
 * Útbýr takka sem fer á forsíðu.
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {HTMLElement} Element með takka sem fer á forsíðu
 */
export function createCategoryBackLink(container, newsItemLimit) {
  // TODO útfæra
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
  const loading = el('section','sæki gögn');
  const villa = el('section','villa kom upp')
  container.appendChild(loading);
  // Sækjum yfirlit með öllum flokkum, hér þarf að hugsa um Promises!
  const allt = await fetchNews();
  const allar = await fetchNews('allar');
  const innlent = await fetchNews('innlent');
  const erlent = await fetchNews('erlent');
  const sports = await fetchNews('ithrottir');
  const menning = await fetchNews('menning');
  // Fjarlægjum loading skilaboð
  if (allt !== null) {
    container.removeChild(loading);
  } else {
      container.removeChild(loading)
      container.appendChild(villa)
    }
  // Athugum hvort villa hafi komið upp => fetchNews skilaði null
  
  // Athugum hvort engir fréttaflokkar => fetchNews skilaði tómu fylki

  // Búum til <section> sem heldur utan um allt
  for (let i = 0; i<allt.length; i++) {
    const title = el('strong', allt.items[i].title);
    const section = el('section',title);
    section.classList.add('newsList__item');
    section.classList.add('news');
    section.setAttribute('id',`${i}`)
    container.appendChild(section);
  }
  
  const sectionAllar = document.getElementById('0');
  const sectionInnlent = document.getElementById('1');
  const sectionErlent = document.getElementById('2');
  const sectionSports = document.getElementById('3');
  const sectionMenning = document.getElementById('4');
    
  for (let i = 0; i<newsItemLimit; i++) {
    const frettir = el('p', allar.items[i].title);
    frettir.classList.add('news_p')
    sectionAllar.append(frettir);
  }
  for (let i = 0; i<newsItemLimit; i++) {
    const frettir = el('p', innlent.items[i].title);
    frettir.classList.add('news_p')
    sectionInnlent.append(frettir);
  }
  for (let i = 0; i<newsItemLimit; i++) {
    const frettir = el('p', erlent.items[i].title);
    frettir.classList.add('news_p')
    sectionErlent.append(frettir);
  }
  for (let i = 0; i<newsItemLimit; i++) {
    const frettir = el('p', sports.items[i].title);
    frettir.classList.add('news_p')
    sectionSports.append(frettir);
  }
  for (let i = 0; i<newsItemLimit; i++) {
    const frettir = el('p', menning.items[i].title);
    frettir.classList.add('news_p')
    sectionMenning.append(frettir);
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
  link = null,
  limit = Infinity
) {
  // Búum til <section> sem heldur utan um flokkinn

  // Bætum við parent og þannig DOM, allar breytingar héðan í frá fara gegnum
  // container sem er tengt parent

  // Setjum inn loading skilaboð fyrir flokkinn

  // Sækjum gögn fyrir flokkinn og bíðum

  // Fjarlægjum loading skilaboð

  // Ef það er linkur, bæta honum við

  // Villuskilaboð ef villa og hættum

  // Skilaboð ef engar fréttir og hættum

  // Bætum við titli

  // Höfum fréttir! Ítrum og bætum við <ul>
}
