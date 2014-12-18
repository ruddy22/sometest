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
        if (!scpItems[index]) {
          items = _.clone(scpItems);
          return items.splice(index, 1);
        }
      };
      $scope.findAcceptor = function(type) {
        var acceptor, items;
        items = $scope.removeChanged($scope.items, $scope.indexOfChanged);
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
      $scope.dec = function() {
        return console.log("dec");
      };
      return $scope.inc = function() {
        return console.log("inc");
      };
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