# thealldaymarket-site
Marketing site for The All Day Market, a smart vending company based in Dallas, Texas.

## URL
https://thealldaymarket.com

## Structure
- `index.html`: Home. Hero with orbiting images, what we offer, and the "Get a market in your space" call to action.
- `request.html`: Lead form for businesses that want a market.
- `support.html`: Form for customers with a purchase issue (linked from the QR code on each market).
- `privacy.html` / `terms.html`: Privacy policy and terms of service.
- `css/styles.css`: All styling, including the hero orbit animation.
- `js/main.js`: Mobile menu, scroll-driven header hide/reveal, scroll-reveal image fade-ins, and the request/support form submit handling.
- `images/`: Logo, favicon, hero images, and photos.

Each page shares the same header and footer. There is no build step: the files in this repo are the site.

## Forms
`request.html` and `support.html` submit to [Web3Forms](https://web3forms.com) (a static-site-friendly form backend — this site has no server of its own). Both forms share one `access_key`, set as a hidden input in each form, pointing submissions at `tom@thealldaymarket.com`. To rotate or set that key, request a new one at web3forms.com and replace the `access_key` value in both files.
