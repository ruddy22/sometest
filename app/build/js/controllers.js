app.controller("MainCtrl", function($scope, $window, defaultSum, Data) {
  var analiseData, loadData, modItem, normalizeData, resolveProportion, sumCompute;
  $scope.model = [];
  $window.model = $scope.model;
  $scope.currentData = [];
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
});

//# sourceMappingURL=maps/controllers.js.map