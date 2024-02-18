import MapBoxMapStore from '../../../store/MapBoxMapModel';
import { observer } from 'mobx-react-lite';
import { useMarkerControls } from '../lib/useMarkerControls';
import { DrawControls } from '../../DrawControls/DrawControls';

export const MarkerControls = observer(() => {
    const { map, markers, drawMode, addMarker, cleanMarkers, setDrawMode } = MapBoxMapStore;

    const { isMarkerMode, isMarkersHidden, onAddMarkerButtonHandle, onMarkerControlsHandle } =
        useMarkerControls({
            map,
            markers,
            mode: drawMode,
            addMarker,
            cleanMarkers,
            setDrawMode,
        });

    return (
        <DrawControls
            drawingLabel="marker"
            drawings={markers}
            isDrawMode={isMarkerMode}
            isHidden={isMarkersHidden}
            onStartDraw={onAddMarkerButtonHandle}
            onDrawControl={onMarkerControlsHandle}
        />
    );
});
