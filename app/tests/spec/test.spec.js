describe("Unit: Controller: MainCtrl", function() {
  beforeEach(
    module("testApp")
  );

  var ctrl, scope, srv, fakeData = [{name: 'item1', percent: 100, blocked: false}, {name:"item2", percent: 0, blocked: false}, {name:"item3", percent: 0, blocked: false}];

  beforeEach(
    inject(
      function ($controller, $rootScope, Data) {
        scope = $rootScope.$new();
        srv = Data;
        ctrl = $controller("MainCtrl", {
          $scope: scope
        });
      }
    )
  );

  // test for test
  it("should true",
    function () {
      expect(true).toBe(true);
    }
  );

  it("should be defined $scope.model",
    function () {
      expect(scope.model).toBeDefined();
    }
  );

  it("should be empty $scope.model",
    function () {
      expect(scope.model).toEqual([]);
    }
  );

  it("should be eql fakeData",
    function () {
      scope.init(srv.dataNull);
      expect(scope.model).toEqual(fakeData);
    }
  );
});

describe("Unit: DirectiveController: BalanceCtrl", function () {
  beforeEach(
    module("testApp")
  );

  var ctrl, scope, defSum;

  beforeEach(
    inject(
      function ($controller, $rootScope, defaultSum) {
        scope = $rootScope.$new();
        defSum = defaultSum;
        ctrl = $controller("BalancerCtrl", {
          $scope: scope
        });
        scope.items = [{name: 'item1', percent: 100, blocked: false}, {name:"item2", percent: 0, blocked: false}, {name:"item3", percent: 0, blocked: false}];
        scope.splitems = [{name: 'item1', percent: 100, blocked: false}, {name:"item2", percent: 0, blocked: false}];

        spyOn(scope, 'findSum').and.callThrough();
        scope.findSum();
        sum = scope.findSum();

        spyOn(scope, 'spliceItem').and.callThrough();
        scope.spliceItem(scope.items, scope.items[2]);
        arr = scope.spliceItem(scope.items, scope.items[2]);
      }
    )
  );

  it("should beNull $scope.indexOfCahnged",
    function () {
      expect(scope.indexOfChanged).toBeNull();
    }
  );

  it("should beEqual 2 $scope.indexOfCahnged",
    function () {
      scope.balance(2);
      expect(scope.indexOfChanged).toBe(2);
    }
  );

  it("tracks that the spy findSum was called ",
    function () {
      expect(scope.findSum).toHaveBeenCalled();
    }
  );

  it("should be equal 100",
    function () {
      expect(sum).toEqual(100);
    }
  );

  it("tracks that the spy spliceItem was called ",
    function () {
      expect(scope.spliceItem).toHaveBeenCalledWith(scope.items, scope.items[2]);
    }
  );

  it("should be equal arr",
    function () {
      expect(arr).toEqual(scope.splitems);
    }
  );
});