import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EventData, LngLat, Map, Popup } from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
import { DrawMode } from '../../../store/types';
import { getDateDDMMYYYY } from '../../../lib/utils/getDate';

interface LineControlsProps {
    map: Map | null;
    lines: string[];
    mode?: DrawMode;
    addLine: (newLine: string) => void;
    cleanLines: () => void;
    setDrawMode: (newMode: DrawMode) => void;
}

export const LineControls = observer((props: LineControlsProps) => {
    const { map, lines, mode, cleanLines, addLine, setDrawMode } = props;

    const isLineMode = useMemo(() => mode === 'line', [mode]);
    const [isLinesHidden, setIsLinesHidden] = useState<boolean>(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number][]>([]);
    const layerIdRef = useRef<string>();

    const drawLinePointsHandler = useCallback(
        (event: EventData) => {
            if (!layerIdRef.current) {
                layerIdRef.current = uuidv4();
            }

            const coordinates: LngLat = event.lngLat;

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
                        description: getDateDDMMYYYY(),
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
        setDrawMode(null);
        if (layerIdRef.current) {
            addLine(layerIdRef.current as string);

            map?.on('click', layerIdRef.current, (e) => {
                const coordinates = e.lngLat;
                const description = e.features?.[0].properties?.description;

                while (Math.abs(e.lngLat.lng - coordinates.lng) > 180) {
                    coordinates.lng += e.lngLat.lng > coordinates.lng ? 360 : -360;
                }

                new Popup().setLngLat(coordinates).setHTML(description).addTo(map);
            });
        }

        layerIdRef.current = undefined;
        setSelectedCoordinates([]);
    }, [addLine, drawLinePointsHandler, map, setDrawMode]);

    useEffect(() => {
        if (isLineMode) {
            console.log('line mode on');
            map?.on('click', drawLinePointsHandler);
            map?.on('dblclick', drawLineHandler);

            return;
        }
        console.log('line mode off');
        map?.off('click', drawLinePointsHandler);
        map?.off('dblclick', drawLineHandler);

        return () => {
            map?.off('click', drawLinePointsHandler);
            map?.off('dblclick', drawLineHandler);
        };
    }, [drawLineHandler, drawLinePointsHandler, isLineMode, map]);

    const onAddLineButtonHandle = useCallback(() => {
        setDrawMode('line');
    }, [setDrawMode]);

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
        <div>
            <button
                type="button"
                onClick={onAddLineButtonHandle}
                className={isLineMode ? 'activeButton' : undefined}
            >
                Add Line mode: {isLineMode ? 'on' : 'off'}
            </button>

            {lines?.length ? (
                <div className="mapButtonsGroup">
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
