var app;

app = angular.module("testApp", []);

app.run(function($rootScope) {
  $rootScope.model = {};
  $rootScope.model.variable = "Hello";
});

app.controller("MainCtrl", function($scope) {
  $scope.changeVal = function() {
    return $scope.model.variable += " test";
  };
});

//# sourceMappingURL=maps/test.js.map