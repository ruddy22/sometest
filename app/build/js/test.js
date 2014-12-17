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

app.constant("defaultSum", 100);

app.directive("commaDetect", function() {
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

app.controller("MainCtrl", function($scope, $window, defaultSum) {
  var data, findDonor, i, modItem, sumCompute, zeroCompute, zeroCounter, _i, _len, _ref;
  $scope.model = [];
  $scope.diff = null;
  $scope.defSum = defaultSum;
  $window.model = $scope.model;
  sumCompute = function(items) {
    var sum;
    sum = _.reduce(items, function(memo, item) {
      return memo + item.percent;
    }, 0);
    return sum;
  };
  findDonor = function() {
    var donor;
    donor = _.min($scope.model, function(item) {
      return item.percent;
    });
    return donor;
  };
  modItem = function(item) {
    item["blocked"] = false;
    item["getPercent"] = function() {
      return this.percent;
    };
    item["setPercent"] = function(points) {
      this.percent = parseFloat(points);
      return this.percent;
    };
    item["incPercent"] = function(points) {
      this.percent += parseFloat(points);
      return this.percent;
    };
    item["decPercent"] = function(points) {
      this.percent -= parseFloat(points);
      return this.percent;
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
  $scope.dirtySum = sumCompute($scope.model);
  $scope.balance = function() {
    var donor;
    donor = findDonor();
    $scope.dirtySum = sumCompute($scope.model);
    $scope.diff = $scope.defSum - $scope.dirtySum;
    console.log("donor ", donor);
    donor.setPercent($scope.diff);
    console.log("donor ", donor);
    $scope.dirtySum = sumCompute($scope.model);
  };
  $scope.dec = function(item) {
    item.decPercent(1);
    return $scope.balance();
  };
  $scope.inc = function(item) {
    item.incPercent(1);
    return $scope.balance();
  };
  $scope.set = function(item, percent) {
    item.setPercent(percent);
    return $scope.balance();
  };
});

//# sourceMappingURL=maps/test.js.map