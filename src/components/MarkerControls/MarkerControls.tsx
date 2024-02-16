import { observer } from 'mobx-react-lite';
import styles from './MarkerControls.module.css';
import { useCallback, useEffect, useState } from 'react';
import mapboxgl, { EventData } from 'mapbox-gl';

interface MarkerControlsProps {
    map: mapboxgl.Map | null;
    markers: mapboxgl.Marker[];
    addMarker: (newMarker: mapboxgl.Marker) => void;
    cleanMarkers: () => void;
}

export const MarkerControls = observer((props: MarkerControlsProps) => {
    const { map, addMarker, cleanMarkers, markers } = props;

    const [isMarkerMode, setIsMarkerMode] = useState<boolean>(false);
    const [isMarkersHidden, setIsMarkersHidden] = useState<boolean>(false);

    const addMarkerHandle = useCallback(
        (event: EventData) => {
            let marker = new mapboxgl.Marker();
            let popup = new mapboxgl.Popup().setText(
                new Date(Date.now()).toLocaleString().split(',')[0]
            );
            const coordinates = event.lngLat;
            if (map) {
                marker.setLngLat(coordinates).setPopup(popup).addTo(map);
                addMarker(marker);
            }
            setIsMarkerMode(false);
        },
        [addMarker, map]
    );

    useEffect(() => {
        if (isMarkerMode) {
            map?.on('click', addMarkerHandle);
            return;
        }
        map?.off('click', addMarkerHandle);

        return () => {
            map?.off('click', addMarkerHandle);
        };
    }, [addMarkerHandle, isMarkerMode, map]);

    const onAddMarkerButtonHandle = useCallback(() => {
        setIsMarkerMode(true);
    }, []);

    const onMarkerControlsHandle = useCallback(
        (action: 'hide' | 'delete') => () => {
            if (action === 'delete') {
                cleanMarkers?.();
                return markers?.forEach((marker) => {
                    marker.remove();
                });
            }

            isMarkersHidden
                ? markers?.forEach((marker) => {
                      marker.getElement().style.visibility = 'visible';
                  })
                : markers?.forEach((marker) => {
                      marker.getElement().style.visibility = 'hidden';
                  });

            setIsMarkersHidden((prev) => !prev);
        },
        [cleanMarkers, isMarkersHidden, markers]
    );

    return (
        <div>
            <button
                type="button"
                onClick={onAddMarkerButtonHandle}
                className={isMarkerMode ? styles.activeButton : undefined}
            >
                Add marker mode: {isMarkerMode ? 'on' : 'off'}
            </button>

            {markers?.length ? (
                <div className={styles.mapButtonsGroup}>
                    <button type="button" onClick={onMarkerControlsHandle('delete')}>
                        Delete markers
                    </button>
                    <button type="button" onClick={onMarkerControlsHandle('hide')}>
                        {isMarkersHidden ? 'Show' : 'Hide'} markers
                    </button>
                </div>
            ) : null}
        </div>
    );
});
