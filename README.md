#Introduction

This application generates quote for user's delayed travel.The user needs to specify his/her travel details as input.The application processes the user's travel details for generating quote.Interested users can apply for insurance by creating their own account.
The application uses Weather API from 'OpenWeatherAPI' for finding the weather condition at the  user's destination.The quote will be calculated based on the weather conditions and number of persons. The quote amount is varied based on the severity of the weather condition. Also, the quote amount will be deducted based on the number of persons

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
