#Introduction

The Flight Delay application generates an insurance quote for a traveler who may be subjected to delay in the Flight. The traveler specifies his/her travel plan namely traveling city pair, number of travelers etc. The application then generates the quote based on the pre-defined business logic.


The application uses Weather data from 'OpenWeatherAPI' for finding the weather condition at the destination city. The quote will be calculated based on the business logic which takes into consideration the weather conditions and number of persons traveling. So if the weather is forecast to be rainy the business logic factors this, and the insurance quote would be a higher. If the insurance is for more than one traveler, then the insurance quote will include a discount.

Once the quote is generated, the traveler can also purchase this insurance through the application (this part will be included later).

The user will get a quote for travel insurance, by filling up a form on home page. The user can select the source and the corresponding destination from the dropdown menu and can select a date with in next 5 days. All the form details are sent to the quote API for getting corresponding weather conditions, and the quote generated is sent back to the user. The user can now apply for insurance if needed. Before applying for the insurance he needs to be registered. Registered user must be logged in to apply for the insurance. After applying for the insurance it can be viewed under the insurance tab of the user. 

## Quick Start

### Install dependencies:
```
$ npm install
$ bower install
```
### Start the server:
```
$ npm start
```
