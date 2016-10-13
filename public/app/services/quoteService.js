angular.module('quoteService', [])
    .factory('Quote', function($http){
        var quoteFactory = {};
        quoteFactory.create = function(quoteData){
            console.log(quoteData.name);
            return $http.post('/api/quote', quoteData);
        };
        return quoteFactory;
    });
