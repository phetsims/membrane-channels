/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="782.44" height="399.64" data-name="Layer 2" viewBox="0 0 782.44 399.64"><defs><radialGradient id="a" cx="469.3" cy="199.79" r="695.78" fx="469.3" fy="199.79" gradientTransform="matrix(1 0 0 .39 0 121.22)" gradientUnits="userSpaceOnUse"><stop offset=".24" stop-color="#568444"/><stop offset=".34" stop-color="#598648"/><stop offset=".45" stop-color="#658f55"/><stop offset=".56" stop-color="#799d6b"/><stop offset=".68" stop-color="#94b189"/><stop offset=".8" stop-color="#b8cbb0"/><stop offset=".92" stop-color="#e2eadf"/><stop offset=".99" stop-color="#fff"/></radialGradient></defs><path d="m775.91 286.81-37.46-8.88a27.62 27.62 0 0 1-20.5-20.5l-8.88-37.46c-1.27-5.37-8.91-5.37-10.18 0l-8.88 37.46a27.62 27.62 0 0 1-20.5 20.5l-23.17 5.49-23.17-5.49a27.62 27.62 0 0 1-20.5-20.5l-8.88-37.46c-1.27-5.37-8.91-5.37-10.18 0l-8.88 37.46a27.62 27.62 0 0 1-20.5 20.5l-31.51 7.47-71.41-98.29-102.33 33.25 65.13-89.14-75.86-105-118.51 38.15L113.91 2.89 2.85 66.61l-.34 128.04 110.71 64.32 107.31-61.57 107.59 35.28v124l123.19 40.03 71.41-98.29 31.51 7.47a27.62 27.62 0 0 1 20.5 20.5l8.88 37.46c1.27 5.37 8.91 5.37 10.18 0l8.88-37.46a27.62 27.62 0 0 1 20.5-20.5l23.17-5.49 23.17 5.49a27.62 27.62 0 0 1 20.5 20.5l8.88 37.46c1.27 5.37 8.91 5.37 10.18 0l8.88-37.46a27.62 27.62 0 0 1 20.5-20.5l37.46-8.88c5.37-1.27 5.37-8.91 0-10.18Z" data-name="Layer 1" style="fill:url(#a);stroke:#010101;stroke-miterlimit:10;stroke-width:5px"/></svg>')}`;
export default image;