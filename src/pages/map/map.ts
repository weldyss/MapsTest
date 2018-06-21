import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  LocationService,
  MyLocation,
  MyLocationOptions,
  Polyline
} from '@ionic-native/google-maps';
import { Geolocation } from "@ionic-native/geolocation";
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: GoogleMap
  coordinates: Coordinates
  currentMapTrack = null;
 
  isTracking = false;
  trackedRoute = [];
  previousTracks = [];
  positionSubscription: Subscription;


  constructor(public navCtrl: NavController, public navParams: NavParams, private geo: Geolocation) {
  }

  ionViewDidLoad() {
    this.getLocation();
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

  getLocation() {
    this.geo.getCurrentPosition().then(
      (response) => {
        this.coordinates = response.coords;
        console.log(this.coordinates)
      }

    )
  }

  startTracking() {
    this.isTracking = true;
    this.trackedRoute = [];
 
    this.positionSubscription = this.geo.watchPosition()
      .pipe(
        filter((p) => p.coords !== undefined) //Filter Out Errors
      )
      .subscribe(data => {
        setTimeout(() => {
          this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
          this.redrawPath(this.trackedRoute);
        }, 0);
      });
 
  }
 
  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }
 
    if (path.length > 1) {
      this.currentMapTrack = Polyline.call({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }
}
