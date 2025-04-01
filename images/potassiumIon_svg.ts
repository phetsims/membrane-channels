/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" data-name="Layer 2" viewBox="0 0 180 180"><defs><linearGradient id="a" x1="5" x2="175" y1="90" y2="90" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#00a8d4"/></linearGradient></defs><g data-name="Layer 1"><circle cx="90" cy="90" r="85" style="stroke-miterlimit:10;stroke-width:10px;fill:url(#a);stroke:#010101"/><path d="M90 31.02v117.96M32.79 90h114.42" style="fill:#231f20;stroke:#231f20;stroke-miterlimit:10;stroke-width:10px"/></g></svg>')}`;
export default image;