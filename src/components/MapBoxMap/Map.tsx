import { useRef, useEffect, useState, memo } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import styles from './Map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
    initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>;
    onCreated?(map: mapboxgl.Map): void;
    onLoaded?(map: mapboxgl.Map): void;
    onRemoved?(): void;
}

export const MapComponent = memo((props: MapProps) => {
    const { initialOptions, onCreated, onLoaded, onRemoved } = props;

    const [map, setMap] = useState<Map>();
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (map || !mapContainerRef.current) return;

        const mapBoxMap = new mapboxgl.Map({
            container: mapContainerRef.current,
            accessToken: process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [37.6, 55.8],
            zoom: 9,
            ...initialOptions,
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

    return <div className={styles.map} ref={mapContainerRef} />;
});
