var app;

app = angular.module("testApp", []);

app.directive("rangeParser", function($log) {
  return {
    require: "?ngModel",
    link: function(scope, element, attr, ctrl) {
      if (ctrl == null) {
        return;
      }
      return ctrl.$parsers.push(function(value) {
        var val;
        val = Number(value);
        if (val !== val) {
          val = null;
        }
        return val;
      });
    }
  };
});

app.controller("MainCtrl", function($scope, $window) {
  $scope.model = {};
  $window.model = $scope.model;
  $scope.data = {
    items: [
      {
        name: "item1",
        percent: 0
      }, {
        name: "item2",
        percent: 0
      }, {
        name: "item3",
        percent: 0
      }
    ]
  };
  $scope.model = $scope.data.items;
  console.log($scope.model);
  $scope.changeVal = function(item) {
    console.log(item);
  };
});

//# sourceMappingURL=maps/test.js.map