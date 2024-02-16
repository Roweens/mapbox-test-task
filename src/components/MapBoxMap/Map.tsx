import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import styles from './Map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
    initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>;
    onCreated?(map: mapboxgl.Map): void;
    onLoaded?(map: mapboxgl.Map): void;
    onRemoved?(): void;
}

export const MapComponent = (props: MapProps) => {
    const { initialOptions, onCreated, onLoaded, onRemoved } = props;

    const [map, setMap] = useState<Map>();
    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(37.6);
    const [lat, setLat] = useState(55.8);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (map || !mapContainerRef.current) return;

        const mapBoxMap = new mapboxgl.Map({
            container: mapContainerRef.current,
            accessToken: process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            ...initialOptions,
        });

        mapBoxMap.on('move', () => {
            setLng(Number(mapBoxMap.getCenter().lng.toFixed(4)));
            setLat(Number(mapBoxMap.getCenter().lat.toFixed(4)));
            setZoom(Number(mapBoxMap.getZoom().toFixed(2)));
        });

        setMap(mapBoxMap);
        if (onCreated) onCreated(mapBoxMap);

        if (onLoaded) mapBoxMap.once('load', () => onLoaded(mapBoxMap));

        return () => {
            mapBoxMap.remove();
            setMap(undefined);
            if (onRemoved) onRemoved();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.mapContainer}>
            <div className={styles.coords}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div className={styles.map} ref={mapContainerRef} />
        </div>
    );
};
