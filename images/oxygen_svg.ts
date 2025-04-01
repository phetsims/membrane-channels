/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150" height="98.09" data-name="Layer 2" viewBox="0 0 150 98.09"><defs><linearGradient id="a" x1="5" x2="93.09" y1="49.04" y2="49.04" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ee2c26"/></linearGradient><linearGradient xlink:href="#a" id="b" x1="56.91" x2="145"/></defs><g data-name="Layer 1"><circle cx="49.04" cy="49.04" r="44.04" style="fill:url(#a);stroke:#010101;stroke-miterlimit:10;stroke-width:10px"/><circle cx="100.96" cy="49.04" r="44.04" style="stroke:#010101;stroke-miterlimit:10;stroke-width:10px;fill:url(#b)"/></g></svg>')}`;
export default image;