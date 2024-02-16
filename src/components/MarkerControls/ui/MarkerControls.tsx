import { observer } from 'mobx-react-lite';
import { Map, Marker } from 'mapbox-gl';
import { DrawMode } from '../../../store/types';
import { useMarkerControls } from '../lib/useMarkerControls';

interface MarkerControlsProps {
    map: Map | null;
    markers: Marker[];
    mode?: DrawMode;
    addMarker: (newMarker: Marker) => void;
    cleanMarkers: () => void;
    setDrawMode: (newMode: DrawMode) => void;
}

export const MarkerControls = observer((props: MarkerControlsProps) => {
    const { map, markers, mode, addMarker, cleanMarkers, setDrawMode } = props;

    const { isMarkerMode, isMarkersHidden, onAddMarkerButtonHandle, onMarkerControlsHandle } =
        useMarkerControls({
            map,
            markers,
            mode,
            addMarker,
            cleanMarkers,
            setDrawMode,
        });

    return (
        <div>
            <button
                type="button"
                onClick={onAddMarkerButtonHandle}
                className={isMarkerMode ? 'activeButton' : undefined}
            >
                Add marker mode: {isMarkerMode ? 'on' : 'off'}
            </button>

            {!!markers?.length && (
                <div className="mapButtonsGroup">
                    <button type="button" onClick={onMarkerControlsHandle('delete')}>
                        Delete markers
                    </button>
                    <button type="button" onClick={onMarkerControlsHandle('hide')}>
                        {isMarkersHidden ? 'Show' : 'Hide'} markers
                    </button>
                </div>
            )}
        </div>
    );
});
