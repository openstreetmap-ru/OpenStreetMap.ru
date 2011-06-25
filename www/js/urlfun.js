        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
        OpenLayers.Util.onImageLoadErrorColor = "transparent";

        function osm_getTileURL(bounds)
    {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit)
      {
        return OpenLayers.Util.getImagesLocation() + "404.png";
      }
      else
      {
        x = ((x % limit) + limit) % limit;
        return this.url + "x=" + x + "&y=" + y + "&z=" + z;
      }
    }
        function osmt_getTileURL(bounds)
    {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit)
      {
        return OpenLayers.Util.getImagesLocation() + "404.png";
      }
      else
      {
        x = ((x % limit) + limit) % limit;
        return this.url + z + "/" + x + "/" + y+".png";
      }
    }
        function osmn_getTileURL(bounds)  {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit)
      {        return OpenLayers.Util.getImagesLocation() + "404.png";    }
      else
      {  x = ((x % limit) + limit) % limit;
        function zAlignedStr(az,bz){return((new Array(bz+1)).join("0").substr(0,bz-String(az).length)+String(az))};
       return this.url + zAlignedStr(x,8)+","+zAlignedStr(limit-y-1,8)+","+zAlignedStr(z,2);
        //return this.url + z + "/" + x + "/" + y+".png";
      }
    }
