app.directive("balancer", function() {
  return {
    restrict: "A",
    templateUrl: "template.html",
    transclude: true,
    scope: {
      items: "="
    },
    controller: function($scope, defaultSum) {
      $scope.indexOfChanged = null;
      $scope.findSum = function() {
        var item, sum, _i, _len, _ref;
        sum = 0;
        _ref = $scope.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          sum += item.percent;
        }
        return sum;
      };
      $scope.findDiff = function() {
        var diff, sum;
        sum = $scope.findSum();
        diff = parseFloat(defaultSum - sum);
        return diff;
      };
      $scope.spliceItem = function(items, spliceItem) {
        var newArray;
        newArray = [];
        angular.forEach(items, function(item) {
          if (spliceItem.name !== item.name && !item.blocked) {
            return newArray.push(item);
          }
        });
        return newArray;
      };
      $scope.findMax = function() {
        var items, max;
        items = $scope.spliceItem($scope.items, $scope.items[$scope.indexOfChanged]);
        max = items[0];
        angular.forEach(items, function(item) {
          if (item.percent > max.percent) {
            return max = item;
          }
        });
        return max;
      };
      $scope.findMin = function() {
        var items, min;
        items = $scope.spliceItem($scope.items, $scope.items[$scope.indexOfChanged]);
        min = items[0];
        angular.forEach(items, function(item) {
          if (item.percent < min.percent) {
            return min = item;
          }
        });
        return min;
      };
      $scope.increasePercent = function(item, min, diffVal) {
        console.log("max decrease", min);
        console.log("diff", diffVal);
        if (item.name === min.name) {
          item.percent += diffVal;
          if (item.percent > 100) {
            return item.percent = 100;
          }
        }
      };
      $scope.decreasePercent = function(item, max, diffVal) {
        console.log("max decrease", max);
        console.log("diff", diffVal);
        if (item.name === max.name) {
          item.percent += diffVal;
          if (item.percent < 0) {
            return item.percent = 0;
          }
        }
      };
      $scope.balance = function(index) {
        var diffVal, item, items, length, max, min, notBlocked, _i, _j, _len, _len1;
        $scope.indexOfChanged = index;
        items = _.clone($scope.items);
        notBlocked = $scope.spliceItem($scope.items, $scope.items[$scope.indexOfChanged]);
        length = items.length;
        diffVal = $scope.findDiff();
        if (length > 1 && notBlocked.length >= 1) {
          if (diffVal > 0) {
            min = $scope.findMin();
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              $scope.increasePercent(item, min, diffVal);
            }
          }
          if (diffVal < 0) {
            max = $scope.findMax();
            for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
              item = items[_j];
              $scope.decreasePercent(item, max, diffVal);
            }
          }
        }
        return $scope.items = _.clone(items);
      };
      $scope.findCurrentSum = function(items) {
        var item, sum, _i, _len;
        sum = 0;
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          sum += item.percent;
        }
        return sum;
      };
      $scope.findMinVal = function(item) {
        var items, min, notBlocked;
        if (item !== void 0 && item.blocked) {
          return;
        }
        min = 0;
        notBlocked = [];
        items = _.clone($scope.items);
        angular.forEach(items, function(item) {
          if (!item.blocked) {
            notBlocked.push(item);
          }
          if (notBlocked.length === 1 && items.length > 1) {
            return notBlocked[0].percent;
          }
        });
        return min;
      };
      return $scope.findMaxVal = function(item) {
        var items, max;
        if (item !== void 0 && item.blocked) {
          return;
        }
        items = _.clone($scope.items);
        max = 100;
        angular.forEach(items, function(item) {
          if (item.blocked) {
            return max -= item.percent;
          }
        });
        return max;
      };
    }
  };
});


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

app.directive("integer", function() {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ctrl) {
      if (ctrl == null) {
        return;
      }
      ctrl.$parsers.push(function(value) {
        if (value > 100) {
          return 100;
        }
        if (value < 0) {
          return 0;
        }
        if ((0 <= value && value <= 100)) {
          return Number(value);
        }
      });
      ctrl.$formatters.unshift(function(value) {
        value = value.replace(/,/, ".");
        value = parseFloat(value).toFixed(2);
        return value;
      });
      return ctrl.$formatters.push(function(value) {
        return value;
      });
    }
  };
});

//# sourceMappingURL=maps/directives.js.map