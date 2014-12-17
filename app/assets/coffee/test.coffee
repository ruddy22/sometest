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
  @

# MainCtrl
# use common sum
# use ng-change
app.controller "MainCtrl", ($scope, $window, defaultSum, Data) ->
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
      if points == 1
        @percent += parseFloat(points)
      else
        @percent = parseFloat(points)
      @percent
    item["incPercent"] = (points)->
      @percent += parseFloat(points)
      @percent
    item["decPercent"] = (points)->
      @percent -= parseFloat(points)
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
    $scope.model.push(modItem i) for i in dataType.items

  analizeData = ->
    sum = sumCompute($scope.model)
    switch
      when sum == 0   then $scope.model[0].percent = 100
      when 0 < sum < 100 or sum > 100 then normalizeData($scope.model, sum)

  loadData Data.dataSmall
  do analizeData

  $scope.dirtySum = sumCompute($scope.model)

  $scope.balance = () ->
    donor = do findDonor
    $scope.dirtySum = sumCompute($scope.model)
    $scope.diff = $scope.defSum - $scope.dirtySum
#    console.log "donor ", donor
    donor.setPercent($scope.diff)
#    console.log "donor ", donor
    $scope.dirtySum = sumCompute($scope.model)
    return

  $scope.dec = (item) ->
    item.decPercent(1)
    do $scope.balance

  $scope.inc = (item) ->
    item.incPercent(1)
    do $scope.balance

  $scope.set = (item, percent = 1) ->
    console.log item, percent
    item.setPercent(percent)
    do $scope.balance

  return
