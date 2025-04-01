/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="154.86" height="154.86" data-name="Layer 2" viewBox="0 0 154.86 154.86"><defs><radialGradient id="a" cx="673.22" cy="-1407.62" r="123.56" fx="673.22" fy="-1407.62" gradientTransform="rotate(44.12 -1550.961 -1422.364)scale(1 1.05)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#568444"/><stop offset=".28" stop-color="#578545"/><stop offset=".38" stop-color="#5d894c"/><stop offset=".45" stop-color="#689158"/><stop offset=".5" stop-color="#779c69"/><stop offset=".55" stop-color="#8bab7f"/><stop offset=".6" stop-color="#a4bc9a"/><stop offset=".64" stop-color="#c1d2ba"/><stop offset=".67" stop-color="#e2eadf"/><stop offset=".7" stop-color="#fff"/></radialGradient></defs><path d="m72.41 148.39-8.76-36.95a27.26 27.26 0 0 0-20.23-20.23L6.47 82.45c-5.3-1.25-5.3-8.79 0-10.05l36.95-8.76a27.26 27.26 0 0 0 20.23-20.23l8.76-36.95c1.25-5.3 8.79-5.3 10.05 0l8.76 36.95a27.26 27.26 0 0 0 20.23 20.23l36.95 8.76c5.3 1.25 5.3 8.79 0 10.05l-36.95 8.76a27.26 27.26 0 0 0-20.23 20.23l-8.76 36.95c-1.25 5.3-8.79 5.3-10.05 0Z" data-name="Layer 1" style="fill:url(#a);stroke:#010101;stroke-miterlimit:10;stroke-width:5px"/></svg>')}`;
export default image;