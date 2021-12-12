# Usage

## Set Your Environment

Copy `.env.example` into `.env` and set your own config

## Install Dependencies

    npm install

## First time

    npm run setup

Installs dependencies, runs `build` to generate Babel's compilation, runs `initDB` to setup DB and runs `npm start` to start development

## Set Initial DB

    npm run initDB

Drops Adverts DB and loads placeholder data from `initialAdverts.json`

## Dev Start

    npm start

---

## API Routes

## GET

    /api/adverts

Returns all the adverts

    /api/adverts/?someFilters

Returns a filtered list. Admits filter by fields, sorting, skipping and limit reuslts. E.g:

` /api/adverts/?select=name price -_id&name=Bicicleta&sort=-name price`

## POST

    /api/adverts

Create a new advert

## PUT

    /api/adverts/id

Updates the match ID element

## DELETE

    /api/adverts/id

Deletes the match ID element
