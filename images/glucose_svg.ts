/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="305.06" height="232.56" data-name="Layer 2" viewBox="0 0 305.06 232.56"><defs><radialGradient id="a" cx="152.57" cy="114.84" r="223.46" fx="152.57" fy="114.84" gradientTransform="matrix(1 0 0 1.08 0 -9.71)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5e499e"/><stop offset=".21" stop-color="#604b9f"/><stop offset=".36" stop-color="#6855a4"/><stop offset=".49" stop-color="#7765ad"/><stop offset=".61" stop-color="#8a7bb9"/><stop offset=".73" stop-color="#a498c8"/><stop offset=".84" stop-color="#c4bcdb"/><stop offset=".95" stop-color="#e8e6f1"/><stop offset="1" stop-color="#fff"/></radialGradient></defs><g data-name="Layer 1"><path d="m209.1 1.93 93.47 111.74-74.17 112.98-150 1.1L2.57 115.88 94.21 2.77z" style="fill:url(#a)"/><path d="M209.99 0a7340 7340 0 0 0 70.44 84.46l23.68 27.92.95 1.12-.81 1.27c-24.55 38.15-49.81 78.04-73.02 116.89-44.58-.18-107.6.23-152.79.88l-2.69.03-1.3-2.13c-17.55-28.51-36.36-57.37-54.83-85.29L.87 117.04l-.86-1.28.96-1.18 46.08-56.34C58.56 44.23 81.52 15.83 92.96 1.76l.48-.59h.76c32.86 0 83.31-.83 115.79-1.16Zm-1.78 3.86c-31.81-.15-81.82.37-113.99.53l1.24-.6C84.07 17.92 61.07 46.25 49.73 60.42L4.17 117.18l.1-2.46 19.17 27.83c19.09 27.49 38.93 55.66 58.91 82.52l-4-2.1c44.27-.34 106.38-.22 150-1.32l-4.14 2.26c25.85-35.99 51.91-74.45 76.67-111.34l.14 2.39-23.05-27.95c-22.9-27.65-46.5-55.92-69.77-83.15Z" style="fill:#010101"/></g></svg>')}`;
export default image;