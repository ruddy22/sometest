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
  var analizeData, findDonor, loadData, modItem, normalizeData, resolveProportion, sumCompute;
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
      if (points === 1) {
        this.percent += parseFloat(points);
      } else {
        this.percent = parseFloat(points);
      }
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
  analizeData = function() {
    var sum;
    sum = sumCompute($scope.model);
    switch (false) {
      case sum !== 0:
        return $scope.model[0].percent = 100;
      case !((0 < sum && sum < 100) || sum > 100):
        return normalizeData($scope.model, sum);
    }
  };
  loadData(Data.dataSmall);
  analizeData();
  $scope.dirtySum = sumCompute($scope.model);
  $scope.balance = function() {
    var donor;
    donor = findDonor();
    $scope.dirtySum = sumCompute($scope.model);
    $scope.diff = $scope.defSum - $scope.dirtySum;
    donor.setPercent($scope.diff);
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
    if (percent == null) {
      percent = 1;
    }
    console.log(item, percent);
    item.setPercent(percent);
    return $scope.balance();
  };
});

//# sourceMappingURL=maps/test.js.map