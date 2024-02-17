import { EventData, LngLat, Map, Marker, Popup } from 'mapbox-gl';
import { DrawMode } from '../../../store/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '../ui/LineControls.module.css';
import { getDateDDMMYYYY } from '../../../lib/utils/getDate';

interface LineControlsParams {
    map: Map | null;
    lines: string[];
    mode?: DrawMode;
    addLine: (newLine: string) => void;
    cleanLines: () => void;
    setDrawMode: (newMode: DrawMode) => void;
}

export const useLineControls = (params: LineControlsParams) => {
    const { lines, map, mode, addLine, cleanLines, setDrawMode } = params;

    const isLineMode = useMemo(() => mode === 'line', [mode]);
    const [isLinesHidden, setIsLinesHidden] = useState<boolean>(false);
    const [temporaryMarkers, setTemporaryMarkers] = useState<Marker[]>([]);

    const lineCoordinates = useMemo(
        () =>
            temporaryMarkers.reduce(
                (acc: [number, number][], marker: Marker): [number, number][] => {
                    const coords = marker.getLngLat();
                    return [...acc, [coords.lng, coords.lat]];
                },
                []
            ),
        [temporaryMarkers]
    );

    const layerIdRef = useRef<string>();

    const removeLayer = useCallback(
        (layerId: string) => {
            if (map?.getLayer(layerId)) map?.removeLayer(layerId);
            if (map?.getSource(layerId)) map?.removeSource(layerId);
        },
        [map]
    );

    const drawLinePointHandle = useCallback(
        (event: EventData) => {
            if (!layerIdRef.current) {
                layerIdRef.current = uuidv4();
            }

            const el = document.createElement('div');
            el.className = styles.customMarker;
            const marker = new Marker(el);
            const coordinates: LngLat = event.lngLat;

            if (map) marker.setLngLat(coordinates).addTo(map);
            setTemporaryMarkers([...temporaryMarkers, marker]);

            removeLayer(layerIdRef.current);

            map?.addSource(layerIdRef.current, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {
                        description: `Дата создания: ${getDateDDMMYYYY()}`,
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [...lineCoordinates, [coordinates.lng, coordinates.lat]],
                    },
                },
            });

            map?.addLayer({
                id: layerIdRef.current,
                type: 'line',
                source: layerIdRef.current,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#FFBF00',
                    'line-width': 6,
                    'line-dasharray': [3, 2],
                },
            });
        },
        [lineCoordinates, map, removeLayer, temporaryMarkers]
    );

    const removeMarkers = useCallback(() => {
        temporaryMarkers.forEach((marker) => {
            marker.remove();
        });
    }, [temporaryMarkers]);

    const finishLine = useCallback(() => {
        if (layerIdRef.current) {
            addLine(layerIdRef.current);

            map?.on('click', layerIdRef.current, (e) => {
                const coordinates = e.lngLat;
                const description = e.features?.[0].properties?.description;

                while (Math.abs(e.lngLat.lng - coordinates.lng) > 180) {
                    coordinates.lng += e.lngLat.lng > coordinates.lng ? 360 : -360;
                }

                new Popup().setLngLat(coordinates).setHTML(description).addTo(map);
            });

            map?.setPaintProperty(layerIdRef.current, 'line-color', '#808080');
            map?.setPaintProperty(layerIdRef.current, 'line-dasharray', undefined);

            layerIdRef.current = undefined;
            removeMarkers();
            setTemporaryMarkers([]);
        }
    }, [addLine, map, removeMarkers]);

    const drawLineHandle = useCallback(() => {
        map?.off('click', drawLinePointHandle);
        setDrawMode(null);
        finishLine();
    }, [drawLinePointHandle, finishLine, map, setDrawMode]);

    const removeLineListeners = useCallback(() => {
        map?.off('click', drawLinePointHandle);
        map?.off('dblclick', drawLineHandle);
    }, [drawLineHandle, drawLinePointHandle, map]);

    useEffect(() => {
        if (isLineMode) {
            map?.on('click', drawLinePointHandle);
            map?.once('dblclick', drawLineHandle);
        } else {
            finishLine();
            removeLineListeners();
        }

        return () => {
            removeLineListeners();
        };
    }, [drawLineHandle, drawLinePointHandle, finishLine, isLineMode, map, removeLineListeners]);

    const onAddLineButtonHandle = () => {
        setDrawMode('line');
    };

    const onLineControlsHandle = useCallback(
        (action: 'hide' | 'delete') => () => {
            if (action === 'delete') {
                cleanLines();
                return lines?.forEach((lineLayerId) => {
                    map?.removeLayer(lineLayerId);
                    map?.removeSource(lineLayerId);
                });
            }

            isLinesHidden
                ? lines?.forEach((lineLayerId) => {
                      map?.setLayoutProperty(lineLayerId, 'visibility', 'visible');
                  })
                : lines?.forEach((lineLayerId) => {
                      map?.setLayoutProperty(lineLayerId, 'visibility', 'none');
                  });

            setIsLinesHidden((prev) => !prev);
        },
        [cleanLines, isLinesHidden, lines, map]
    );

    return {
        isLineMode,
        isLinesHidden,
        onLineControlsHandle,
        onAddLineButtonHandle,
    };
};
