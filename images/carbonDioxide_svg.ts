/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="109.74" data-name="Layer 2" viewBox="0 0 200 109.74"><defs><linearGradient id="a" x1="5" x2="90.49" y1="54.87" y2="54.87" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e71e25"/></linearGradient><linearGradient id="b" x1="52.52" x2="152.26" y1="54.87" y2="54.87" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#010101"/></linearGradient><linearGradient id="c" x1="109.51" x2="195" y1="54.87" y2="54.87" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d32027"/></linearGradient></defs><g data-name="Layer 1"><circle cx="47.74" cy="54.87" r="42.74" style="stroke:#010101;stroke-miterlimit:10;stroke-width:10px;fill:url(#a)"/><circle cx="102.39" cy="54.87" r="49.87" style="stroke:#010101;stroke-miterlimit:10;stroke-width:10px;fill:url(#b)"/><circle cx="152.26" cy="54.87" r="42.74" style="fill:url(#c);stroke:#010101;stroke-miterlimit:10;stroke-width:10px"/></g></svg>')}`;
export default image;