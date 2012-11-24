Leaflet Pouch Demo
===
this is a demo app, data is from the list of [boston business permits](https://data.cityofboston.gov/Permitting/Active-Food-Establishment-Map/3a6m-dwve) and is in the form
```json
{
   "geometry": {
       "type": "Point",
       "coordinates": [
           -71.05528711242891,
           42.35909533818278
       ]
   },
   "type": "Feature",
   "properties": {
       "Business Name": "Zo",
       "Phone Number": "(617)901-6017",
       "Address": "92 State\nBOSTON, MA 02109",
       "License Added": "12/16/2011 09:44 AM",
       "License Status": "Active"
   }
}
```
you should be able to use [couchapp](http://couchapp.org/) or [erica](https://github.com/benoitc/erica) to get it into couch
