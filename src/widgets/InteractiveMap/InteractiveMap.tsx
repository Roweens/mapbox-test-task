import { observer } from 'mobx-react-lite';
import { MapComponent } from '../../components/MapBoxMap/Map';
import { MapBoxMapModel } from '../../store/MapBoxMapModel';
import { MarkerControls } from '../../components/MarkerControls/MarkerControls';
import { LineControls } from '../../components/LineControls/LineControls';
import styles from './InteractiveMap.module.css';
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Loader } from '../../components/Loader/Loader';

const MapBoxMap = new MapBoxMapModel();

export const InteractiveMap = observer(() => {
    const {
        map,
        markers,
        lines,
        isLoading,
        setMap,
        addMarker,
        addLine,
        cleanLines,
        cleanMarkers,
        setIsLoading,
    } = MapBoxMap;

    const onMapLoadHandler = useCallback(
        (map: mapboxgl.Map) => {
            setMap(map);
            setIsLoading(false);
        },
        [setIsLoading, setMap]
    );

    return (
        <div className={styles.interactiveMapContainer}>
            <MapComponent onLoaded={onMapLoadHandler} />
            <div className={styles.interactiveMapControls}>
                <MarkerControls
                    map={map}
                    markers={markers}
                    addMarker={addMarker}
                    cleanMarkers={cleanMarkers}
                />
                <LineControls map={map} lines={lines} addLine={addLine} cleanLines={cleanLines} />
            </div>
            {isLoading && <Loader className={styles.loaderContainer} />}
        </div>
    );
});
