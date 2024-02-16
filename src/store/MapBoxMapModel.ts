import mapboxgl from 'mapbox-gl';
import { makeAutoObservable } from 'mobx';

export class MapBoxMapModel {
    map: mapboxgl.Map | null = null;
    lines: string[] = [];
    markers: mapboxgl.Marker[] = [];
    isLoading: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    setMap = (map: mapboxgl.Map) => {
        this.map = map;
    };

    setIsLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    };

    addMarker = (newMarker: mapboxgl.Marker) => {
        this.markers.push(newMarker);
    };

    addLine = (newLine: string) => {
        this.lines.push(newLine);
    };

    cleanMarkers = () => {
        this.markers = [];
    };

    cleanLines = () => {
        this.lines = [];
    };
}

export default new MapBoxMapModel();
