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
      ###
        try to use scope.$watch and $parsers
        http://jsfiddle.net/ZvdXp/6/
      ###
      scope.$watch('item.percent', (newV, oldV) ->
        ctrl.$parsers.unshift((value) ->
          console.log value
        )
      )
#      return unless ctrl?
#      ctrl.$parsers.push( (value) ->
#        return 11111111111
#        return "" if typeof value == "undefined"
#        tValue = value.replace(/,/g,'.');
#
#        if (tValue != value)
#          ctrl.$setViewValue(tValue);
#          ctrl.$render();
#        return tValue;
#      )
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
