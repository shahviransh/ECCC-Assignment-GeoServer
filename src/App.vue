<template>
  <div id="app">
    <!-- Use the LeafletMap component and listen for the polygonClicked event -->
    <LeafletMap @polygonClicked="showPopupWithChart" />

    <!-- Popup for displaying the chart -->
    <div v-if="popupData" :class="['popup', { 'wide-popup': isLineChart }]" v-draggable>
      <SelectID class="selectClass" :ids="popupData.ids" @idSelected="updateChartWithID" />
      <!-- Use the PieChartDisplay component to display the pie chart -->
      <PieChartDisplay v-if="popupData.type === 'pie'" :option="chartOptions" />
      <!-- Use the LineChartDisplay component to display the line chart -->
      <LineChartDisplay v-else :option="chartOptions" />
    </div>
  </div>
</template>

<script>
import LeafletMap from './components/LeafletMap.vue'; // Import the LeafletMap component
import PieChartDisplay from './components/PieChartDisplay.vue'; // Import the ChartDisplay component
import LineChartDisplay from './components/LineChartDisplay.vue'; // Import the ChartDisplay component
import SelectID from './components/SelectID.vue'; // Import the SelectID component
import draggable from './directives/draggable.js'; // Import the draggable directive

export default {
  name: 'App',
  components: {
    LeafletMap, // Register the LeafletMap component
    LineChartDisplay, // Register the ChartDisplay component
    PieChartDisplay, // Register the ChartDisplay component
    SelectID, // Register the SelectID component
  },
  directives: {
    // Register the draggable directive
    draggable,
  },
  data() {
    return {
      popupData: null, // Data to be displayed in the popup
      chartOptions: {}, // Options for the chart
      selectedID: null, // Currently selected ID
    };
  },
  computed: {
    isLineChart() {
      return this.popupData && this.popupData.type !== 'pie';
    },
  },
  methods: {
    extractFeatureData(data, options) {
      // Remove the options key from the data object
      return Object.keys(data).filter(objKey =>
        objKey !== options).reduce((newObj, key) => {
          newObj[key] = data[key];
          return newObj;
        }, {}
        ) || {};
    },

    cleanObject(obj) {
      // cleanObject function to remove null and empty values from an object
      return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== '')
      );
    },
    showPopupWithChart(data) {
      this.popupData = data;
      const url = `http://localhost:9090/geoserver/ECCCGeoServer/wfs?service=WFS&version=1.3.0&request=GetFeature&typename=ECCCGeoServer:subbasin&outputFormat=application/json&crs=EPSG:26917`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.popupData.ids = [... new Set(data.features.map(data => data.properties.OBJECTID))];
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      // Generate chart options based on the fetched data
      this.chartOptions = this.popupData.defaultData.length > 1
        ? this.generateLineChartOptions(this.popupData.defaultData)
        : this.generatePieChartOptions(this.popupData.defaultData);
    },
    updateChartWithID(id) {
      this.chartOptions = null;
      this.selectedID = id;
      // Fetch data for the selected ID and update chart options
      this.fetchDataForID(id);
    },
    fetchDataForID(id) {
      // Fetch data for the selected ID and update the chart options
      const url = `http://localhost:9090/geoserver/ECCCGeoServer/wfs?service=WFS&version=1.3.0&request=GetFeature&typename=ECCCGeoServer:subbasin&outputFormat=application/json&CQL_FILTER=OBJECTID=${id}&crs=EPSG:26917`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const newData = data.features.map(data => data.properties);
          this.popupData.defaultData = newData.map(data => this.cleanObject(this.extractFeatureData(data, 'OBJECTID')));
          // Update the chart type and options based on the fetched data
          this.popupData.type = this.popupData.defaultData.length > 1 ? 'line' : 'pie';
          this.chartOptions = this.popupData.defaultData.length > 1
            ? this.generateLineChartOptions(this.popupData.defaultData)
            : this.generatePieChartOptions(this.popupData.defaultData[0]);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    generateLineChartOptions(data) {
      // Customize the chart options based on the data
      return {
        title: {
          text: 'Polygon Data Chart',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{a} <br/>{b} : {c}',
        },
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
          type: 'category',
          data: Object.values(data).map(data => data.Time),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: Object.values(data).map(data => data.Q_m3),
            smooth: true,
          },
        ],
      };
    },
    generatePieChartOptions(data) {
      // Customize the chart options based on the data
      return {
        title: {
          text: 'Polygon Pie Chart',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: Object.keys(data),
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '55%'], // Inner and outer radius
            center: ['50%', '60%'],
            roseType: 'area', // This makes the segments have equal angles but vary in radius
            data: Object.entries(data).map(([key, val], index) => ({
              value: val,
              name: key
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
#app {
  width: 99vw;
  height: 97vh;
  position: relative;
}

.popup {
  top: 10px;
  left: 10px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 10px;
  z-index: 1000;
  transition: width 0.3s ease;
}

.wide-popup {
  width: 600px;
  /* Adjust width for line charts */
}

.selectClass {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>