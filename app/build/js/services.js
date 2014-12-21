app.service("Data", function() {
  this.dataNull = {
    items: [
      {
        name: "item1",
        percent: 0
      }, {
        name: "item2",
        percent: 0
      }, {
        name: "item3",
        percent: 0
      }
    ]
  };
  this.dataNorm = {
    items: [
      {
        name: "item1",
        percent: 60
      }, {
        name: "item2",
        percent: 10
      }, {
        name: "item3",
        percent: 30
      }
    ]
  };
  this.dataBig = {
    items: [
      {
        name: "item1",
        percent: 60
      }, {
        name: "item2",
        percent: 30
      }, {
        name: "item3",
        percent: 80
      }, {
        name: "item4",
        percent: 100
      }
    ]
  };
  this.dataSmall = {
    items: [
      {
        name: "item1",
        percent: 10
      }, {
        name: "item2",
        percent: 20
      }, {
        name: "item3",
        percent: 30
      }
    ]
  };
  this.dataOnce = {
    items: [
      {
        name: "item1",
        percent: 140
      }
    ]
  };
  this.dataTwice = {
    items: [
      {
        name: "item1",
        percent: 140
      }, {
        name: "item2",
        percent: 90
      }
    ]
  };
  return this;
});

//# sourceMappingURL=maps/services.js.map