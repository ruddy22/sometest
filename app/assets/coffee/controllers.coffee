app.controller "MainCtrl", ($scope, $window, defaultSum, Data) ->
  $scope.model = []
  $window.model = $scope.model
  $scope.currentData = []
  $scope.currentSum = null
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

  $scope.$watch(
    ->
      $scope.model
  ,
    ->
      $scope.currentSum = sumCompute($scope.model)
  )
  return

app.controller "BalancerCtrl", ($scope, defaultSum) ->
  $scope.indexOfChanged = null

  $scope.setZero = ->
    item.percent = 0 for item in $scope.items when item.percent != 100

  $scope.findSum = ->
    sum = 0
    (sum += item.percent) for item in $scope.items
    sum

  $scope.findDiff = ->
    sum = do $scope.findSum
    diff = parseFloat defaultSum - sum
    diff

  $scope.spliceItem = (items, spliceItem) ->
    newArray = []
    angular.forEach(
      items
    ,
      (item) ->
        if spliceItem.name != item.name && !item.blocked
          newArray.push item
    )
    newArray

  $scope.findMax = ->
    items = $scope.spliceItem $scope.items, $scope.items[$scope.indexOfChanged]
    max = items[0]
    angular.forEach(
      items
    ,
      (item)->
        if item.percent > max.percent
          max = item
    )
    max

  $scope.findMin = ->
    items = $scope.spliceItem $scope.items, $scope.items[$scope.indexOfChanged]
    min = items[0]
    angular.forEach(
      items
    ,
      (item)->
        if item.percent < min.percent
          min = item
    )
    min

  $scope.increasePercent = (item, min, diffVal) ->
    if item.name == min.name
      item.percent += diffVal

      if item.percent > 100
        item.percent = 100

  $scope.decreasePercent = (item, max, diffVal) ->
    if item.name == max.name
      item.percent += diffVal

      if $scope.items[$scope.indexOfChanged].percent == 100
        do $scope.setZero

      if item.percent < 0
        item.percent = 0

  $scope.balance = (index)->
    $scope.indexOfChanged = index
    items = _.clone $scope.items
    notBlocked = $scope.spliceItem $scope.items, $scope.items[$scope.indexOfChanged]
    length = items.length
    diffVal = do $scope.findDiff
    diffVal = parseFloat diffVal.toFixed(2)

    if length > 1  and notBlocked.length >= 1
      if diffVal > 0
        min = do $scope.findMin
        ($scope.increasePercent item, min, diffVal) for item in items

      if diffVal < 0
        max = do $scope.findMax
        ($scope.decreasePercent item, max, diffVal) for item in items

    return

    $scope.items = _.clone items

  $scope.findCurrentSum = (items) ->
    sum = 0
    (sum += item.percent) for item in items
    sum

  $scope.findMinVal = (item) ->
    return if item != undefined && item.blocked
    min = 0
    notBlocked = []
    items = _.clone $scope.items
    angular.forEach(
      items
    ,
      (item) ->
        if !item.blocked
          notBlocked.push item

        if notBlocked.length == 1 && items.length > 1
          return notBlocked[0].percent
    )
    min

  $scope.findMaxVal = (item) ->
    return if item != undefined && item.blocked
    items = _.clone $scope.items
    max = 100
    angular.forEach(
      items
    ,
      (item) ->
        if item.blocked
          max -= item.percent
    )
    max
  return
