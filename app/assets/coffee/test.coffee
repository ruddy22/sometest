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
        unless scpItems[index]
          items = _.clone scpItems
          items.splice index, 1

      $scope.findAcceptor = (type) ->
        items = $scope.removeChanged $scope.items, $scope.indexOfChanged

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

      $scope.increasePercent = (item, acceptro, diffVal) ->
        if item.name == acceptor.name
          item.percent += diffVal

          if item.percent > 100
            item.percent = 100
            do $scope.balance

      $scope.decreasePercent = (item, acceptor, diffVal) ->
        if item.name == acceptor.name
          item.percent -= diffVal

          if item.percent < 0
            item.percent = 0
            do $scope.balance

      $scope.balance = ->
        items = _.clone $scope.items
        length = items.length
        diffVal = do $scope.findDiff

        if length > 1
          if diffVal > 0
            acceptor = $scope.findAcceptor("max")
            ($scope.increasePercent item, acceptor, diffVal) for item in items

          if diffVal < 0
            acceptor = $scope.findAcceptor("min")
            ($scope.decreasePercent item, acceptor, diffVal) for item in items

        $scope.items = _.clone items

      $scope.dec = () ->
        console.log "dec"

      $scope.inc = () ->
        console.log "inc"

      $scope.$watch(
        ->
          $scope.items
      ,
        ->
          console.log "init"
          do $scope.balance
      ,
        true
      )
#
#      $scope.dirtySum = sumCompute($scope.model)
#
#      $scope.set = (item, percent) ->
#        before = item.percent
#        console.log "before ", before
#        item.setPercent(percent)
#        after = item.percent
#        console.log "after ", after
#        if after > before
#          $scope.balance percent, "max"
#        else if after < before
#          $scope.balance percent, "min"
#        return
#
#
#      $scope.dec = (item) ->
#        unless item.percent == 0 or item == findAcceptor "min"
#          $scope.set(item, -1)
#
#      $scope.inc = (item) ->
#        unless item.percent == 100 or item == findAcceptor "max" # TODO change this range or use dirtysum
#          $scope.set(item, 1)
  }
# MainCtrl
# use common sum
# use ng-change
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
    $scope.model.push(modItem i) for i in dataType.items

  analiseData = ->
    sum = sumCompute($scope.model)
    switch
      when sum == 0   then $scope.model[0].percent = 100
      when 0 < sum < 100 or sum > 100 then normalizeData($scope.model, sum)

  loadData Data.dataNorm
  do analiseData

  return
