

export type Zoom = boolean | "center";



export interface LatLngLiteral {
    lat: number;
    lng: number;
    alt?: number;
}

export type LatLngTuple = [number, number, number?];


export type LatLngExpression = LatLngLiteral | LatLngTuple;





export interface LayerOptions {
    pane?: string | undefined;
    attribution?: string | undefined;
}

export interface RendererOptions extends LayerOptions {
    padding?: number | undefined;
    tolerance?: number | undefined;
}

export interface MapOptions {
    preferCanvas?: boolean | undefined;

    // Control options
    attributionControl?: boolean | undefined;
    zoomControl?: boolean | undefined;

    // Interaction options
    closePopupOnClick?: boolean | undefined;
    zoomSnap?: number | undefined;
    zoomDelta?: number | undefined;
    trackResize?: boolean | undefined;
    boxZoom?: boolean | undefined;
    doubleClickZoom?: Zoom | undefined;
    dragging?: boolean | undefined;

    // Map state options

    center?: LatLngExpression | undefined;
    zoom?: number | undefined;
    minZoom?: number | undefined;
    maxZoom?: number | undefined;

    maxBounds?: LatLngTuple[] | undefined;
    renderer?: RendererOptions | undefined;

    // Animation options
    fadeAnimation?: boolean | undefined;
    markerZoomAnimation?: boolean | undefined;
    transform3DLimit?: number | undefined;
    zoomAnimation?: boolean | undefined;
    zoomAnimationThreshold?: number | undefined;

    // Panning inertia options
    inertia?: boolean | undefined;
    inertiaDeceleration?: number | undefined;
    inertiaMaxSpeed?: number | undefined;
    easeLinearity?: number | undefined;
    worldCopyJump?: boolean | undefined;
    maxBoundsViscosity?: number | undefined;

    // Keyboard navigation options
    keyboard?: boolean | undefined;
    keyboardPanDelta?: number | undefined;

    // Mousewheel options
    scrollWheelZoom?: Zoom | undefined;
    wheelDebounceTime?: number | undefined;
    wheelPxPerZoomLevel?: number | undefined;

    // Touch interaction options
    tapHold?: boolean | undefined;
    tapTolerance?: number | undefined;
    touchZoom?: Zoom | undefined;
    bounceAtZoomLimits?: boolean | undefined;
}

export interface ZoomOptions {
    animate?: boolean | undefined;
}

export interface PanOptions {
    animate?: boolean | undefined;
    duration?: number | undefined;
    easeLinearity?: number | undefined;
    noMoveStart?: boolean | undefined;
}


export interface ZoomPanOptions extends ZoomOptions, PanOptions { }

export type PointTuple = [number, number];
export type PointExpression = PointTuple;
export interface FitBoundsOptions extends ZoomOptions, PanOptions {
    paddingTopLeft?: PointExpression | undefined;
    paddingBottomRight?: PointExpression | undefined;
    padding?: PointExpression | undefined;
    maxZoom?: number | undefined;
}


export interface PanInsideOptions extends PanOptions {
    paddingTopLeft?: PointExpression | undefined;
    paddingBottomRight?: PointExpression | undefined;
    padding?: PointExpression | undefined;
}

export type LeafletMapRef = {


    stop: () => void;
    flyTo: (latlng: LatLngExpression, zoom?: number, options?: ZoomPanOptions) => void;
    flyToBounds: (bounds: LatLngTuple[], options?: FitBoundsOptions) => void;
    setView: (center: LatLngExpression, zoom?: number, options?: ZoomPanOptions) => void;
    setZoom: (zoom: number, options?: ZoomPanOptions) => void;
    zoomIn: (delta?: number, options?: ZoomOptions) => void;
    zoomOut: (delta?: number, options?: ZoomOptions) => void;
    setZoomAround: (position: LatLngExpression, zoom: number, options?: ZoomOptions) => void;
    fitBounds: (bounds: LatLngTuple[], options?: FitBoundsOptions) => void;
    fitWorld: (options?: FitBoundsOptions) => void;
    panTo: (latlng: LatLngExpression, options?: PanOptions) => void;
    panBy: (offset: PointExpression, options?: PanOptions) => void;
    setMaxBounds: (bounds?: LatLngTuple[]) => void;
    setMinZoom: (zoom: number) => void;
    setMaxZoom: (zoom: number) => void;
    panInside: (latLng: LatLngExpression, options?: PanInsideOptions) => void;
    panInsideBounds: (bounds: LatLngTuple[], options?: PanOptions) => void;
}

export interface GridLayerOptions extends LayerOptions {
    tileSize?: number | undefined;
    opacity?: number | undefined;
    updateWhenIdle?: boolean | undefined;
    updateWhenZooming?: boolean | undefined;
    updateInterval?: number | undefined;
    zIndex?: number | undefined;
    bounds?: LatLngTuple[] | undefined;
    minZoom?: number | undefined;
    maxZoom?: number | undefined;
    /**
     * Maximum zoom number the tile source has available. If it is specified, the tiles on all zoom levels higher than
     * `maxNativeZoom` will be loaded from `maxNativeZoom` level and auto-scaled.
     */
    maxNativeZoom?: number | undefined;
    /**
     * Minimum zoom number the tile source has available. If it is specified, the tiles on all zoom levels lower than
     * `minNativeZoom` will be loaded from `minNativeZoom` level and auto-scaled.
     */
    minNativeZoom?: number | undefined;
    noWrap?: boolean | undefined;
    pane?: string | undefined;
    className?: string | undefined;
    keepBuffer?: number | undefined;
}

export type CrossOrigin = "anonymous" | "use-credentials" | "";

export type ReferrerPolicy =
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";


export interface TileLayerOptions extends GridLayerOptions {
    id?: string | undefined;
    subdomains?: string | string[] | undefined;
    errorTileUrl?: string | undefined;
    zoomOffset?: number | undefined;
    tms?: boolean | undefined;
    zoomReverse?: boolean | undefined;
    detectRetina?: boolean | undefined;
    crossOrigin?: CrossOrigin | boolean | undefined;
    referrerPolicy?: ReferrerPolicy | boolean | undefined;
}


export type TileLayerProps = {
    url: string;
    options: TileLayerOptions;
}

export interface SourceOptions {
    levelDiff?: number;
    maxDataZoom?: number;
    url?: string;
    sources?: Record<string, SourceOptions>;
}


export interface PaintRule {
    id?: string;
    minzoom?: number;
    maxzoom?: number;
    dataSource?: string;
    dataLayer: string;

}

export interface LabelRule {
    id?: string;
    minzoom?: number;
    maxzoom?: number;
    dataSource?: string;
    dataLayer: string;
    visible?: boolean;

}


export interface ProtomapsLayerProps extends GridLayerOptions {
    bounds?: LatLngTuple[];
    attribution?: string;
    debug?: string;
    lang?: string;
    tileDelay?: number;
    noWrap?: boolean;
    maxDataZoom?: number;
    url?: string;
    sources?: Record<string, SourceOptions>;
    flavor?: "light" | "dark" | "white" | "grayscale" | "black";
    backgroundColor?: string;
}





export interface LeafletLatLng {
    lat: number;
    lng: number;
}

export type LeafletEventType =
    | 'zoomlevelschange'
    | 'unload'
    | 'viewreset'
    | 'load'
    | 'zoomstart'
    | 'movestart'
    | 'zoom'
    | 'move'
    | 'zoomend'
    | 'moveend'
    | 'autopanstart'
    | 'dragstart'
    | 'drag'
    | 'add'
    | 'remove'
    | 'loading'
    | 'error'
    | 'update'
    | 'down'
    | 'predrag';

export interface LeafletEventData {
    latlng: LeafletLatLng | null;
    zoom: number | null;
    type: LeafletEventType;
}



export type LeafletEventHandlerFn = (event: LeafletEventData) => void;


export interface InteractiveLayerOptions extends LayerOptions {
    interactive?: boolean | undefined;
    bubblingMouseEvents?: boolean | undefined;
}


export interface BaseIconOptions extends LayerOptions {
    iconUrl?: string | undefined;
    iconRetinaUrl?: string | undefined;
    iconSize?: PointExpression | undefined;
    iconAnchor?: PointExpression | undefined;
    popupAnchor?: PointExpression | undefined;
    tooltipAnchor?: PointExpression | undefined;
    shadowUrl?: string | undefined;
    shadowRetinaUrl?: string | undefined;
    shadowSize?: PointExpression | undefined;
    shadowAnchor?: PointExpression | undefined;
    className?: string | undefined;
}

export interface IconOptions extends BaseIconOptions {
    iconUrl: string;
    crossOrigin?: CrossOrigin | boolean | undefined;
}


export interface DivIconOptions extends BaseIconOptions {
    html?: string | HTMLElement | false | undefined;
    bgPos?: PointExpression | undefined;
    iconSize?: PointExpression | undefined;
    iconAnchor?: PointExpression | undefined;
    popupAnchor?: PointExpression | undefined;
    className?: string | undefined;
}


export type MarkerIcon = {
    divIcon: DivIconOptions,
    icon?: never
} | {
    divIcon?: never,
    icon: IconOptions
}

export interface MarkerOptions extends InteractiveLayerOptions {
    icon?: MarkerIcon,
    /** Whether the marker is draggable with mouse/touch or not. */
    draggable?: boolean | undefined;
    /** Whether the marker can be tabbed to with a keyboard and clicked by pressing enter. */
    keyboard?: boolean | undefined;
    /** Text for the browser tooltip that appear on marker hover (no tooltip by default). */
    title?: string | undefined;
    /** Text for the `alt` attribute of the icon image (useful for accessibility). */
    alt?: string | undefined;
    /** Option for putting the marker on top of all others (or below). */
    zIndexOffset?: number | undefined;
    /** The opacity of the marker. */
    opacity?: number | undefined;
    /** If `true`, the marker will get on top of others when you hover the mouse over it. */
    riseOnHover?: boolean | undefined;
    /** The z-index offset used for the `riseOnHover` feature. */
    riseOffset?: number | undefined;
    /** `Map pane` where the markers shadow will be added. */
    shadowPane?: string | undefined;
    /** Whether to pan the map when dragging this marker near its edge or not. */
    autoPan?: boolean | undefined;
    /** Distance (in pixels to the left/right and to the top/bottom) of the map edge to start panning the map. */
    autoPanPadding?: PointExpression | undefined;
    /** Number of pixels the map should pan by. */
    autoPanSpeed?: number | undefined;
    autoPanOnFocus?: boolean | undefined;

}


export type MarkerProps = {
    uniqueId: string,
    onPress?: () => void,
    latlng: LatLngExpression,
    options?: MarkerOptions,
    ignoreAutoFit?: boolean | undefined,
}


export type LineCapShape = "butt" | "round" | "square" | "inherit";

export type LineJoinShape = "miter" | "round" | "bevel" | "inherit";

export type FillRule = "nonzero" | "evenodd" | "inherit";

export interface PathOptions extends InteractiveLayerOptions {
    stroke?: boolean | undefined;
    color?: string | undefined;
    weight?: number | undefined;
    opacity?: number | undefined;
    lineCap?: LineCapShape | undefined;
    lineJoin?: LineJoinShape | undefined;
    dashArray?: string | number[] | undefined;
    dashOffset?: string | undefined;
    fill?: boolean | undefined;
    fillColor?: string | undefined;
    fillOpacity?: number | undefined;
    fillRule?: FillRule | undefined;
    className?: string | undefined;
}

export interface PolylineOptions extends PathOptions {
    smoothFactor?: number | undefined;
    noClip?: boolean | undefined;
}

export type PolylineProps = {
    uniqueId: string,
    latlngs: LatLngExpression[] | LatLngExpression[][],
    options?: PolylineOptions,
    ignoreAutoFit?: boolean | undefined,

}

export type PolygonProps = {
    uniqueId: string,
    latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][],
    options?: PolylineOptions,
    ignoreAutoFit?: boolean | undefined,
}


export type RectangleProps = {
    uniqueId: string,
    latlngs: LatLngTuple[],
    options?: PolylineOptions,
    editable?: boolean | undefined,
    onEdit?: (latlngs: LatLngTuple[]) => void,
    ignoreAutoFit?: boolean | undefined,
}
