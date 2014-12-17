var app;

app = angular.module("testApp", []);


/*
 * fix https://github.com/angular/angular.js/issues/9269
 */

app.directive("rangeParser", function() {
  return {
    restrict: "A",
    require: "ngModel",
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

app.directive("commaDetect", function($log) {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attr, ctrl) {
      var check, oldV;
      if (ctrl == null) {
        return;
      }
      oldV = null;
      check = function(value) {
        var tVal;
        if (value == null) {
          return;
        }
        if (value.match(/\.$/)) {
          oldV = parseInt(value);
        } else {
          oldV = null;
        }
        tVal = value.replace(/,/g, ".");
        if (tVal !== value) {
          ctrl.$setViewValue(tVal);
          ctrl.$render();
        }
        if (oldV != null) {
          return oldV;
        } else {
          return tVal;
        }
      };
      return ctrl.$parsers.push(check);
    }
  };
});

app.controller("MainCtrl", function($scope, $window) {
  var data, i, sumCompute, zeroCompute, zeroCounter, _i, _len, _ref;
  $scope.model = [];
  $window.model = $scope.model;
  data = {
    items: [
      {
        name: "item1",
        percent: 0
      }, {
        name: "item2",
        percent: 0
      }
    ]
  };
  zeroCounter = 0;
  zeroCompute = function(item) {
    if (item.percent !== 0) {
      zeroCounter = 1;
    }
    return item;
  };
  _ref = data.items;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    i = _ref[_i];
    $scope.model.push(zeroCompute(i));
  }
  if (zeroCounter === 0) {
    $scope.model[0].percent = 100;
  }
  sumCompute = function(items) {
    var sum;
    sum = _.reduce(items, function(memo, item) {
      return memo + item.percent;
    }, 0);
    return sum;
  };
});

//# sourceMappingURL=maps/test.js.map