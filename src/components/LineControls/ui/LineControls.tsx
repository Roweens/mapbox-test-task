import { observer } from 'mobx-react-lite';
import { Map } from 'mapbox-gl';
import { DrawMode } from '../../../store/types';
import { useLineControls } from '../lib/useLineControls';

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

    const { isLineMode, isLinesHidden, onAddLineButtonHandle, onLineControlsHandle } =
        useLineControls({
            lines,
            map,
            mode,
            addLine,
            cleanLines,
            setDrawMode,
        });

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
