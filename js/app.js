var app = angular.module('room', []);

<<<<<<< HEAD
app.controller('GreetingController', ['$scope', function($scope) {
  $scope.state = {
		curRoom: 1,
		item: [
			{id:"chave", where:"1", active:"true"},
			{id:"diamante", where:"2", active:"false"},
			{id:"bau", where:"2", active:"alwaysTrue"}
		]
=======
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
>>>>>>> master
	};
}]);