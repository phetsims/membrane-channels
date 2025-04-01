/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" data-name="Layer 2" viewBox="0 0 130 130"><defs><linearGradient id="a" x1="5" x2="125" y1="65" y2="65" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffd22e"/></linearGradient></defs><g data-name="Layer 1"><circle cx="65" cy="65" r="60" style="stroke-miterlimit:10;stroke-width:10px;fill:url(#a);stroke:#010101"/><path d="M65 24.4v81.2M25.63 65h78.74" style="fill:#231f20;stroke:#231f20;stroke-miterlimit:10;stroke-width:10px"/></g></svg>')}`;
export default image;