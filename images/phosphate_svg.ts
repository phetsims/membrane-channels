/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="176.67" height="176.67" data-name="Layer 2" viewBox="0 0 176.67 176.67"><defs><radialGradient id="a" cx="594.15" cy="-1606.31" r="141.54" fx="594.15" fy="-1606.31" gradientTransform="rotate(44.12 -1856.944 -1408.34)scale(1 1.05)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#568444"/><stop offset=".28" stop-color="#578545"/><stop offset=".38" stop-color="#5d894c"/><stop offset=".45" stop-color="#689158"/><stop offset=".5" stop-color="#779c69"/><stop offset=".55" stop-color="#8bab7f"/><stop offset=".6" stop-color="#a4bc9a"/><stop offset=".64" stop-color="#c1d2ba"/><stop offset=".67" stop-color="#e2eadf"/><stop offset=".7" stop-color="#fff"/></radialGradient></defs><path d="m82.58 169.62-10.03-42.33a31.21 31.21 0 0 0-23.17-23.17L7.05 94.09c-6.07-1.44-6.07-10.07 0-11.51l42.33-10.03a31.21 31.21 0 0 0 23.17-23.17L82.58 7.05c1.44-6.07 10.07-6.07 11.51 0l10.03 42.33a31.21 31.21 0 0 0 23.17 23.17l42.33 10.03c6.07 1.44 6.07 10.07 0 11.51l-42.33 10.03a31.21 31.21 0 0 0-23.17 23.17l-10.03 42.33c-1.44 6.07-10.07 6.07-11.51 0Z" data-name="Layer 1" style="fill:url(#a);stroke:#010101;stroke-miterlimit:10;stroke-width:5px"/></svg>')}`;
export default image;