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

# TODO show float precision (toFixed or something else)
# TODO use on blur
app.directive "commaDetect", ($log) ->
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
app.controller "MainCtrl", ($scope, $window) ->
  $scope.model = []
  $scope.diff = null
  $window.model = $scope.model

  sumCompute = (items) ->
    sum = _.reduce( items,
                    (memo, item)->
                      return memo+item.percent
                    , 0
                  )
    sum


  watchIniter = (item) ->
    $scope.$watch(
      () ->
        item
    ,
      (newV,oldV) ->
        console.log "init"
        console.log "nV", newV
        console.log "oV", oldV
    ,
      true
    )

  findDelta = (grt, lss) ->
    return grt - lss

  modItem = (item) ->
    item["getPercent"] = ->
      return @percent
    item["incPercent"] = (points)->
      return @percent+points
    item["decPercent"] = (points)->
      return @percent-points
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

  for item in $scope.model
    watchIniter(item)

  $scope.dec = (item) ->
    item.decPercent(1)

  $scope.inc = (item) ->
    item.incPercent(1)

  return
