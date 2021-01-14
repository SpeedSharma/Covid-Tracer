import React from "react";
import './Map.css'
import { MapContainer as LeaFletMap, TileLayer } from 'react-leaflet';

function Map({center, zoom}) {
  return (
    <div className="map">
      <LeaFletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeaFletMap>
    </div>
  );
}

export default Map;