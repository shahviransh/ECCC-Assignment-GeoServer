<template>
  <div id="app">
    <!-- Use the LeafletMap component and listen for the polygonClicked event -->
    <LeafletMap @polygonClicked="showPopupWithChart" />

    <!-- Popup for displaying the chart -->
    <div v-if="popupData" class="popup">
      <SelectID :ids="popupData.ids" @idSelected="updateChartWithID" />
      <ChartDisplay :option="chartOptions" />
    </div>
  </div>
</template>

<script>
import LeafletMap from './components/LeafletMap.vue'; // Import the LeafletMap component
import ChartDisplay from './components/ChartDisplay.vue'; // Import the ChartDisplay component
import SelectID from './components/SelectID.vue'; // Import the SelectID component

export default {
  name: 'App',
  components: {
    LeafletMap, // Register the LeafletMap component
    ChartDisplay, // Register the ChartDisplay component
    SelectID, // Register the SelectID component
  },
  data() {
    return {
      popupData: null, // Data to be displayed in the popup
      chartOptions: {}, // Options for the chart
      selectedID: null, // Currently selected ID
    };
  },
  methods: {
    showPopupWithChart(data) {
      this.popupData = data;
      // Generate chart options based on the fetched data
      this.chartOptions = this.generateChartOptions(data.defaultData);
    },
    updateChartWithID(id) {
      this.selectedID = id;
      // Fetch data for the selected ID and update chart options
      this.fetchDataForID(id);
    },
    fetchDataForID(id) {
      // Fetch data for the selected ID and update the chart options
      // If there are multiple IDs, fetch data for each ID and update the chart options
      // Else, fetch data for the single ID and update the chart options
      if (this.popupData.defaultData.length) {
        const temp = this.popupData.defaultData.find(data => data.Id === id);

        this.chartOptions = this.generateChartOptions(temp);
      }
      else {
        this.chartOptions = this.generateChartOptions(this.popupData.defaultData);
      }
    },
    generateChartOptions(data) {
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
            radius: '55%',
            center: ['50%', '60%'],
            data: Object.entries(this.popupData.defaultData).map(([key, val], index) => ({
              value: val,
              name: key  // You can customize this as needed
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
  position: absolute;
  top: 10px;
  right: 10px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 10px;
  z-index: 1000;
  /* Ensure popup is above the map */
}
</style>