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
        if (value.match(/[a-zA-Z]/)) {
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

app.service("Data", function() {
  this.dataNull = {
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
  this.dataNorm = {
    items: [
      {
        name: "item1",
        percent: 60
      }, {
        name: "item2",
        percent: 10
      }, {
        name: "item3",
        percent: 30
      }
    ]
  };
  this.dataBig = {
    items: [
      {
        name: "item1",
        percent: 70
      }, {
        name: "item2",
        percent: 30
      }, {
        name: "item3",
        percent: 80
      }
    ]
  };
  this.dataSmall = {
    items: [
      {
        name: "item1",
        percent: 10
      }, {
        name: "item2",
        percent: 20
      }, {
        name: "item3",
        percent: 30
      }
    ]
  };
  return this;
});

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
        var sum;
        sum = _.reduce($scope.items, function(memo, item) {
          return memo + item.percent;
        }, 0);
        return sum;
      };
      $scope.findDiff = function() {
        var diff, sum;
        sum = $scope.findSum();
        diff = parseFloat(defaultSum - sum);
        return diff;
      };
      $scope.removeChanged = function(scpItems, index) {
        var items;
        if (scpItems[index]) {
          items = _.clone(scpItems);
          items.splice(index, 1);
          return items;
        }
      };
      $scope.removeDisabled = function(items) {
        var result;
        result = _.reject(items, function(item) {
          return item.blocked === true;
        });
        return result;
      };
      $scope.findAcceptor = function(type) {
        var acceptor, items;
        items = $scope.removeChanged($scope.items, $scope.indexOfChanged);
        items = $scope.removeDisabled(items);
        if (type === "min") {
          acceptor = _.min(items, function(item) {
            return item.percent;
          });
        } else if (type === "max") {
          acceptor = _.max(items, function(item) {
            return item.percent;
          });
        }
        return acceptor;
      };
      $scope.change = function(index) {
        return $scope.indexOfChanged = index;
      };
      $scope.increasePercent = function(item, acceptor, diffVal) {
        if (item.name === acceptor.name) {
          item.percent += diffVal;
          if (item.percent > 100) {
            item.percent = 100;
            return $scope.balance();
          }
        }
      };
      $scope.decreasePercent = function(item, acceptor, diffVal) {
        if (item.name === acceptor.name) {
          item.percent -= Math.abs(diffVal);
          if (item.percent < 0) {
            item.percent = 0;
            return $scope.balance();
          }
        }
      };
      $scope.balance = function() {
        var acceptor, diffVal, item, items, length, _i, _j, _len, _len1;
        items = _.clone($scope.items);
        length = items.length;
        diffVal = $scope.findDiff();
        if (length > 1) {
          if (diffVal > 0) {
            acceptor = $scope.findAcceptor("min");
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              $scope.increasePercent(item, acceptor, diffVal);
            }
          }
          if (diffVal < 0) {
            acceptor = $scope.findAcceptor("max");
            for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
              item = items[_j];
              $scope.decreasePercent(item, acceptor, diffVal);
            }
          }
        }
        return $scope.items = _.clone(items);
      };
      $scope.findCurrentSum = function(items) {
        var sum;
        sum = _._.reduce(items, function(memo, item) {
          return memo + item.percent;
        }, 0);
        return sum;
      };
      $scope.findMinVal = function() {
        return 0;
      };
      $scope.findMaxVal = function() {
        var items, maxVal;
        items = _.clone($scope.items);
        items = $scope.removeDisabled(items);
        maxVal = defaultSum - $scope.findCurrentSum(items);
        return maxVal;
      };
      $scope.dec = function() {
        return console.log("dec");
      };
      $scope.inc = function() {
        return console.log("inc");
      };
      return $scope.$watch(function() {
        return $scope.items;
      }, function() {
        return $scope.balance();
      }, true);
    }
  };
});

app.controller("MainCtrl", function($scope, $window, defaultSum, Data) {
  var analiseData, loadData, modItem, normalizeData, resolveProportion, sumCompute;
  $scope.model = [];
  $window.model = $scope.model;
  $scope.defSum = defaultSum;
  sumCompute = function(items) {
    var sum;
    sum = _.reduce(items, function(memo, item) {
      return memo + item.percent;
    }, 0);
    return sum;
  };
  modItem = function(item) {
    item["blocked"] = false;
    item["getPercent"] = function() {
      return this.percent;
    };
    item["setPercent"] = function(points, type) {
      if (points === 1 || points === -1 || type === "append") {
        this.percent += parseFloat(points);
      } else {
        this.percent = parseFloat(points);
      }
      return this.percent;
    };
    return item;
  };
  resolveProportion = function(percent, sum) {
    return Math.round(percent * defaultSum / sum);
  };
  normalizeData = function(data, sum) {
    return _.each(data, function(el) {
      return el.percent = resolveProportion(el.percent, sum);
    });
  };
  loadData = function(dataType) {
    var i, _i, _len, _ref, _results;
    if (dataType == null) {
      dataType = Data.dataNull;
    }
    _ref = dataType.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push($scope.model.push(modItem(i)));
    }
    return _results;
  };
  analiseData = function() {
    var sum;
    sum = sumCompute($scope.model);
    switch (false) {
      case sum !== 0:
        return $scope.model[0].percent = 100;
      case !((0 < sum && sum < 100) || sum > 100):
        return normalizeData($scope.model, sum);
    }
  };
  loadData(Data.dataNorm);
  analiseData();
});

//# sourceMappingURL=maps/test.js.map