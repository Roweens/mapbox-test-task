import mapboxgl from 'mapbox-gl';
import { makeAutoObservable } from 'mobx';
import { DrawMode } from './types';

export class MapBoxMapModel {
    map: mapboxgl.Map | null = null;
    lines: string[] = [];
    markers: mapboxgl.Marker[] = [];
    isLoading: boolean = true;
    drawMode: DrawMode = null;

    constructor() {
        makeAutoObservable(this);
    }

    setMap = (map: mapboxgl.Map) => {
        this.map = map;
    };

    setIsLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    };

    setDrawMode = (newMode: DrawMode) => {
        this.drawMode = newMode;
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
