app = angular.module "testApp", []

###
# fix https://github.com/angular/angular.js/issues/9269
###
app.directive "rangeParser", () ->
  return {
    restrict: "A"
    require: "ngModel"
    link: (scope, element, attr, ctrl) ->
      return unless ctrl?
      ctrl.$parsers.push( (value) ->
        val = Number(value)
        val = null if val != val
        return val
      )
  }

app.constant "defaultSum", 100

# TODO show float precision (use Math lib or something else)
# TODO manage old values for save value if letter char input
app.directive "commaDetect", () ->
  return {
    restrict: "A"
    require: "ngModel"
    link: (scope, element, attr, ctrl) ->
      return unless ctrl?
      oldV = null

      check = (value) ->
        return unless value?
        return if parseInt(value) > 100
        return if value.match(/^\-/)
        return if value.match(/[a-zA-Z]/)
        if value.match(/\.$/)
          oldV = parseInt(value)
        else
          oldV = null

        tVal = value.replace(/,/g,".")

        if tVal != value
          ctrl.$setViewValue tVal
          ctrl.$render()

        if oldV?
          value = oldV
        else
          value = tVal

        value

      ctrl.$parsers.push check
  }

app.service "Data", ->
  @dataNull =
    items: [
      name: "item1"
      percent: 0
    ,
      name: "item2"
      percent: 0
    ,
      name: "item3"
      percent: 0
    ]
  @dataNorm =
    items: [
      name: "item1"
      percent: 60
    ,
      name: "item2"
      percent: 10
    ,
      name: "item3"
      percent: 30
    ]
  @dataBig =
    items: [
      name: "item1"
      percent: 70
    ,
      name: "item2"
      percent: 30
    ,
      name: "item3"
      percent: 80
    ,
      name: "item4"
      percent: 100
    ]
  @dataSmall =
    items: [
      name: "item1"
      percent: 10
    ,
      name: "item2"
      percent: 20
    ,
      name: "item3"
      percent: 30
    ]
  @dataOnce =
    items: [
      name: "item1"
      percent: 140
    ]
  @dataTwice =
    items: [
      name: "item1"
      percent: 140
    ,
      name: "item2"
      percent: 90
    ]
  @

app.directive "balancer", () ->
  return {
    restrict: "A"
    templateUrl: "template.html",
    transclude: true
    scope: { items: "=" }
    controller: ($scope, defaultSum)->
      $scope.indexOfChanged = null

      $scope.findSum = ->
        sum = _.reduce(
          $scope.items
        ,
          (memo, item)->
            memo+item.percent
        ,
          0
        )
        sum

      $scope.findDiff = ->
        sum = do $scope.findSum
        diff = parseFloat defaultSum - sum
        diff

      $scope.removeChanged = (scpItems, index) ->
        if scpItems[index]
          items = _.clone scpItems
          items.splice index, 1
          items

      $scope.removeDisabled = (items) ->
        result = _.reject(
          items
        ,
          (item) ->
            item.blocked == true
        )
        result

      $scope.findAcceptor = (type) ->
        items = $scope.removeChanged $scope.items, $scope.indexOfChanged
        items = $scope.removeDisabled items

        if type == "min"
          acceptor = _.min(
            items
          ,
            (item) ->
              item.percent
          )
        else if type == "max"
          acceptor = _.max(
            items
          ,
            (item) ->
              item.percent
          )
        acceptor

      $scope.change = (index) ->
        $scope.indexOfChanged = index

      $scope.increasePercent = (item, acceptor, diffVal) ->
        if item.name == acceptor.name
          item.percent += diffVal

          if item.percent > 100
            item.percent = 100
            do $scope.balance

      $scope.decreasePercent = (item, acceptor, diffVal) ->
        if item.name == acceptor.name
          item.percent -= Math.abs diffVal

          if item.percent < 0
            item.percent = 0
            do $scope.balance

      $scope.balance = ->
        items = _.clone $scope.items
        length = items.length
        diffVal = do $scope.findDiff

        if length > 1
          if diffVal > 0
            acceptor = $scope.findAcceptor("min")
            ($scope.increasePercent item, acceptor, diffVal) for item in items

          if diffVal < 0
            acceptor = $scope.findAcceptor("max")
            ($scope.decreasePercent item, acceptor, diffVal) for item in items

        $scope.items = _.clone items

      $scope.findCurrentSum = (items) ->
        sum = _.reduce(
          items
        ,
          (memo, item)->
            memo+item.percent
        ,
          0
        )
        sum

      $scope.findMinVal = () ->
        return 0

      $scope.findMaxVal = () ->
        items = _.clone $scope.items
        items = $scope.removeDisabled items
        unless items.length == $scope.items.length
          maxVal = defaultSum - $scope.findCurrentSum items
        else
          maxVal = defaultSum
        maxVal

      $scope.checkCount = ->
        scpILength = $scope.items.length
        return true if scpILength == 1 or scpILength == 2

      $scope.checkChange = (index) ->
        items = _.clone $scope.items
        items = $scope.removeDisabled items
        $scope.items[index].blocked = false if ($scope.items.length - items.length) > 2

#      $scope.dec = (index) ->
#        $scope.change index
#
#      $scope.inc = (index) ->
#        $scope.change index

      $scope.$watch(
        ->
          $scope.items
      ,
        ->
          do $scope.balance
      ,
        true
      )
  }
# MainCtrl
app.controller "MainCtrl", ($scope, $window, defaultSum, Data) ->
  $scope.model = []
  $window.model = $scope.model
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
    item["getPercent"] = ->
      @percent
    item["setPercent"] = (points, type)->
      if points == 1 or points == -1 or type == "append"
        @percent += parseFloat(points)
      else
        @percent = parseFloat(points)
      @percent
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
