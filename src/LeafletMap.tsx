import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  type GestureResponderEvent,
  View,
  type ViewStyle,
} from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import type {
  FitBoundsOptions,
  LatLngExpression,
  LatLngTuple,
  LeafletEventHandlerFn,
  LeafletMapRef,
  MapOptions,
  MarkerProps,
  PanInsideOptions,
  PanOptions,
  PointExpression,
  PointTuple,
  PolygonProps,
  PolylineProps,
  ProtomapsLayerProps,
  RectangleProps,
  TileLayerProps,
  ZoomOptions,
  ZoomPanOptions,
} from './types';
import { getWebContent } from './webContent';

export interface ConvertFilter {
    paneId?: string
    absolute?: boolean
}

type PropsWithTileLayer = {
    tileLayer: TileLayerProps;
    protomapsLayer?: never;
};

type PropsWithProtomap = {
    tileLayer?: never;
    protomapsLayer: ProtomapsLayerProps;
};


type LeafletMapProps = (PropsWithTileLayer | PropsWithProtomap) & {
    debug?: boolean,
    fadeInOnInit?: boolean;
    fadeInDuration?: number;
    children?: React.ReactNode;
    autoFitBounds?: boolean | PointTuple;
    options: MapOptions
    onInited?: () => void,
    style: ViewStyle;
    onTouchStart?: ((event: GestureResponderEvent) => void) & (() => void),
    onTouchEnd?: ((event: GestureResponderEvent) => void) & (() => void),

    onWebViewError?: (syntheticEvent: WebViewErrorEvent) => void,

    leafletCSSLink?: string;
    leafletJSLink?: string;
    protomapsJSLink?: string;
    leafletDrawJSLink?: string;
    leafletDrawCSSLink?: string;

    injectCSS?: string;
    injectJS?: string;
    injectHTML?: string;

    onZoomLevelsChange?: LeafletEventHandlerFn;
    onUnload?: LeafletEventHandlerFn;
    onViewReset?: LeafletEventHandlerFn;
    onLoad?: LeafletEventHandlerFn;
    onZoomStart?: LeafletEventHandlerFn;
    onMoveStart?: LeafletEventHandlerFn;
    onZoom?: LeafletEventHandlerFn;
    onMove?: LeafletEventHandlerFn;
    onZoomEnd?: LeafletEventHandlerFn;
    onMoveEnd?: LeafletEventHandlerFn;
    onAutopanStart?: LeafletEventHandlerFn;
    onDragStart?: LeafletEventHandlerFn;
    onDrag?: LeafletEventHandlerFn;
    onAdd?: LeafletEventHandlerFn;
    onRemove?: LeafletEventHandlerFn;
    onLoading?: LeafletEventHandlerFn;
    onError?: LeafletEventHandlerFn;
    onUpdate?: LeafletEventHandlerFn;
    onDown?: LeafletEventHandlerFn;
    onPreDrag?: LeafletEventHandlerFn;





};



const eventFunctionsNames = {


    'zoomlevelschange': 'onZoomLevelsChange',
    'unload': 'onUnload',
    'viewreset': 'onViewReset',
    'load': 'onLoad',
    'zoomstart': 'onZoomStart',
    'movestart': 'onMoveStart',
    'zoom': 'onZoom',
    'move': 'onMove',
    'zoomend': 'onZoomEnd',
    'moveend': 'onMoveEnd',
    'autopanstart': 'onAutopanStart',
    'dragstart': 'onDragStart',
    'drag': 'onDrag',
    'add': 'onAdd',
    'remove': 'onRemove',
    'loading': 'onLoading',
    'error': 'onError',
    'update': 'onUpdate',
    'down': 'onDown',
    'predrag': 'onPreDrag',

};

const defaultLeafletCSSLink = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const defaultLeafletJSLink = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const defaultProtomapsJSLink = 'https://unpkg.com/protomaps-leaflet@5.0.1/dist/protomaps-leaflet.js';
const defaultLeafletDrawJSLink = 'https://cdn.jsdelivr.net/npm/leaflet-draw@1.0.4/dist/leaflet.draw.js';
//const defaultLeafletDrawCSSLink = 'https://cdn.jsdelivr.net/npm/leaflet-draw@1.0.4/dist/leaflet.draw.css';

type LeafletMapRegistry = {
    addMarker: (propsMarker: MarkerProps) => void;
    removeMarker: (propsMarker: MarkerProps) => void;
    addPolyline: (propsPolyline: PolylineProps) => void;
    removePolyline: (propsPolyline: PolylineProps) => void;
    addPolygon: (propsPolygon: PolygonProps) => void;
    removePolygon: (propsPolygon: PolygonProps) => void;
    addRectangle: (propsRectangle: RectangleProps) => void;
    removeRectangle: (propsRectangle: RectangleProps) => void;


};
const LeafletMapContext = createContext<LeafletMapRegistry | null>(null);


export const useLeafletMapContext = () => {
    const ctx = useContext(LeafletMapContext);
    if (!ctx) throw new Error('useLeafletMapContext must be used within <LeafletMapProvider>');
    return ctx;
};




export const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>((props, ref) => {



    const boundsLatLng = useRef<{
        [key: string]: LatLngTuple[];
    }>({});

    const lastProps = useRef<string | null>(JSON.stringify([props.tileLayer, props.protomapsLayer]));

    useEffect(() => {

        if (inited) {



            if (lastProps.current !== JSON.stringify([props.tileLayer, props.protomapsLayer])) {

                functionsMirror.updateLayer.native(props);

                lastProps.current = JSON.stringify([props.tileLayer, props.protomapsLayer]);
            }

        }

    }, [props.tileLayer, props.protomapsLayer]);

    const markersClickHandlers = useRef<{ [key: string]: () => void }>({});
    const polygonEitableHandlers = useRef<{ [key: string]: (latlngs: LatLngTuple[]) => void }>({});

    const addRectangle = (propsRectangle: RectangleProps) => {

        if (propsRectangle.onEdit)
            polygonEitableHandlers.current[propsRectangle.uniqueId] = propsRectangle.onEdit;

        functionsMirror.addRectangle.native(propsRectangle);

        let points: LatLngTuple[] = [];

        propsRectangle.latlngs.forEach((latlng) => {

            //@ts-ignore
            if (latlng?.lat && latlng?.lng) {
                //@ts-ignore
                points.push([latlng.lat, latlng.lng]);
            } else {
                //@ts-ignore
                points.push([latlng[0], latlng[1]]);
            }


        });

        if (!propsRectangle.ignoreAutoFit) {
            boundsLatLng.current[propsRectangle.uniqueId] = points;
        }
        autoFitBounds();

    }
    const removeRectangle = (propsRectangle: RectangleProps) => {
        functionsMirror.removeRectangle.native(propsRectangle);

        if (polygonEitableHandlers.current[propsRectangle.uniqueId]) {
            delete polygonEitableHandlers.current[propsRectangle.uniqueId];
        }

        autoFitBounds();

    }



    const addPolygon = (propsPolygon: PolygonProps) => {
        functionsMirror.addPolygon.native(propsPolygon);

        let points: LatLngTuple[] = [];
        propsPolygon.latlngs.forEach((latlng) => {

            //@ts-ignore
            if (latlng?.lat && latlng?.lng) {
                //@ts-ignore
                points.push([latlng.lat, latlng.lng]);
            } else {
                //@ts-ignore
                points.push([latlng[0], latlng[1]]);
            }
        });

        if (!propsPolygon.ignoreAutoFit) {
            boundsLatLng.current[propsPolygon.uniqueId] = points;
        }
        autoFitBounds();
    }

    const removePolygon = (propsPolygon: PolygonProps) => {
        functionsMirror.removePolygon.native(propsPolygon);

        if (boundsLatLng.current[propsPolygon.uniqueId]) {
            delete boundsLatLng.current[propsPolygon.uniqueId];
        }

        autoFitBounds();
    }


    const addPolyline = (propsPolyline: PolylineProps) => {


        functionsMirror.addPolyline.native(propsPolyline);


        let points: LatLngTuple[] = [];

        propsPolyline.latlngs.forEach((latlng) => {

            //@ts-ignore
            if (latlng?.lat && latlng?.lng) {
                //@ts-ignore
                points.push([latlng.lat, latlng.lng]);
            } else {
                //@ts-ignore
                points.push([latlng[0], latlng[1]]);
            }


        });
        if (!propsPolyline.ignoreAutoFit) {
            boundsLatLng.current[propsPolyline.uniqueId] = points;
        }
        autoFitBounds();
    }




    const autoFitBounds = () => {
        if (props.autoFitBounds) {


            let points: LatLngTuple[] = Object.values(boundsLatLng.current).flat();
            if (points.length === 0) return;

            points = points.filter((point) => {
                return point && point.length === 2 && !isNaN(point[0]) && !isNaN(point[1]);
            });


            functionsMirror.fitBounds.native(
                points,
                {
                    padding: props.autoFitBounds == true ? [50, 50] : props.autoFitBounds,
                }
            );

        }
    }


    const removePolyline = (propsPolyline: PolylineProps) => {

        functionsMirror.removePolyline.native(propsPolyline);

        if (boundsLatLng.current[propsPolyline.uniqueId]) {
            delete boundsLatLng.current[propsPolyline.uniqueId];
        }

        autoFitBounds();

    }

    const addMarker = (propsMarker: MarkerProps) => {


        if (propsMarker.onPress)
            markersClickHandlers.current[propsMarker.uniqueId] = propsMarker.onPress;

        functionsMirror.addMarker.native(propsMarker);



        let points: LatLngTuple[] = [];

        //@ts-ignore
        if (propsMarker.latlng?.lat && propsMarker.latlng.lng) {
            //@ts-ignore
            points.push([propsMarker.latlng.lat, propsMarker.latlng.lng]);
        } else {
            //@ts-ignore
            points.push([propsMarker.latlng[0], propsMarker.latlng[1]]);
        }

        if (!propsMarker.ignoreAutoFit) {
            boundsLatLng.current[propsMarker.uniqueId] = points;
        }
        autoFitBounds();
    };


    const removeMarker = (propsMarker: MarkerProps) => {

        if (markersClickHandlers.current[propsMarker.uniqueId]) {
            delete markersClickHandlers.current[propsMarker.uniqueId];
        }

        functionsMirror.removeMarker.native(propsMarker);


        if (boundsLatLng.current[propsMarker.uniqueId]) {
            delete boundsLatLng.current[propsMarker.uniqueId];
        }

        autoFitBounds();

    }



    const webViewRef = useRef<WebView>(null);

    const [html, setHtml] = useState<string>('');

    const sendToWebView = useCallback((message: {
        function: string;
        params: any;
    }) => {

        webViewRef.current?.postMessage(JSON.stringify(message));

    }, []);

    useEffect(() => {

        if (html) return;



        getWebContent({
            leafletCSSLink: props?.leafletCSSLink ?? defaultLeafletCSSLink,
            leafletJsLink: props?.leafletJSLink ?? defaultLeafletJSLink,
            protomapsJSLink: props?.protomapsJSLink ?? defaultProtomapsJSLink,

            leafletDrawCSSLink: props?.leafletDrawCSSLink ?? defaultLeafletCSSLink,
            leafletDrawJSLink: props?.leafletDrawJSLink ?? defaultLeafletDrawJSLink,

            functionsMirrorJS: Object.keys(functionsMirror).map((key) => {
                return functionsMirror[key as keyof typeof functionsMirror].web;
            }).join('\n'),
            injectCSS: props.injectCSS ?? '',
            injectJS: props.injectJS ?? '',
            injectHTML: props.injectHTML ?? '',
        }
        ).then(res => {
            setHtml(res);
        });
    }, []);


    const fadeAnim = useRef(new Animated.Value(0)).current;


    const [inited, setInited] = useState<boolean>(false);


    useEffect(() => {
        if (inited && (props.fadeInOnInit ?? true)) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: props.fadeInDuration ?? 500,
                useNativeDriver: true,
            }).start();
        }


    }, [inited]);

    const updateProps = () => {


        if (webViewRef.current) {

            if (inited) {

            }



        }

    }

    useEffect(() => {
        updateProps();
    }, [inited]);

    const onLoadEnd = () => {

        if (!inited)
            functionsMirror.init.native(props.options, {
                tileLayer: props.tileLayer,
                protomapsLayer: props.protomapsLayer
            });

    }
    const onReceiveMessageFromWebView = (data: string) => {


        try {
            const msg = JSON.parse(data);

            if (msg.type === 'inited') {
                props.onInited?.();
                setInited(true);
                return;

            }

            if (msg.type === 'rectangleEdited') {
                const handler = polygonEitableHandlers.current[msg.uniqueId];
                if (typeof handler === 'function') {
                    handler(msg.latlngs);
                }
                return;
            }

            if (msg.type === 'markerClick') {
                const handler = markersClickHandlers.current[msg.uniqueId];
                if (typeof handler === 'function') {
                    handler();
                }
                return;
            }

            if (msg.type === 'leafletEvent') {
                //@ts-ignore
                const handlerName = eventFunctionsNames[msg.event];

                const handler = (props as any)[handlerName];
                if (typeof handler === 'function') {
                    handler(msg.data);
                }
            }
        } catch (e) {
            if (props.debug) console.warn('Invalid message from WebView:', data);
        }


    };


    const functionsMirror = {

        addRectangle: {
            native: (propsRectangle: RectangleProps) => {
                sendToWebView({
                    function: 'addRectangle',
                    params: propsRectangle,

                });
            },
            web: `
             if(functionName === 'addRectangle') {

                if(rectangles[params.uniqueId]) {
                    rectangles[params.uniqueId].remove();
                    delete rectangles[params.uniqueId];
                }

                const options = params.options || {};
               
                const rectangle = L.rectangle(params.latlngs, options);
                rectangle.addTo(map);
              
                if(params.editable){
                    rectangle.editing.enable();

                    rectangle.on('edit', function () {

                let bounds = rectangle.getBounds();

                let latlngs = [
                    [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                    [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
                    [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
                    [bounds.getSouthEast().lat, bounds.getSouthEast().lng]
                ];
                    
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'rectangleEdited',
                            uniqueId: params.uniqueId,
                            latlngs: latlngs
                        }));

                      
                    });
                }
                rectangles[params.uniqueId] = rectangle;

             }`
        },
        removeRectangle: {
            native: (propsRectangle: RectangleProps) => {
                sendToWebView({
                    function: 'removeRectangle',
                    params: propsRectangle,

                });
            },
            web: `
             if(functionName === 'removeRectangle') {
                if(rectangles[params.uniqueId]) {
                    rectangles[params.uniqueId].remove();
                    delete rectangles[params.uniqueId];
                }
             }`
        },

        addPolygon: {
            native: (propsPolygon: PolygonProps) => {
                sendToWebView({
                    function: 'addPolygon',
                    params: propsPolygon,

                });
            },
            web: `
             if(functionName === 'addPolygon') {

                if(polygons[params.uniqueId]) {
                    polygons[params.uniqueId].remove();
                    delete polygons[params.uniqueId];
                }

                const options = params.options || {};
                if(options.pane) {
                    options.pane = params.paneId;
                }

                const polygon = L.polygon(params.latlngs, options);
                polygon.addTo(map);
              
                polygons[params.uniqueId] = polygon;

             }`
        },
        removePolygon: {
            native: (propsPolygon: PolygonProps) => {
                sendToWebView({
                    function: 'removePolygon',
                    params: propsPolygon,
                });
            },
            web: `
             if(functionName === 'removePolygon') {
                if(polygons[params.uniqueId]) {
                    polygons[params.uniqueId].remove();
                    delete polygons[params.uniqueId];
                }
             }`
        },


        addMarker: {
            native: (propsMarker: MarkerProps) => {
                sendToWebView({
                    function: 'addMarker',
                    params: propsMarker,

                });
            },
            web: `
             if(functionName === 'addMarker') {

                if( markers[params.uniqueId] ){
                    markers[params.uniqueId].remove(); 
                     delete markers[params.uniqueId];
                }

                const options = params.options || {};
                if(options.icon.divIcon){
                options.icon = L.divIcon(options.icon.divIcon);
                }else if(options.icon.icon){
                options.icon = L.icon(options.icon.icon);
                }else {
                    options.icon = undefined;
                }

                const marker = L.marker(params.latlng, {...options});
                marker.addTo(map);
                marker.on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'markerClick',
                        uniqueId: params.uniqueId
                    }));
                });

                markers[params.uniqueId] = marker;

               

             }`
        },
        removeMarker: {
            native: (propsMarker: MarkerProps) => {
                sendToWebView({
                    function: 'removeMarker',
                    params: propsMarker,

                });
            },
            web: `
             if(functionName === 'removeMarker') {
                if( markers[params.uniqueId] ){
                    markers[params.uniqueId].remove();
                    delete markers[params.uniqueId];
                }


             }`
        },

        addPolyline: {
            native: (propsPolyline: PolylineProps) => {
                sendToWebView({
                    function: 'addPolyline',
                    params: propsPolyline,

                });
            },
            web: `
             if(functionName === 'addPolyline') {

                if(polylines[params.uniqueId]) {
                    polylines[params.uniqueId].remove();
                    delete polylines[params.uniqueId];
                }

                  const options = params.options || {};

                 

                const polyline = L.polyline(params.latlngs, options);
                polyline.addTo(map);
                polylines[params.uniqueId] = polyline;

               
                    
             }`
        },
        removePolyline: {
            native: (propsPolyline: PolylineProps) => {
                sendToWebView({
                    function: 'removePolyline',
                    params: propsPolyline,

                });
            },
            web: `
             if(functionName === 'removePolyline') {
                if(polylines[params.uniqueId]) {
                    polylines[params.uniqueId].remove();
                    delete polylines[params.uniqueId];
                }

             }`
        },

        init: {
            native: (options: MapOptions,
                tileLayer: {
                    tileLayer?: TileLayerProps;
                    protomapsLayer?: ProtomapsLayerProps;
                }) => {
                sendToWebView({
                    function: 'init',
                    params: {

                        options: options,
                        tileLayer: tileLayer.tileLayer ?? undefined,
                        protomapsLayer: tileLayer.protomapsLayer ?? undefined,
                    }
                });
            },
            web: `
             if(functionName === 'init') {
                map = L.map('map', params.options);


                if(params.protomapsLayer) {

               
                tileLayer =  protomapsL.leafletLayer(params.protomapsLayer).addTo(map);

                } else if (params.tileLayer) {

                tileLayer =    L.tileLayer(params.tileLayer.url,params.tileLayer.options ).addTo(map);
                }

          

               const supportedEvents = [
                "zoomlevelschange", "unload", "viewreset", "load", "zoomstart",
                "movestart", "zoom", "move", "zoomend", "moveend", "autopanstart",
                "dragstart", "drag", "add", "remove", "loading", "error",
                "update", "down", "predrag"
                ];

                supportedEvents.forEach(eventType => {
               map.on(eventType, function (e) {

                    

                        const safe = {
                        latlng: typeof map.getCenter === 'function' ? map.getCenter() : null,
                        zoom: typeof map.getZoom === 'function' ? map.getZoom() : null,
                        type: e.type
                    };

                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'leafletEvent',
                        event: eventType,
                        data: safe,
                    }));
                    });
                });

                 window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'inited',
                 }));

               
                 }`

        },

        updateLayer: {
            native: (props: LeafletMapProps) => {
                sendToWebView({
                    function: 'updateLayer',
                    params: {
                        tileLayer: props.tileLayer,
                        protomapsLayer: props.protomapsLayer
                    }
                });
            },
            web: `
             if(functionName === 'updateLayer') {

             if(!tileLayer) return;


             tileLayer.remove();
             tileLayer = null;

                if(params.protomapsLayer) {

                  tileLayer=  protomapsL.leafletLayer(params.protomapsLayer).addTo(map);

                } else if (params.tileLayer) {

                   tileLayer =    L.tileLayer(params.tileLayer.url,params.tileLayer.options ).addTo(map);
                }

             }`
        },


        stop: {
            native: () => {
                sendToWebView({
                    function: 'stop',
                    params: {}
                });
            },
            web: `
             if(functionName === 'stop') {
               if (map) {
                 map.stop();
               }
             }`
        },


        flyTo: {
            native: (latlng: LatLngExpression, zoom?: number, options?: ZoomPanOptions) => {
                sendToWebView({ function: 'flyTo', params: { latlng, zoom, options } });
            },
            web: `
              if(functionName === 'flyTo') {
                map.flyTo(params.latlng, params.zoom || undefined, params.options || undefined);
            }`
        },

        flyToBounds: {
            native: (bounds: LatLngTuple[], options?: FitBoundsOptions) => {
                sendToWebView({ function: 'flyToBounds', params: { bounds, options } });
            },
            web: `
              if(functionName === 'flyToBounds') {
                map.flyToBounds(params.bounds, params.options);
              }`
        },

        setView: {
            native: (center: LatLngExpression, zoom?: number, options?: ZoomPanOptions) => {
                sendToWebView({ function: 'setView', params: { center, zoom, options } });
            },
            web: `
              if(functionName === 'setView') {
                map.setView(params.center, params.zoom, params.options);
              }`
        },

        setZoom: {
            native: (zoom: number, options?: ZoomPanOptions) => {
                sendToWebView({ function: 'setZoom', params: { zoom, options } });
            },
            web: `
              if(functionName === 'setZoom') {
                map.setZoom(params.zoom, params.options);
              }`
        },

        zoomIn: {
            native: (delta?: number, options?: ZoomOptions) => {
                sendToWebView({ function: 'zoomIn', params: { delta, options } });
            },
            web: `
              if(functionName === 'zoomIn') {
                map.zoomIn(params.delta, params.options);
              }`
        },

        zoomOut: {
            native: (delta?: number, options?: ZoomOptions) => {
                sendToWebView({ function: 'zoomOut', params: { delta, options } });
            },
            web: `
              if(functionName === 'zoomOut') {
                map.zoomOut(params.delta, params.options);
              }`
        },

        fitBounds: {
            native: (bounds: LatLngTuple[], options?: FitBoundsOptions) => {

                if (bounds.length < 2) return;

                sendToWebView({ function: 'fitBounds', params: { bounds, options } });
            },
            web: `
              if(functionName === 'fitBounds') {

             
              const bounds = L.latLngBounds(params.bounds);
              map.fitBounds(bounds, params.options || {});


             
              }`
        },

        fitWorld: {
            native: (options?: FitBoundsOptions) => {
                sendToWebView({ function: 'fitWorld', params: { options } });
            },
            web: `
              if(functionName === 'fitWorld') {
                map.fitWorld(params.options);
              }`
        },

        panTo: {
            native: (latlng: LatLngExpression, options?: PanOptions) => {
                sendToWebView({ function: 'panTo', params: { latlng, options } });
            },
            web: `
              if(functionName === 'panTo') {
                map.panTo(params.latlng, params.options);
              }`
        },

        panBy: {
            native: (offset: PointExpression, options?: PanOptions) => {
                sendToWebView({ function: 'panBy', params: { offset, options } });
            },
            web: `
              if(functionName === 'panBy') {
                map.panBy(params.offset, params.options);
              }`
        },

        setMaxBounds: {
            native: (bounds?: LatLngTuple[]) => {
                sendToWebView({ function: 'setMaxBounds', params: { bounds } });
            },
            web: `
              if(functionName === 'setMaxBounds') {
                map.setMaxBounds(params.bounds);
              }`
        },

        setMinZoom: {
            native: (zoom: number) => {
                sendToWebView({ function: 'setMinZoom', params: { zoom } });
            },
            web: `
              if(functionName === 'setMinZoom') {
                map.setMinZoom(params.zoom);
              }`
        },

        setMaxZoom: {
            native: (zoom: number) => {
                sendToWebView({ function: 'setMaxZoom', params: { zoom } });
            },
            web: `
              if(functionName === 'setMaxZoom') {
                map.setMaxZoom(params.zoom);
              }`
        },

        panInside: {
            native: (latLng: LatLngExpression, options?: PanInsideOptions) => {
                sendToWebView({ function: 'panInside', params: { latLng, options } });
            },
            web: `
              if(functionName === 'panInside') {
                map.panInside(params.latLng, params.options);
              }`
        },

        panInsideBounds: {
            native: (bounds: LatLngTuple[], options?: PanOptions) => {
                sendToWebView({ function: 'panInsideBounds', params: { bounds, options } });
            },
            web: `
              if(functionName === 'panInsideBounds') {
                map.panInsideBounds(params.bounds, params.options);
              }`
        },

        setZoomAround: {
            native: (latlng: LatLngExpression, zoom: number, options?: ZoomPanOptions) => {
                sendToWebView({ function: 'setZoomAround', params: { latlng, zoom, options } });
            },
            web: `
              if(functionName === 'setZoomAround') {
                map.setZoomAround(params.latlng, params.zoom, params.options);
              }`
        },
    };



    useImperativeHandle(ref, () => ({
        stop: functionsMirror.stop.native,
        flyTo: functionsMirror.flyTo.native,
        flyToBounds: functionsMirror.flyToBounds.native,
        setView: functionsMirror.setView.native,
        setZoom: functionsMirror.setZoom.native,
        zoomIn: functionsMirror.zoomIn.native,
        zoomOut: functionsMirror.zoomOut.native,
        setZoomAround: functionsMirror.setZoomAround.native,
        fitBounds: functionsMirror.fitBounds.native,
        fitWorld: functionsMirror.fitWorld.native,
        panTo: functionsMirror.panTo.native,
        panBy: functionsMirror.panBy.native,
        setMaxBounds: functionsMirror.setMaxBounds.native,
        setMinZoom: functionsMirror.setMinZoom.native,
        setMaxZoom: functionsMirror.setMaxZoom.native,
        panInside: functionsMirror.panInside.native,
        panInsideBounds: functionsMirror.panInsideBounds.native,
    }), [sendToWebView, webViewRef, props.options]);



    const getBaseUrl = () => {


        if (props.protomapsLayer?.url) {

            const url = props.protomapsLayer.url;
            const match = url.match(/^(https?:\/\/[^/]+)/);
            if (match) {
                return match[1];
            }
            return undefined;

        }
        if (props.tileLayer?.url) {

            const url = props.tileLayer.url;
            const match = url.match(/^(https?:\/\/[^/]+)/);
            if (match) {
                return match[1];
            }
            return undefined;
        }

        return undefined;

    }


    return (<LeafletMapContext.Provider
        value={{
            addPolyline,
            removePolyline,
            addMarker,
            removeMarker,
            addPolygon,
            removePolygon,
            addRectangle,
            removeRectangle
        }}
    >
        <View style={props.style}>



            <Animated.View style={{ flex: 1, opacity: inited && (props.fadeInOnInit ?? true) ? fadeAnim : 1 }}>
                <WebView
                    ref={webViewRef}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}
                    originWhitelist={['*']}
                    source={{
                        html: html,
                        baseUrl: getBaseUrl()
                    }}
                    onLoadEnd={onLoadEnd}
                    onMessage={event => {
                        const { data } = event.nativeEvent;
                        onReceiveMessageFromWebView(data);
                    }}

                    onError={props.onWebViewError}

                    onTouchStart={props.onTouchStart}
                    onTouchEnd={props.onTouchEnd}
                    javaScriptEnabled
                    domStorageEnabled
                    scrollEnabled={false}


                />
            </Animated.View>
            {inited && props.children}
        </View>
    </LeafletMapContext.Provider>
    );
});
