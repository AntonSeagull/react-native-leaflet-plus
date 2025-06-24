import {
  useEffect,
  useRef,
} from 'react';

import { useLeafletMapContext } from './LeafletMap';
import type { PolygonProps } from './types';

const Polygon = (props: PolygonProps) => {


    const { addPolygon, removePolygon } = useLeafletMapContext();

    const lastRenderProps = useRef<string>("");

    useEffect(() => {


        if (lastRenderProps.current !== JSON.stringify(props)) {


            addPolygon(props);
            lastRenderProps.current = JSON.stringify(props);
        }

    }, [props]);

    useEffect(() => {
        return () => {
            removePolygon(props);
        };
    }, []);

    return null;
}

export default Polygon;