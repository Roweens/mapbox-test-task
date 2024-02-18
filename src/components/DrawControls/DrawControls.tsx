import styles from './DrawControls.module.css';

interface DrawControlsProps<T> {
    isDrawMode: boolean;
    isHidden: boolean;
    drawings: T[];
    drawingLabel: string;
    onStartDraw: () => void;
    onDrawControl: (action: 'hide' | 'delete') => () => void;
}

export const DrawControls = <T,>(props: DrawControlsProps<T>) => {
    const { drawings, isDrawMode, isHidden, drawingLabel, onStartDraw, onDrawControl } = props;

    return (
        <div>
            <button
                type="button"
                onClick={onStartDraw}
                className={isDrawMode ? styles.activeButton : undefined}
            >
                Add {drawingLabel} mode: {isDrawMode ? 'on' : 'off'}
            </button>

            {!!drawings?.length && (
                <div className={styles.mapButtonsGroup}>
                    <button type="button" onClick={onDrawControl('delete')}>
                        Delete {drawingLabel}s
                    </button>
                    <button type="button" onClick={onDrawControl('hide')}>
                        {isHidden ? 'Show' : 'Hide'} {drawingLabel}s
                    </button>
                </div>
            )}
        </div>
    );
};
