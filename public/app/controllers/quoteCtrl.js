angular.module('quoteCtrl', [])
    .controller('QuoteCreateController', function ($scope, $http, $filter, $rootScope, Auth) {
        $scope.quoteData = {};
        $scope.responseFlag = false;

        var sourceList = [{
            "id": 1,
            "place": "Trivandrum"
        }, {
            "id": 2,
            "place": "Banglore"
        }, {
            "id": 3,
            "place": "London"
        }, {
            "id": 4,
            "place": "Zurich"
        }]; //Option sources

        var destinationList = [{
            "id": 1,
            "place": "Mumbai",
            "sourceId": 1
        }, {
            "id": 2,
            "place": "Delhi",
            "sourceId": 1
        }, {
            "id": 3,
            "place": "Kochi",
            "sourceId": 2
        }, {
            "id": 4,
            "place": "Chennai",
            "sourceId": 2
        }, {
            "id": 5,
            "place": "Genneva",
            "sourceId": 3
        }, {
            "id": 6,
            "place": "Frankfut",
            "sourceId": 4
        }]; // Option destination

        $scope.sourceOptions = sourceList;
        $scope.destinationOptions = [];
        var num = 2;
        $scope.getDestination = function (source) {
            $scope.destinationOptions = ($filter('filter')(destinationList, {
                sourceId: source.id
            }));

        };
        // To add days
        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        };
        var currentDate = new Date(); //Get the currentdate
        var lastDate = new Date(); // For last date
        $scope.dates = {
            minDate: currentDate, // Minimum allowed date
            maxDate: lastDate.addDays(4) //maximum allowed date
        };
        $scope.quoteCreate = function () {
            $scope.total = '';
            $scope.responseFlag = false;
            var travelInfo = {
                'source': $scope.quoteData.source.place,
                'destination': $scope.quoteData.destination.place,
                'persons': $scope.quoteData.persons,
                'date': $filter('date')($scope.quoteData.date, 'yyyy-MM-dd'),
                'time': $filter('date')($scope.quoteData.time, 'HH:mm:ss')
            };

            $http({
                    method: 'POST',
                    url: '/api/quote',
                    data: {
                        'source': travelInfo.source,
                        'destination': travelInfo.destination,
                        'persons': travelInfo.persons,
                        'date': travelInfo.date,
                        'time': travelInfo.time
                    }


                }).success(function (data, status, headers, config) {
                    $scope.total = data.total;
                    $scope.responseFlag = data.success;
                })
                .error(function (data, status, headers, config) {

                    console.log(config);
                });
        };
        // Apply for insurance
        $scope.insuranceCreate = function () {
            var travelInfo = {
                'source': $scope.quoteData.source.place,
                'destination': $scope.quoteData.destination.place,
                'persons': $scope.quoteData.persons,
                'date': $filter('date')($scope.quoteData.date, 'yyyy-MM-dd'),
                'time': $filter('date')($scope.quoteData.time, 'HH:mm:ss'),
                'name':$rootScope.userDetails.username,
                'insured':'true'
            }; 
            $http({
                method: 'POST',
                url: '/api/insured',
                data: {
                    'source': travelInfo.source,
                    'destination': travelInfo.destination,
                    'persons': travelInfo.persons,
                    'date': travelInfo.date,
                    'time': travelInfo.time,
                    'name':travelInfo.name,
                    'insured':travelInfo.insured
                }
            });
        };
    });