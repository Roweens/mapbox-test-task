import { observer } from 'mobx-react-lite';
import { MapComponent } from '../../components/MapBoxMap/Map';
import { MapBoxMapModel } from '../../store/MapBoxMapModel';
import { MarkerControls } from '../../components/MarkerControls/ui/MarkerControls';
import { LineControls } from '../../components/LineControls/ui/LineControls';
import styles from './InteractiveMap.module.css';
import { useCallback } from 'react';
import { Map } from 'mapbox-gl';
import { Loader } from '../../components/Loader/Loader';

const MapBoxMap = new MapBoxMapModel();

export const InteractiveMap = observer(() => {
    const {
        map,
        markers,
        lines,
        isLoading,
        drawMode,
        setMap,
        addMarker,
        addLine,
        cleanLines,
        cleanMarkers,
        setIsLoading,
        setDrawMode,
    } = MapBoxMap;

    const onMapLoadHandler = useCallback(
        (map: Map) => {
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
                    mode={drawMode}
                    addMarker={addMarker}
                    cleanMarkers={cleanMarkers}
                    setDrawMode={setDrawMode}
                />
                <LineControls
                    map={map}
                    lines={lines}
                    mode={drawMode}
                    addLine={addLine}
                    cleanLines={cleanLines}
                    setDrawMode={setDrawMode}
                />
            </div>
            {isLoading && <Loader className={styles.loaderContainer} />}
        </div>
    );
});
