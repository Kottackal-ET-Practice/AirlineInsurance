// Controller for insurance tab
angular.module('insuranceCtrl', [])
    .controller('InsuranceController', function ($rootScope, $scope, $http) {
        console.log('insurance controller');
        $http.get('api/insured')
            .then(function (response) {
                $scope.content = response.data;
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.content.forEach(function (data) {
                    if ($rootScope.userDetails.username == data.name){
                        $scope.name= data.name;
                        return true;
                    }
                    else{
                        return false;
                    }
                });

            });        
    });