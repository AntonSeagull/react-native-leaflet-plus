import {
    useEffect,
    useRef,
} from 'react';

import { useLeafletMapContext } from './LeafletMap';
import { MarkerProps } from './types';

const Marker = (props: MarkerProps) => {


    const { addMarker, removeMarker } = useLeafletMapContext();

    const lastRenderProps = useRef<string>("");

    useEffect(() => {

        if (lastRenderProps.current !== JSON.stringify(props)) {

            addMarker(props);
            lastRenderProps.current = JSON.stringify(props);
        }



    }, [props]);

    useEffect(() => {
        return () => {
            removeMarker(props);
        };
    }, []);

    return null;
}

export default Marker;