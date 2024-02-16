import { useCallback, useEffect, useMemo, useState } from 'react';
import { DrawMode } from '../../../store/types';
import { EventData, Marker, Popup } from 'mapbox-gl';
import { getDateDDMMYYYY } from '../../../lib/utils/getDate';

interface MarkerControlsParams {
    map: mapboxgl.Map | null;
    markers: mapboxgl.Marker[];
    mode?: DrawMode;
    addMarker: (newMarker: mapboxgl.Marker) => void;
    cleanMarkers: () => void;
    setDrawMode: (newMode: DrawMode) => void;
}

export const useMarkerControls = (params: MarkerControlsParams) => {
    const { mode, map, markers, addMarker, cleanMarkers, setDrawMode } = params;

    const isMarkerMode = useMemo(() => mode === 'marker', [mode]);
    const [isMarkersHidden, setIsMarkersHidden] = useState<boolean>(false);

    const addMarkerHandle = useCallback(
        (event: EventData) => {
            let marker = new Marker();
            let popup = new Popup().setText(getDateDDMMYYYY());

            if (map) {
                marker.setLngLat(event.lngLat).setPopup(popup).addTo(map);
                addMarker(marker);
            }

            setDrawMode(null);
        },
        [addMarker, map, setDrawMode]
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
        setDrawMode('marker');
    }, [setDrawMode]);

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

    return {
        isMarkerMode,
        isMarkersHidden,
        onAddMarkerButtonHandle,
        onMarkerControlsHandle,
    };
};
