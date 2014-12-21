app.controller "MainCtrl", ($scope, $window, defaultSum, Data) ->
  $scope.model = []
  $window.model = $scope.model
  $scope.currentData = []
  $scope.defSum = defaultSum

  sumCompute = (items) ->
    sum = _.reduce(
      items
    ,
      (memo, item)->
        memo+item.percent
    ,
      0
    )
    sum

  modItem = (item) ->
    item["blocked"] = false
    item

  resolveProportion = (percent, sum) ->
    return Math.round(percent*defaultSum/sum)

  normalizeData = (data, sum) ->
    _.each(
      data
    ,
      (el) ->
        el.percent = resolveProportion(el.percent, sum)
    )

  loadData = (dataType = Data.dataNull) ->
    $scope.currentData = angular.copy dataType.items
    $scope.model = []
    $scope.model.push(modItem i) for i in dataType.items

  analiseData = ->
    return if _.isEmpty $scope.model
    length = $scope.model.length
    sum = sumCompute($scope.model)
    switch
      when sum == 0 or length == 1    then $scope.model[0].percent = 100
      when 0 < sum < 100 or sum > 100 then normalizeData($scope.model, sum)

  $scope.init = (dataType)->
    loadData dataType
    do analiseData

  $scope.setDataNull = ->
    $scope.init Data.dataNull
  $scope.setDataNorm = ->
    $scope.init Data.dataNorm
  $scope.setDataBig = ->
    $scope.init Data.dataBig
  $scope.setDataSmall = ->
    $scope.init Data.dataSmall
  $scope.setDataOnce = ->
    $scope.init Data.dataOnce
  $scope.setDataTwice = ->
    $scope.init Data.dataTwice

  return
