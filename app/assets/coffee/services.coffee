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
      percent: 60
    ,
      name: "item2"
      percent: 30
    ,
      name: "item3"
      percent: 80
    ,
      name: "item4"
      percent: 100
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
  @dataOnce =
    items: [
      name: "item1"
      percent: 140
    ]
  @dataTwice =
    items: [
      name: "item1"
      percent: 140
    ,
      name: "item2"
      percent: 90
    ]
  @

