import MapBoxMapStore from '../../../store/MapBoxMapModel';
import { observer } from 'mobx-react-lite';
import { useLineControls } from '../lib/useLineControls';
import { DrawControls } from '../../DrawControls/DrawControls';

export const LineControls = observer(() => {
    const { map, lines, drawMode, setDrawMode, addLine, cleanLines } = MapBoxMapStore;

    const { isLineMode, isLinesHidden, onAddLineButtonHandle, onLineControlsHandle } =
        useLineControls({
            lines,
            map,
            mode: drawMode,
            addLine,
            cleanLines,
            setDrawMode,
        });

    return (
        <DrawControls
            drawingLabel="line"
            drawings={lines}
            isDrawMode={isLineMode}
            isHidden={isLinesHidden}
            onStartDraw={onAddLineButtonHandle}
            onDrawControl={onLineControlsHandle}
        />
    );
});
