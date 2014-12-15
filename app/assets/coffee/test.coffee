app = angular.module "testApp", []

app.run ($rootScope) ->
  $rootScope.model = {}
  $rootScope.model.variable = "Hello"
  return

app.controller "MainCtrl", ($scope) ->
  $scope.changeVal = () ->
    $scope.model.variable += " test"

  return
