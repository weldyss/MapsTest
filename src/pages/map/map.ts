import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  LocationService,
  MyLocation,
  Marker,
  MyLocationOptions
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: GoogleMap

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap()
  }

  loadMap() {
    let locationOptions: MyLocationOptions = {
      enableHighAccuracy: true
    }
    LocationService.getMyLocation(locationOptions).then(
      (myLocation: MyLocation) => {
        this.map = GoogleMaps.create('map', {
          camera: {
            target: myLocation.latLng,
            zoom: 15,
            tilt: 30
          }
        })
      }
    )
  }
}
