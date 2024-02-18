import MapBoxMapStore from '../../store/MapBoxMapModel';
import styles from './InteractiveMap.module.css';
import { observer } from 'mobx-react-lite';
import { MapBoxMap } from '../../components/MapBoxMap/MapBoxMap';
import { MarkerControls } from '../../components/MarkerControls/ui/MarkerControls';
import { LineControls } from '../../components/LineControls/ui/LineControls';
import { useCallback } from 'react';
import { Map } from 'mapbox-gl';
import { Loader } from '../../components/Loader/Loader';

export const InteractiveMap = observer(() => {
    const { isLoading, setIsLoading, setMap } = MapBoxMapStore;

    const onMapLoadHandler = useCallback(
        (map: Map) => {
            setMap(map);
            setIsLoading(false);
        },
        [setIsLoading, setMap]
    );

    return (
        <div className={styles.interactiveMapContainer}>
            <MapBoxMap onLoaded={onMapLoadHandler} />
            <div className={styles.interactiveMapControls}>
                <MarkerControls />
                <LineControls />
            </div>
            {isLoading && <Loader className={styles.loaderContainer} />}
        </div>
    );
});
