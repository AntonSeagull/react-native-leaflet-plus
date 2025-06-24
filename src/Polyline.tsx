import {
    useEffect,
    useRef,
} from 'react';

import { useLeafletMapContext } from './LeafletMap';
import { PolylineProps } from './types';

const Polyline = (props: PolylineProps) => {


    const { addPolyline, removePolyline } = useLeafletMapContext();

    const lastRenderProps = useRef<string>("");

    useEffect(() => {


        if (lastRenderProps.current !== JSON.stringify(props)) {


            addPolyline(props);
            lastRenderProps.current = JSON.stringify(props);
        }

    }, [props]);

    useEffect(() => {
        return () => {
            removePolyline(props);
        };
    }, []);

    return null;
}

export default Polyline;