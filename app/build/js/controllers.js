app.controller("MainCtrl", function($scope, $window, defaultSum, Data) {
  var analiseData, loadData, modItem, normalizeData, resolveProportion, sumCompute;
  $scope.model = [];
  $window.model = $scope.model;
  $scope.currentData = [];
  $scope.currentSum = null;
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
    $scope.currentData = angular.copy(dataType.items);
    $scope.model = [];
    _ref = dataType.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push($scope.model.push(modItem(i)));
    }
    return _results;
  };
  analiseData = function() {
    var length, sum;
    if (_.isEmpty($scope.model)) {
      return;
    }
    length = $scope.model.length;
    sum = sumCompute($scope.model);
    switch (false) {
      case !(sum === 0 || length === 1):
        return $scope.model[0].percent = 100;
      case !((0 < sum && sum < 100) || sum > 100):
        return normalizeData($scope.model, sum);
    }
  };
  $scope.init = function(dataType) {
    loadData(dataType);
    return analiseData();
  };
  $scope.setDataNull = function() {
    return $scope.init(Data.dataNull);
  };
  $scope.setDataNorm = function() {
    return $scope.init(Data.dataNorm);
  };
  $scope.setDataBig = function() {
    return $scope.init(Data.dataBig);
  };
  $scope.setDataSmall = function() {
    return $scope.init(Data.dataSmall);
  };
  $scope.setDataOnce = function() {
    return $scope.init(Data.dataOnce);
  };
  $scope.setDataTwice = function() {
    return $scope.init(Data.dataTwice);
  };
  $scope.$watch(function() {
    return $scope.model;
  }, function() {
    return $scope.currentSum = sumCompute($scope.model);
  });
});

app.controller("BalancerCtrl", function($scope, defaultSum) {
  $scope.indexOfChanged = null;
  $scope.setZero = function() {
    var item, _i, _len, _ref, _results;
    _ref = $scope.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.percent !== 100) {
        _results.push(item.percent = 0);
      }
    }
    return _results;
  };
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
    if (item.name === min.name) {
      item.percent += diffVal;
      if (item.percent > 100) {
        return item.percent = 100;
      }
    }
  };
  $scope.decreasePercent = function(item, max, diffVal) {
    if (item.name === max.name) {
      item.percent += diffVal;
      if ($scope.items[$scope.indexOfChanged].percent === 100) {
        $scope.setZero();
      }
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
    diffVal = parseFloat(diffVal.toFixed(2));
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
    return;
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
  $scope.findMaxVal = function(item) {
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
});

//# sourceMappingURL=maps/controllers.js.map