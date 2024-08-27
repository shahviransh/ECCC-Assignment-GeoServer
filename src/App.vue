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
    showPopupWithChart(data) {
      this.popupData = data;
      // Generate chart options based on the fetched data
      this.chartOptions = this.popupData.defaultData.length > 1
        ? this.generateLineChartOptions(this.popupData.defaultData)
        : this.generatePieChartOptions(this.popupData.defaultData);
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
      if (this.popupData.defaultData.length > 1) {
        const temp = this.popupData.defaultData.find(data => data.Id === id);

        this.chartOptions = this.generateLineChartOptions(temp);
      }
      else {
        this.chartOptions = this.generatePieChartOptions(this.popupData.defaultData);
      }
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
  width: 600px; /* Adjust width for line charts */
}

.selectClass {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>