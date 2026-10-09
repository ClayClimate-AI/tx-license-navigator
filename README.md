# Texas Second Chance License Navigator (HVAC)

A one page web app for people with a criminal record who are deciding whether an HVAC trade is worth training for. Pick a Texas TDLR license type (default `A/C Technician`) and a county, and the app shows how many people hold that license with that county listed as their business county. More holders usually means more shops and more hiring nearby. A count is not a job listing.


## Data source

TDLR All Licenses on data.texas.gov (Socrata dataset `7358-krk7`). No API key is needed.

```
https://data.texas.gov/resource/7358-krk7.json
```

Example queries (open them in a browser to check the app's numbers):

License types with holder counts:

```
https://data.texas.gov/resource/7358-krk7.json?$select=license_type,count(*) AS holders&$where=license_type IS NOT NULL&$group=license_type&$order=holders DESC&$limit=50
```

A/C Technician holders in Harris County:

```
https://data.texas.gov/resource/7358-krk7.json?$select=count(*) AS holders&$where=license_type='A/C Technician' AND business_county='HARRIS'
```

## Run it

Needs Node 20 or newer.

```
npm install
npm run dev
```

Then open http://localhost:5173.

## Privacy

Counts only. Every query uses only `license_type`, `business_county`, and `count(*)`. The app never requests, stores, logs, or shows names, addresses, phone numbers, license numbers, or any personal license record.

## Stack

React, Vite, and Tailwind CSS. The browser calls the public Socrata API directly. There is no server, database, or API key.

General information, not legal advice.
