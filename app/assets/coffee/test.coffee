app = angular.module "testApp", []

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

app.controller "MainCtrl", ($scope, $window) ->
  $scope.model = {}
  $window.model = $scope.model

  $scope.data =
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

  $scope.model = $scope.data.items
  console.log $scope.model

  $scope.changeVal = (item)->
    console.log item
    return

  return
