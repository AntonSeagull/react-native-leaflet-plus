import {
    useEffect,
    useRef,
} from 'react';

import { useLeafletMapContext } from './LeafletMap';
import type { RectangleProps } from './types';

export const Rectangle = (props: RectangleProps) => {


    const { addRectangle, removeRectangle } = useLeafletMapContext();

    const lastRenderProps = useRef<string>("");

    useEffect(() => {


        if (lastRenderProps.current !== JSON.stringify(props)) {


            addRectangle(props);
            lastRenderProps.current = JSON.stringify(props);
        }

    }, [props]);

    useEffect(() => {
        return () => {
            removeRectangle(props);
        };
    }, []);

    return null;
}
