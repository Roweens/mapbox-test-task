import { memo } from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
    className?: string;
}

export const Loader = memo((props: LoaderProps) => (
    <div className={props.className}>
        <div className={styles.loader} />
    </div>
));
