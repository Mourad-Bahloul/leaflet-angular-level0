import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  map: L.Map | undefined;

  smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  customIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconSize: [40, 64],
    iconAnchor: [22, 64],
    popupAnchor: [0, -64]
  });

  constructor() { }

  createMap(): void {
    const montparnasse = { lat: 48.839268, lng: 2.320752 };
    const zoomLevel = 13;

    /*    this.map = L.map('map', {
          center: [montparnasse.lat, montparnasse.lng],
          zoom: zoomLevel
        });*/

    this.map = L.map('map').setView([montparnasse.lat, montparnasse.lng], zoomLevel);

    /*    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          minZoom: 4,
          maxZoom: 17,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });*/
    const simpeLayer = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a> attribution',
    });

    const europeLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const coloredLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 1,
      maxZoom: 16,
    });

    const transportLayer = L.tileLayer('http://openptmap.org/tiles/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; <a href="http://www.openptmap.org">OpenPtMap</a> contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // fond de carte par defaut
    simpeLayer.addTo(this.map);


    const popUpOptions = { coords: montparnasse, text: '<div class="mapCustomPopUp">hello, here the <b>station!</b></div>' };
    const marker = this.addMarker(popUpOptions);

    // ajout d'un cercle autour de montparnasse
    const circle = L.circle([montparnasse.lat, montparnasse.lng], 2000, { color: 'yellow' });

    // mettre le cercle et le markeur dans le même groupe d'élément
    const stationGroup = L.layerGroup([circle, marker as L.Marker]);
    //stationGroup.addTo(this.map);


    L.control.layers({
      /* fonds de carte */
      'Main': simpeLayer,
      'Europe': europeLayer,
      'Water Colored': coloredLayer,
      'Satellite': satelliteLayer
    }, {
      /** overlays */
      'Transport': transportLayer,
      'Montparnasse': stationGroup
    }, {
      collapsed: true
    }).addTo(this.map);

  }

  addMarker({ coords = { lat: 0, lng: 0 }, text = '', open = false }): L.Marker {
    const marker = L.marker([coords.lat, coords.lng], { icon: this.customIcon, title: 'Gare de Montparnasse' })
      .bindPopup(text);
    if (open) {
      marker.openPopup();
    }
    return marker;
  }

  ngAfterViewInit(): void {
    this.createMap();
  }


}
