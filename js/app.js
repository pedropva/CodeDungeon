var app = angular.module('room', []);

app.controller('GreetingController', ['$scope', function($scope) {
  $scope.state = {
		curRoom: 1,
		item: [
			{id:"chave", where:"1", active:"true"},
			{id:"diamante", where:"2", active:"false"},
			{id:"bau", where:"2", active:"alwaysTrue"}
		]
	};
}]);