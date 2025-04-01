/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="110" height="72.92" data-name="Layer 2" viewBox="0 0 110 72.92"><defs><linearGradient id="a" x1="5" x2="67.92" y1="36.46" y2="36.46" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ee2c26"/></linearGradient><linearGradient xlink:href="#a" id="b" x1="42.08" x2="105"/></defs><g data-name="Layer 1"><circle cx="36.46" cy="36.46" r="31.46" style="fill:url(#a);stroke:#010101;stroke-miterlimit:10;stroke-width:10px"/><circle cx="73.54" cy="36.46" r="31.46" style="stroke:#010101;stroke-miterlimit:10;stroke-width:10px;fill:url(#b)"/></g></svg>')}`;
export default image;