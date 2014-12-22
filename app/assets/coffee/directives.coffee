app.directive "balancer", () ->
  return {
    restrict: "A"
    templateUrl: "template.html"
    transclude: true
    scope: { items: "=" }
    controller: "BalancerCtrl"
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
