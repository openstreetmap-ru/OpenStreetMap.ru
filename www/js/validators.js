osm.validators = {

  sources: [{
    "name": "Адресный и роутинговый валидатор Zkir",
    "url": "http://osm.alno.name/validators/zkir?minlat={minlat}&minlon={minlon}&maxlat={maxlat}&maxlon={maxlon}",
    "types": {
      "city_without_population": {"text": "Город без населения"},
      "city_without_place_polygon": {"text": "Город без полигональной границы"},
      "city_without_place_node": {"text": "Город без точечного центра"},
      "routing_subgraph": {"text": "Рутинговый подграф"},
      "routing_subgraph_trunk": {"text": "Рутинговый подграф на уровне trunk"},
      "routing_subgraph_primary": {"text": "Рутинговый подграф на уровне primary"},
      "routing_subgraph_secondary": {"text": "Рутинговый подграф на уровне secondary"},
      "routing_subgraph_tertiary": {"text": "Рутинговый подграф на уровне tertiary"},
      "duplicate_point": {"text": "Точка-дубликат"},
      "building_not_in_place": {"text": "Здание за пределами населенного пункта"},
      "address_without_street": {"text": "Адрес без улицы"},
      "address_street_not_found": {"text": "Адресная улица не найдена"},
      "address_street_not_in_place": {"text": "Улица из адреса не связана с городом"},
      "address_by_territory": {"text": "Здание нумеруется по территории"},
      "address_street_not_routed": {"text": "Не-рутинговая улица"},
      "street_not_in_place": {"text": "Улица за пределами города"}
    },
    "jsonp": true,
    "offset_limit": true
  }],

  errors: [{
    name: "Роутинг",
    children: [{
      name: "Изолированный подграф",
      type: "routing_subgraph"
    },{
      name: "Изолированный подграф trunk",
      type: "routing_subgraph_trunk"
    },{
      name: "Изолированный подграф primary",
      type: "routing_subgraph_primary"
    },{
      name: "Изолированный подграф secondary",
      type: "routing_subgraph_secondary"
    },{
      name: "Изолированный подграф tertiary",
      type: "routing_subgraph_tertiary"
    }]
  },{
    name: "Адресация",
    children: [{
      name: "Города",
      children: [{
        name: "Без населения",
        type: "city_without_population"
      },{
        name: "Без границы",
        type: "city_without_place_polygon"
      },{
        name: "Без центра",
        type: "city_without_place_node"
      }]
    },{
      name: "Улицы",
      children: [{
        name: "За пределами города",
        type: "street_not_in_place"
      }]
    },{
      name: "Здания",
      children: [{
        name: "За пределами города",
        type: "building_not_in_place"
      },{
        name: "Без улицы",
        type: "address_without_street"
      },{
        name: "Улица не найдена",
        type: "address_street_not_found"
      },{
        name: "Улица не связана с городом",
        type: "address_street_not_in_place"
      },{
        name: "Здание нумеруется по территории",
        type: "address_by_territory"
      },{
        name: "Улица не является рутинговой",
        type: "address_street_not_routed"
      }]
    },{
      name: "Другие",
      children: [{
        name: "Точка-дубликат",
        type: "duplicate_point"
      }]
    }]
  }],

  initialize: function() {
    console.log(this.sources)
    this.layer = new OsmJs.Validators.LeafletLayer({sources: this.sources});

    $('#validationerrors').validatorErrorsControl(this.layer, {errors: this.errors});
  },

  enable: function() {
    osm.leftpan.toggle(3);
    osm.map.addLayer(this.layer);
  },

  disable: function() {
    osm.leftpan.toggle(1);
    osm.map.addLayer(this.layer);
  }

}
