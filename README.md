# Scape Weekly Performance Dashboard

A React + Vite dashboard for Scape's weekly leasing & marketing performance
reports (KPIs, pipeline, channels, cities, properties, traffic, insights).

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Data

Weekly reports ship as seed data in `src/data/seedReports.js`. New/edited
reports (via "+ New weekly report" or the tab edit icon) are persisted in
the browser's `localStorage`, so they survive reloads on the same device
but aren't shared across devices — use "Export JSON" to hand off a copy.

## Design notes

Chart colors follow a validated palette (see the dataviz method): pipeline
stages are encoded as an ordinal ramp (Discovery → Room Proposal → Tentative
Booking) plus two reserved status colors (Closed Won = good, Closed Lost =
critical) and a neutral for Waitlist — not arbitrary categorical hues, since
swapping stage order would change its meaning. Delta/status text colors are
darkened from the raw brand hex values where needed to clear WCAG AA text
contrast (4.5:1) against a white surface.
