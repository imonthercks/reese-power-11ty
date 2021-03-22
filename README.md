# Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/fbf47351-bb04-46bf-9d55-3b34a176d964/deploy-status)](https://app.netlify.com/sites/objective-hypatia-9555fe/deploys)

# Reese Power Website on 11ty

> Based on the 11ty Netlify Jumpstart created by Stephanie Eckles ([@5t3ph](https://twitter.com/5t3ph))

Visit [11ty-netlify-jumpstart.netlify.app](https://11ty-netlify-jumpstart.netlify.app/) for all the feature details - or go ahead and [generate a new repo from the template](https://github.com/5t3ph/11ty-netlify-jumpstart/generate) to view the information locally.

## Quick Start

### Getting dev environment up and running

Ensure you have a recent version of NodeJS (currently using v13.12.0)

1. Clone this git repo

1. Once cloned, run `npm install` to install 11ty and other dependencies. Then run `npm start` to run both 11ty and sass in watch
   mode. Use `npm run build` to run a production version, which will also generate social share
   preview images.

### Commonly used directories and files
**`src/_data`** - contains javascript files that interact with the Contentful APIs to pull in content and media.

**`src/_includes`** - contains the following templates

`base.njk` - common template with base html including the head tag with stylesheet and script references

`home.njk` - home page

`sitenav.njk` - template that is added to every page that depends on the page.njk template.  Adds common navigation to all njk files in the pages directory

`page.njk` - template used by most pages on the site that adds header information to the top of the page based the on attributes in file header

For standalone content pages, you can populate the following attributes in the njk file header:
```
title: Some title for the page
description: Some description for the page
```

For pages with a pagination attribute in the header that generate multiple pages for a data collection, you can provide dynamically generated page headers with the following attributes in the njk file header
```
renderData:
  title: "{{ some value }}"
  description: "{{ another value }}"
```

**`src/images`** - contains static images used by the site such as the logo

**`src/pages`** - contains content pages

Some pages like `event.njk` and `teammate.njk` are templates that are rendered for each item in a data collection

Other pages like `shirts.njk` and `masks.njk` are standalone content pages

**`src/sass`** - SASS files to generate CSS for site styling

**`eleventy.js`** - javascript file to configure 11ty build

**`contentful.http`** - Some common API calls that are made to contentful

**`netlify.toml`** - Netlify build configuration


## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080

**`npm run build`**

> Production build includes minified, autoprefixed CSS and social preview image generation

Use this as the "Publish command" if needed by hosting such as Netlify.
