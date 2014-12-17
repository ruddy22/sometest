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
        if (parseInt(value) > 100) {
          return;
        }
        if (value.match(/^\-/)) {
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
          value = oldV;
        } else {
          value = tVal;
        }
        return value;
      };
      return ctrl.$parsers.push(check);
    }
  };
});

app.controller("MainCtrl", function($scope, $window) {
  var data, findDelta, i, item, modItem, sumCompute, watchIniter, zeroCompute, zeroCounter, _i, _j, _len, _len1, _ref, _ref1;
  $scope.model = [];
  $scope.diff = null;
  $window.model = $scope.model;
  sumCompute = function(items) {
    var sum;
    sum = _.reduce(items, function(memo, item) {
      return memo + item.percent;
    }, 0);
    return sum;
  };
  watchIniter = function(item) {
    return $scope.$watch(function() {
      return item;
    }, function(newV, oldV) {
      console.log("init");
      console.log("nV", newV);
      return console.log("oV", oldV);
    }, true);
  };
  findDelta = function(grt, lss) {
    return grt - lss;
  };
  modItem = function(item) {
    item["getPercent"] = function() {
      return this.percent;
    };
    item["incPercent"] = function(points) {
      return this.percent + points;
    };
    item["decPercent"] = function(points) {
      return this.percent - points;
    };
    return item;
  };
  data = {
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
  zeroCounter = 0;
  zeroCompute = function(item) {
    if (item.percent !== 0) {
      zeroCounter = 1;
    }
    modItem(item);
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
  _ref1 = $scope.model;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    item = _ref1[_j];
    watchIniter(item);
  }
  $scope.dec = function(item) {
    return item.decPercent(1);
  };
  $scope.inc = function(item) {
    return item.incPercent(1);
  };
});

//# sourceMappingURL=maps/test.js.map