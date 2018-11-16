# CRM Power Pane

The CRM Power Pane is a helper tool designed to integrate with Microsoft Dynamics 365 application and allow you to manipulate forms or perform actions faster throughout the Microsoft Dynamics 365 application.

*Disclaimer: This is as unsupported as it gets.*

## Usage
Click the CRM Power Pane icon next to the Microsoft Dynamics 365 logo, and select your action.

![CRM Power Pane Usage](./docs/assets/usage.png)

## Install

### Google Chrome
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/eadknamngiibbmjdfokmppfooolhdidc.svg)](https://chrome.google.com/webstore/detail/dynamics-crm-power-pane/eadknamngiibbmjdfokmppfooolhdidc)
[![Chrome Web Store - Users](https://img.shields.io/chrome-web-store/users/eadknamngiibbmjdfokmppfooolhdidc.svg)](https://chrome.google.com/webstore/detail/dynamics-crm-power-pane/eadknamngiibbmjdfokmppfooolhdidc)
[![Chrome Web Store - Rating](https://img.shields.io/chrome-web-store/rating/eadknamngiibbmjdfokmppfooolhdidc.svg)](https://chrome.google.com/webstore/detail/dynamics-crm-power-pane/eadknamngiibbmjdfokmppfooolhdidc/reviews)
[![Chrome Web Store - Reviews](https://img.shields.io/chrome-web-store/rating-count/eadknamngiibbmjdfokmppfooolhdidc.svg)](https://chrome.google.com/webstore/detail/dynamics-crm-power-pane/eadknamngiibbmjdfokmppfooolhdidc/reviews)

[![Dynamics CRM Power Pane on Chrome Web Store](./docs/assets/chrome-web-store-badge.png)](https://chrome.google.com/webstore/detail/dynamics-crm-power-pane/eadknamngiibbmjdfokmppfooolhdidc)

### Mozilla Firefox
[![Mozilla Add-on](https://img.shields.io/amo/v/dynamics-crm-power-pane.svg)](https://addons.mozilla.org/en-US/firefox/addon/dynamics-crm-power-pane/)
[![Mozilla Add-on - Users](https://img.shields.io/amo/users/dynamics-crm-power-pane.svg)](https://addons.mozilla.org/en-US/firefox/addon/dynamics-crm-power-pane/)
[![Mozilla Add-on - Rating](https://img.shields.io/amo/rating/dynamics-crm-power-pane.svg)](https://addons.mozilla.org/en-US/firefox/addon/dynamics-crm-power-pane/reviews/)

[![Dynamics CRM Power Pane on Mozilla Add-Ons](./docs/assets/firefox-addon.png)](
https://addons.mozilla.org/en-US/firefox/addon/dynamics-crm-power-pane)

## Build and Run

To build the repository, you need to have Node.js and `npm` installed.

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run build-chrome` to build for Google Chrome.
4. Run `npm run build-firefox` to build for Mozilla Firefox.
5. Run `npm run build-edge` to build for Microsoft Edge (experimental).
6. Alternatively, run `npm run build-all` to build for all three browsers. This script executes the former three scripts sequentially, provided as a shorthand.

The extensions will be built under `./dist/chrome/`, `./dist/firefox/` and `./dist/edge/` directories respectively.

## Contribute

All contributions are welcome. Please take a look at the [contributing guidelines](./.github/CONTRIBUTING.md) and [code of conduct](./.github/CODE_OF_CONDUCT.md) for more information.
