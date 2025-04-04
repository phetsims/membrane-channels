/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="660" height="704.66" data-name="Layer 2" viewBox="0 0 660 704.66"><g data-name="Layer 1"><path d="M477.96 643.89c-60.14 25.31-131.58-10.31-195.63 4.82-36.42-2.37-167.81 30.86-145.09-35.19 13.69-30.74 36.84-118.07 38.64-154.24 16.57-143.36 42.14-221.78 6.32-362.49C199.82-3.4 309.58 101.6 375.28 64.67c38.5-1.41 135.15-45.15 125.9 23.57-30.87 134.68 107.09 375.21 78.2 510.44-13.5 86.91-2.3 39.83-101.4 45.21Z" style="fill:#00967a;stroke:#231f20;stroke-miterlimit:10;stroke-width:10px"/><path d="M624.08 543.98c-97.81-164.46-98.53-428.02-98.65-468.44-.04-12.8.29-40.71-26.07-56.83-38.15-23.34-120.34-14.77-169.37 9.83-49.02-24.6-131.21-33.17-169.36-9.83-26.36 16.12-26.03 44.03-26.07 56.83-.11 40.43-.84 303.99-98.65 468.44-19.94 33.53-42.59 60.71-24.02 90.7 31.02 50.11 161.34 82.66 215.03 54.67 34.9-18.19 23.73-54.84 21.01-119.15-.08-2-.17-4.1-.26-6.26h-.37c-33.14 0-60-26.86-60-60s26.86-60 60-60c.21 0 .41.01.62.02.96-16.52 2.4-33.84 4.48-51.69-30.19-3.13-53.74-28.65-53.74-59.67 0-33.14 26.86-60 60-60 5.93 0 11.66.87 17.07 2.48 12.43-42.35 29.88-84.68 54.26-124.11 39.51 63.92 60.84 135.43 72.07 202.32 3.45-.62 7-.96 10.62-.96 33.14 0 60 26.86 60 60s-26.54 59.66-59.4 59.99c1.18 40.74-.26 74.93-1.23 97.88-2.42 57.05-11.47 92.32 10.87 112.26l32.8-7.77a31.21 31.21 0 0 0 23.17-23.17l10.03-42.33c1.44-6.07 10.07-6.07 11.51 0l10.03 42.33a31.21 31.21 0 0 0 23.17 23.17l39.58 9.38c33.45-11.68 62.31-29.09 74.87-49.38 18.57-29.99-4.08-57.17-24.02-90.7Z" style="stroke:#231f20;stroke-miterlimit:10;stroke-width:10px;fill:#7ccbb9"/></g></svg>')}`;
export default image;