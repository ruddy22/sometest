app.directive "balancer", () ->
  return {
  restrict: "A"
  templateUrl: "template.html"
  transclude: true
  scope: { items: "=" }
  controller: ($scope, defaultSum)->
    $scope.indexOfChanged = null

    $scope.setZero = ->
      console.log "init"
      item.percent = 0 for item in $scope.items when item.percent != 100

    $scope.findSum = ->
      sum = 0
      (sum += item.percent) for item in $scope.items
      sum

    $scope.findDiff = ->
      sum = do $scope.findSum
      diff = parseFloat defaultSum - sum
      diff

    $scope.spliceItem = (items, spliceItem) ->
      newArray = []
      angular.forEach(
        items
      ,
        (item) ->
          if spliceItem.name != item.name && !item.blocked
            newArray.push item
      )
      newArray

    $scope.findMax = ->
      items = $scope.spliceItem $scope.items, $scope.items[$scope.indexOfChanged]
      max = items[0]
      angular.forEach(
        items
      ,
        (item)->
          if item.percent > max.percent
            max = item
      )
      max

    $scope.findMin = ->
      items = $scope.spliceItem $scope.items, $scope.items[$scope.indexOfChanged]
      min = items[0]
      angular.forEach(
        items
      ,
        (item)->
          if item.percent < min.percent
            min = item
      )
      min

    $scope.increasePercent = (item, min, diffVal) ->
      if item.name == min.name
        item.percent += diffVal

        if item.percent > 100
          item.percent = 100

    $scope.decreasePercent = (item, max, diffVal) ->
      if item.name == max.name
        item.percent += diffVal

        if $scope.items[$scope.indexOfChanged].percent == 100
          do $scope.setZero

        if item.percent < 0
          item.percent = 0

    $scope.balance = (index)->
      $scope.indexOfChanged = index
      items = _.clone $scope.items
      notBlocked = $scope.spliceItem $scope.items, $scope.items[$scope.indexOfChanged]
      length = items.length
      diffVal = do $scope.findDiff
      diffVal = parseFloat diffVal.toFixed(2)

      if length > 1  and notBlocked.length >= 1
        if diffVal > 0
          min = do $scope.findMin
          ($scope.increasePercent item, min, diffVal) for item in items

        if diffVal < 0
          max = do $scope.findMax
          ($scope.decreasePercent item, max, diffVal) for item in items

      return

      $scope.items = _.clone items

    $scope.findCurrentSum = (items) ->
      sum = 0
      (sum += item.percent) for item in items
      sum

    $scope.findMinVal = (item) ->
      return if item != undefined && item.blocked
      min = 0
      notBlocked = []
      items = _.clone $scope.items
      angular.forEach(
        items
      ,
        (item) ->
          if !item.blocked
            notBlocked.push item

          if notBlocked.length == 1 && items.length > 1
            return notBlocked[0].percent
      )
      min

    $scope.findMaxVal = (item) ->
      return if item != undefined && item.blocked
      items = _.clone $scope.items
      max = 100
      angular.forEach(
        items
      ,
        (item) ->
          if item.blocked
            max -= item.percent
      )
      max
  }

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

app.directive "integer", ->
  return {
  restrict: "A"
  require: "?ngModel"
  link: (scope, element, attrs, ctrl) ->
    return unless ctrl?
    ctrl.$parsers.push (value)->
      return 100 if value > 100
      return 0 if value < 0
      return Number(value) if 0 <= value <= 100
    ctrl.$formatters.unshift (value)->
      value = value.replace(/,/,".")
      value = parseFloat(value).toFixed(2)
      value
    ctrl.$formatters.push (value) ->
      value
  }
