app.directive("balancer", function() {
  return {
    restrict: "A",
    templateUrl: "template.html",
    transclude: true,
    scope: {
      items: "="
    },
    controller: "BalancerCtrl"
  };
});


/*
 * fix https://github.com/angular/angular.js/issues/9269
 */

app.directive("rangeParser", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attr, ctrl) {
      if (ctrl == null) {
        return;
      }
      return ctrl.$parsers.push(function(value) {
        var val;
        val = Number(value);
        if (val !== val) {
          val = null;
        }
        return val;
      });
    }
  };
});

app.directive("integer", function() {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ctrl) {
      if (ctrl == null) {
        return;
      }
      ctrl.$parsers.push(function(value) {
        if (value > 100) {
          return 100;
        }
        if (value < 0) {
          return 0;
        }
        if ((0 <= value && value <= 100)) {
          return Number(value);
        }
      });
      ctrl.$formatters.unshift(function(value) {
        value = value.replace(/,/, ".");
        value = parseFloat(value).toFixed(2);
        return value;
      });
      return ctrl.$formatters.push(function(value) {
        return value;
      });
    }
  };
});

//# sourceMappingURL=maps/directives.js.map