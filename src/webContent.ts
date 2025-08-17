import AsyncStorage from '@react-native-async-storage/async-storage';

const cache: {
    [key: string]: string | undefined
} = {

}

async function fetchWithRetry(
    onlyFresh: boolean,
    key: string,
    url: string,
    maxRetries = 10,
    delay = 5000
): Promise<string> {
    if (!onlyFresh && cache[key]) {
        return cache[key]!;
    }

    let stored = await AsyncStorage.getItem(key);
    if (!onlyFresh && stored) {
        cache[key] = stored;
        return stored;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            await AsyncStorage.setItem(key, text);
            cache[key] = text;
            return text;
        } catch (e) {
            console.warn(`Failed to fetch ${key}, attempt ${attempt}/${maxRetries}`);
            if (attempt < maxRetries) {
                await new Promise((res) => setTimeout(res, delay));
            }
        }
    }

    throw new Error(`Unable to fetch ${key} after ${maxRetries} attempts`);
}



export const getWebContent = async (params: {
    leafletCSSLink: string;
    leafletJsLink: string;
    protomapsJSLink: string;
    leafletDrawCSSLink: string;
    leafletDrawJSLink: string;
    functionsMirrorJS: string;
    injectCSS?: string;
    injectJS?: string;
    injectHTML?: string;
}) => {
    //Загружаем скрипты как текст



    let leafletCSS = await fetchWithRetry(
        false,
        "leafletCSS",
        params.leafletCSSLink
    );
    let leafletJs = await fetchWithRetry(
        false,
        "leafletJs",
        params.leafletJsLink
    );
    let protomapsJs = await fetchWithRetry(
        false,
        "protomapsJs",
        params.protomapsJSLink
    );

    let leafletDrawCSS = await fetchWithRetry(
        false,
        "leafletDrawCSS",
        params.leafletDrawCSSLink
    );
    let leafletDrawJs = await fetchWithRetry(
        false,
        "leafletDrawJs",
        params.leafletDrawJSLink
    );



    return `<!DOCTYPE html>
<html lang="">

<head>
    <meta charset="utf-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title></title>

   
    <script>${leafletJs}</script>
    
    <style>${leafletCSS}</style>

    <script>${protomapsJs}</script>

    <script>${leafletDrawJs}</script>
    <style>${leafletDrawCSS}</style>
   
</head>

<body>
    <div id="map" style="width: 100vw; height: 100vh"></div>
    ${params.injectHTML ? params.injectHTML : ''}
</body>

<script>



   window.onload = function () {
        document.addEventListener("message", function (event) {
            receiveMessage(event.data);
        });
        window.addEventListener("message", function (event) {
            receiveMessage(event.data);
        });
    }

    var map = null;

    var markers = {};
    var polylines = {};
    var polygons = {};
    var rectangles = {};

    var tileLayer = null;



    const receiveMessage = (message) => {

      var data = JSON.parse(message);

      var functionName = data.function;
      var params = data.params;
      
     




      try{

${params.functionsMirrorJS}

}      catch (e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            data: {
                target: functionName,
                message: JSON.stringify(e.message),
            }
        }));
        }
    };


    ${params.injectJS ? params.injectJS : ''}
   
</script>



<style>
    html,
    body {
        overflow: hidden;
        height: 100wh;
        width: 100vw;
        margin: 0;
        padding: 0;
        background: transparent;
    }

    * {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }


    * {
        -webkit-touch-callout: none;
        -moz-touch-callout: none;
        -ms-touch-callout: none;
        touch-callout: none;
    }

    * {
        -webkit-user-drag: none;
        -moz-user-drag: none;
        -ms-user-drag: none;
        user-drag: none;
    }

    .leaflet-bottom,
    .leaflet-top {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    }


     .leaflet-div-icon{
        background: transparent !important;
        border: none !important;
        background-color: transparent !important;
    }
    

    .leaflet-container {
       background: transparent;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

    ${params.injectCSS ? params.injectCSS : ''}
   
</style>


</html>`;
};
