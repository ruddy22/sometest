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

app.directive "commaDetect", ($log) ->
  return {
    restrict: "A"
    require: "ngModel"
    link: (scope, element, attr, ctrl) ->
      return unless ctrl?
      oldV = null

      check = (value) ->
        return unless value?
        if value.match(/\.$/)
          oldV = parseInt(value)
        else
          oldV = null

        tVal = value.replace(/,/g,".")

        if tVal != value
          ctrl.$setViewValue tVal
          ctrl.$render()

        if oldV?
          return oldV
        else
          return tVal

      ctrl.$parsers.push check
  }

# MainCtrl
app.controller "MainCtrl", ($scope, $window) ->
  $scope.model = []
  $window.model = $scope.model

  data =
    items: [
      name: "item1"
      percent: 0
    ,
      name: "item2"
      percent: 0
    ]

  zeroCounter = 0
  zeroCompute = (item) ->
    zeroCounter = 1 if item.percent != 0
    return item

  $scope.model.push(zeroCompute i) for i in data.items

  $scope.model[0].percent = 100 if zeroCounter == 0

  sumCompute = (items) ->
    sum = _.reduce( items,
                    (memo, item)->
                      return memo+item.percent
                    , 0
                  )
    return sum

  return
