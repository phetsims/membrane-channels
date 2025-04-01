/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="893.74" height="456.02" data-name="Layer 2" viewBox="0 0 893.74 456.02"><defs><radialGradient id="a" cx="536.13" cy="227.98" r="795.4" fx="536.13" fy="227.98" gradientTransform="matrix(1 0 0 .39 0 138.33)" gradientUnits="userSpaceOnUse"><stop offset=".24" stop-color="#568444"/><stop offset=".34" stop-color="#598648"/><stop offset=".45" stop-color="#658f55"/><stop offset=".56" stop-color="#799d6b"/><stop offset=".68" stop-color="#94b189"/><stop offset=".8" stop-color="#b8cbb0"/><stop offset=".92" stop-color="#e2eadf"/><stop offset=".99" stop-color="#fff"/></radialGradient></defs><path d="m886.64 327.46-42.82-10.15a31.57 31.57 0 0 1-23.44-23.44l-10.15-42.82c-1.45-6.14-10.19-6.14-11.64 0l-10.15 42.82A31.57 31.57 0 0 1 765 317.31l-26.48 6.28-26.48-6.28a31.55 31.55 0 0 1-23.44-23.44l-10.15-42.82c-1.45-6.14-10.19-6.14-11.64 0l-10.15 42.82a31.57 31.57 0 0 1-23.44 23.44l-36.02 8.54-81.64-112.36-116.98 38.01 74.45-101.9-86.72-120.03-135.47 43.62-120.99-70.3L2.9 75.73 2.51 222.1l126.56 73.53 122.67-70.39 123 40.33v141.75l140.83 45.76 81.64-112.36 36.02 8.54a31.57 31.57 0 0 1 23.44 23.44l10.15 42.82c1.45 6.14 10.19 6.14 11.64 0l10.15-42.82a31.57 31.57 0 0 1 23.44-23.44l26.48-6.28 26.48 6.28a31.57 31.57 0 0 1 23.44 23.44l10.15 42.82c1.45 6.14 10.19 6.14 11.64 0l10.15-42.82a31.57 31.57 0 0 1 23.44-23.44l42.82-10.15c6.14-1.45 6.14-10.19 0-11.64Z" data-name="Layer 1" style="fill:url(#a);stroke:#010101;stroke-miterlimit:10;stroke-width:5px"/></svg>')}`;
export default image;