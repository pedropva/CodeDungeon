var app = angular.module('room', []);

app.controller('GreetingController', ['$scope', "$http", function($scope, $http) {
  $scope.state = {"employees":[
    {"firstName":"John", "lastName":"Doe"},
    {"firstName":"Anna", "lastName":"Smith"},
    {"firstName":"Peter", "lastName":"Jones"}
]};

	$scope.getData = function(){
		$http.get("meda.php")
		.success(function(data){
			alert(data);
			$scope.state = data;
		});
	}

	$scope.sendData = function(){
		$http.post("otro.php", {'state':$scope.state})
		.success(function(data){
			//alert(data);
		});
	}

	$scope.shout = function(stri){
		alert(stri);
	};
}]);