L.Control.inJOSM = L.Control.extend({
  options: {
    position: 'topleft',
    linktitle: 'Редактировать в JOSM',
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
  },

  onAdd: function(map) {
    var className = 'leaflet-bar leaflet-control-inJOSM',
    container = this._container = L.DomUtil.create('div', className);

    this._link = L.DomUtil.create('a', 'leaflet-control-inJOSM-link', container);
    this._link.title = this.options.linktitle;
    this._link.href = '#';
    
    L.DomEvent
      .addListener(this._link, 'click', L.DomEvent.stopPropagation)
      .addListener(this._link, 'click', L.DomEvent.preventDefault)
      .addListener(this._link, 'click', this._click_link, this);

    
    this.errorDialog = $('<div><p>JOSM не запущен!</p><p>Пожалуйста запустите JOSM и повторите попытку.</p></div>')
      .dialog({
        autoOpen:false,
        modal:true,
        resizable:false,
        draggable:false,
        title: 'JOSM не запущен!',
        dialogClass: 'alert',
        buttons: [{text:"Ok", position: 'center', click:function() {$(this).dialog("close");}}]
      });
    
    return container;
  },

  onRemove: function(map) {

  },
  
  _click_link: function() {
    var processResults = function(data, textStatus) {
      if (!(textStatus == 'success' && data == 'OK\r\n'))
        this.errorDialog.dialog("open");
    }
    
    if (this.click_ajax && this.click_ajax.state() == "pending")
      this.click_ajax.abort();
    
    var pos = this._map.getBounds();
    var url = "http://127.0.0.1:8111/load_and_zoom?left=" + pos._southWest.lng + "&top=" + pos._northEast.lat + "&right=" + pos._northEast.lng + "&bottom=" + pos._southWest.lat;
    
    this.click_ajax = $.get(url, {}, $.proxy(processResults, this))
      .error($.proxy(processResults, this));
  }
});
