import { observer } from 'mobx-react-lite';
import styles from './LineControls.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';

interface LineControlsProps {
    map: mapboxgl.Map | null;
    lines: string[];
    addLine: (newLine: string) => void;
    cleanLines: () => void;
}

export const LineControls = observer((props: LineControlsProps) => {
    const { map, lines, cleanLines, addLine } = props;

    const [isLineMode, setIsLineMode] = useState<boolean>(false);
    const [isLinesHidden, setIsLinesHidden] = useState<boolean>(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number][]>([]);
    const layerIdRef = useRef<string>();

    const drawLinePointsHandler = useCallback(
        (event: mapboxgl.EventData) => {
            if (!layerIdRef.current) {
                layerIdRef.current = uuidv4();
            }

            const coordinates: mapboxgl.LngLat = event.lngLat;

            setSelectedCoordinates([...selectedCoordinates, [coordinates.lng, coordinates.lat]]);

            if (map?.getLayer(layerIdRef.current as string))
                map?.removeLayer(layerIdRef.current as string);

            if (map?.getSource(layerIdRef.current as string))
                map?.removeSource(layerIdRef.current as string);

            map?.addSource(layerIdRef.current as string, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {
                        description: new Date(Date.now()).toLocaleString().split(',')[0],
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [...selectedCoordinates, [coordinates.lng, coordinates.lat]],
                    },
                },
            });

            map?.addLayer({
                id: layerIdRef.current as string,
                type: 'line',
                source: layerIdRef.current as string,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#888',
                    'line-width': 8,
                },
            });
        },
        [map, selectedCoordinates]
    );

    const drawLineHandler = useCallback(() => {
        map?.off('click', drawLinePointsHandler);
        setIsLineMode(false);
        if (layerIdRef.current) {
            addLine(layerIdRef.current as string);

            map?.on('click', layerIdRef.current, (e) => {
                const coordinates = e.lngLat;
                const description = e.features?.[0].properties?.description;

                while (Math.abs(e.lngLat.lng - coordinates.lng) > 180) {
                    coordinates.lng += e.lngLat.lng > coordinates.lng ? 360 : -360;
                }

                new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
            });
        }

        layerIdRef.current = undefined;
        setSelectedCoordinates([]);
    }, [addLine, drawLinePointsHandler, map]);

    useEffect(() => {
        if (isLineMode) {
            map?.on('click', drawLinePointsHandler);
            map?.on('dblclick', drawLineHandler);

            return;
        }
        map?.off('click', drawLinePointsHandler);
        map?.off('dblclick', drawLineHandler);

        return () => {
            map?.off('click', drawLinePointsHandler);
            map?.off('dblclick', drawLineHandler);
        };
    }, [drawLineHandler, drawLinePointsHandler, isLineMode, map]);

    const onAddLineButtonHandle = useCallback(() => {
        setIsLineMode(true);
    }, []);

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

    return (
        <div className={styles.lineControls}>
            <button
                type="button"
                onClick={onAddLineButtonHandle}
                className={isLineMode ? styles.activeButton : undefined}
            >
                Add Line mode: {isLineMode ? 'on' : 'off'}
            </button>

            {lines?.length ? (
                <div className={styles.mapButtonsGroup}>
                    <button type="button" onClick={onLineControlsHandle('delete')}>
                        Delete lines
                    </button>
                    <button type="button" onClick={onLineControlsHandle('hide')}>
                        {isLinesHidden ? 'Show' : 'Hide'} lines
                    </button>
                </div>
            ) : null}
        </div>
    );
});
