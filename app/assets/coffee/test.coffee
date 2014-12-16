app = angular.module "testApp", []

###
# fix https://github.com/angular/angular.js/issues/9269
###
app.directive "rangeParser", ($log) ->
  return {
    require: "?ngModel"
    link: (scope, element, attr, ctrl) ->
      return unless ctrl?
      ctrl.$parsers.push( (value) ->
        val = Number(value)
        val = null if val != val
        return val
      )
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
    ,
      name: "item3"
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

  console.log sumCompute $scope.model


  $scope.changeVal = (item)->
    console.log item
    return

  return
