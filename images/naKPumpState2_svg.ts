/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="65.22" height="64.45" data-name="Layer 2" viewBox="0 0 65.22 64.45"><g data-name="Layer 2"><path d="M43.15 4.38c-.96-.67-1.58-1.69-1.85-2.8-1.85.4-4.12.73-6.74.76-2.47.03-4.62-.22-6.4-.53a4.56 4.56 0 0 1-1.48 1.67L9.97 57.54c2.09.58 3.21 2.41 3.37 4.34 6.62-.66 13.97-1.06 21.95-.97 6.81.08 13.11.51 18.89 1.13.14-.49.34-.95.62-1.37.44-1.42-.3-4.9 1.31-5.37-4.91-17.73-8.05-33.19-12.95-50.92Z" style="fill:#9c9;stroke:#000;stroke-miterlimit:10"/><path d="M17.21 51.79c-2.23-1.21-3.38-3.86-2.59-6.37.64-2.05 2.4-3.45 4.4-3.73.25-1.15.52-2.35.83-3.59-2-1.28-2.99-3.79-2.25-6.17a5.4 5.4 0 0 1 5.22-3.79c.42-1.19.88-2.37 1.36-3.56a5.39 5.39 0 0 1-1.32-5.42c.8-2.56 3.33-4.1 5.9-3.74.56-.93 1.15-1.83 1.77-2.72 1.53-2.2 3.53-4.67 2.77-7.16-1.2-3.96-8.92-6.53-12.67-3.96-2 1.37-2.44 3.9-2.65 5.06-.68 3.66-5.1 27.54-14.24 42.09-1.86 2.97-3.8 5.35-3.08 8.13 1.2 4.65 9.2 8.07 13.19 5.73 2.59-1.52 2.47-4.88 3.35-10.72 0-.02 0-.05.01-.07Zm39.41 9-.45-4.35c-.06-.62.75-.91 1.09-.38l2.35 3.68c.57.89 1.53 1.42 2.56 1.44 1.1-.91 1.94-2 2.32-3.19.86-2.74-.94-5.22-2.65-8.28C53.48 34.7 50.31 10.62 49.83 6.93c-.15-1.17-.46-3.72-2.38-5.19-3.61-2.76-11.46-.59-12.86 3.29-.88 2.44.98 5.02 2.4 7.29a56 56 0 0 1 3.71 7.11c3.14.43 5.86 2.71 6.69 5.97.74 2.88-.19 5.8-2.17 7.74.36 1.48.67 2.93.95 4.34 2.75.71 5.04 2.85 5.8 5.8.91 3.56-.71 7.16-3.73 8.93.57 5.83.28 9.16 2.78 10.81 1.04.69 2.4.96 3.86.92l.3-.19c1-.64 1.55-1.78 1.43-2.96Z" style="stroke:#000;stroke-miterlimit:10;fill:#cfc"/></g></svg>')}`;
export default image;