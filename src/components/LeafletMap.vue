<template>
    <div id="map" class="h-screen w-full"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, defineEmits } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

export default {
    name: 'LeafletMap',
    setup(_, { emit }) {
        const map = ref(null);

        onMounted(() => {
            const crs26917 = new L.Proj.CRS('EPSG:26917',
                '+proj=utm +zone=17 +datum=NAD83 +units=m +no_defs',
                {
                    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
                });

            const latlng = proj4('EPSG:26917', 'EPSG:4326', [447263.68140, 4829457.64344]);

            map.value = L.map('map').setView([latlng[1], latlng[0]], 14);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map.value);

            L.tileLayer.wms('http://localhost:9090/geoserver/ECCCGeoServer/wms', {
                layers: 'ECCCGeoServer:subbasin',
                format: 'image/png',
                transparent: true,
                version: '1.3.0',
                crs: crs26917,
                styles: '',
            }).addTo(map.value);

            // Listen for clicks on the map to fetch data for the clicked polygon
            map.value.on('click', function (e) {
                // Convert clicked lat/lng from EPSG:4326 to EPSG:26917
                const coords26917 = proj4('EPSG:4326', 'EPSG:26917', [e.latlng.lng, e.latlng.lat]);
                const x = coords26917[0].toFixed(4);
                const y = coords26917[1].toFixed(4);
                // Define a small bbox around the clicked point
                const buffer = 1;
                const bbox = `${x - buffer},${y - buffer},${x + buffer},${y + buffer}`;
                const url = `http://localhost:9090/geoserver/ECCCGeoServer/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=ECCCGeoServer:subbasin&outputFormat=application/json&BBOX=${bbox}&crs=EPSG:26917`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // Extract necessary data from the response
                        const newData = data.features[0].properties;
                        if (newData.length) {
                            const featureData = newData.map(data => cleanObject(extractFeatureData(data, 'OBJECTID')));
                            // Assuming featureData includes a list of IDs
                            emit('polygonClicked', {
                                ids: featureData.map(data => data.Id),
                                defaultData: featureData // Replace with default chart data
                            });
                        } else {
                            const featureData = cleanObject(extractFeatureData(newData, 'OBJECTID'));
                            // Assuming featureData includes a list of IDs
                            const arr = [featureData.Id];
                            emit('polygonClicked', {
                                ids: arr,
                                defaultData: featureData // Replace with default chart data
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching feature info:', error));
            });

            const extractFeatureData = (data, options) => {
                // Assuming the response contains the necessary DBF data
                // Customize this to extract and format the needed data
                return Object.keys(data).filter(objKey =>
                    objKey !== options).reduce((newObj, key) => {
                        newObj[key] = data[key];
                        return newObj;
                    }, {}
                    ) || {};
            }

            const cleanObject = (obj) => {
                return Object.fromEntries(
                    Object.entries(obj).filter(([key, value]) => value !== null && value !== '')
                );
            };
        });

        onBeforeUnmount(() => {
            if (map.value) {
                map.value.remove();
            }
        });

        return {
            map,
        };
    },
};
</script>

<style scoped>
#map {
    width: 99vw;
    height: 97vh;
}
</style>