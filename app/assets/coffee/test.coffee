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

# TODO show float precision (toFixed or something else)
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

# MainCtrl
# use common sum
# use ng-change
app.controller "MainCtrl", ($scope, $window, defaultSum) ->
  $scope.model = []
  $scope.diff = null
  $scope.defSum = defaultSum
  $window.model = $scope.model

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

  findDonor = ->
    donor = _.min(
      $scope.model
    ,
      (item) ->
        item.percent
    )
    donor


  modItem = (item) ->
    item["blocked"] = false
    item["getPercent"] = ->
      @percent
    item["setPercent"] = (points)->
      @percent = parseFloat(points)
      @percent
    item["incPercent"] = (points)->
      @percent += parseFloat(points)
      @percent
    item["decPercent"] = (points)->
      @percent -= parseFloat(points)
      @percent
    item

  data =
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

  zeroCounter = 0
  zeroCompute = (item) ->
    zeroCounter = 1 if item.percent != 0
    modItem(item)
    return item

  $scope.model.push(zeroCompute i) for i in data.items

  $scope.model[0].percent = 100 if zeroCounter == 0

  $scope.dirtySum = sumCompute($scope.model)

  $scope.balance = () ->
    donor = do findDonor
    $scope.dirtySum = sumCompute($scope.model)
    $scope.diff = $scope.defSum - $scope.dirtySum
    console.log "donor ", donor
    donor.setPercent($scope.diff)
    console.log "donor ", donor
    $scope.dirtySum = sumCompute($scope.model)
    return

  $scope.dec = (item) ->
    item.decPercent(1)
    do $scope.balance

  $scope.inc = (item) ->
    item.incPercent(1)
    do $scope.balance

  $scope.set = (item, percent) ->
    item.setPercent(percent)
    do $scope.balance

  return
