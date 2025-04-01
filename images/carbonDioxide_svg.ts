/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="150" height="83.49" data-name="Layer 2" viewBox="0 0 150 83.49"><defs><linearGradient id="a" x1="5" x2="67.99" y1="41.74" y2="41.74" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e71e25"/></linearGradient><linearGradient id="b" x1="40.01" x2="113.5" y1="41.74" y2="41.74" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#010101"/></linearGradient><linearGradient id="c" x1="82.01" x2="145" y1="41.74" y2="41.74" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d32027"/></linearGradient></defs><g data-name="Layer 1"><circle cx="36.5" cy="41.74" r="31.5" style="stroke:#010101;stroke-miterlimit:10;stroke-width:10px;fill:url(#a)"/><circle cx="76.76" cy="41.74" r="36.74" style="stroke:#010101;stroke-miterlimit:10;stroke-width:10px;fill:url(#b)"/><circle cx="113.5" cy="41.74" r="31.5" style="fill:url(#c);stroke:#010101;stroke-miterlimit:10;stroke-width:10px"/></g></svg>')}`;
export default image;