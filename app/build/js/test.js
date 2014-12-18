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

app.controller("MainCtrl", function($scope, $window, defaultSum, Data) {
  var analiseData, findAcceptor, loadData, modItem, normalizeData, resolveProportion, sumCompute;
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
  findAcceptor = function(type) {
    var acceptor;
    if (type === "min") {
      acceptor = _.min($scope.model, function(item) {
        return item.percent;
      });
    } else if (type === "max") {
      acceptor = _.max($scope.model, function(item) {
        return item.percent;
      });
    }
    return acceptor;
  };
  loadData(Data.dataNorm);
  analiseData();
  $scope.dirtySum = sumCompute($scope.model);
  $scope.set = function(item, percent) {
    var after, before;
    before = item.percent;
    console.log("before ", before);
    item.setPercent(percent);
    after = item.percent;
    console.log("after ", after);
    if (after > before) {
      $scope.balance(percent, "max");
    } else if (after < before) {
      $scope.balance(percent, "min");
    }
  };
  $scope.balance = function(percent, type) {
    var acceptor;
    acceptor = findAcceptor(type);
    console.log("acceptor", acceptor);
    $scope.dirtySum = sumCompute($scope.model);
    $scope.diff = $scope.defSum - sumCompute($scope.model);
    acceptor.setPercent($scope.diff, "append");
    $scope.dirtySum = sumCompute($scope.model);
  };
  $scope.dec = function(item) {
    if (!(item.percent === 0 || item === findAcceptor("min"))) {
      return $scope.set(item, -1);
    }
  };
  $scope.inc = function(item) {
    if (!(item.percent === 100 || item === findAcceptor("max"))) {
      return $scope.set(item, 1);
    }
  };
});

//# sourceMappingURL=maps/test.js.map