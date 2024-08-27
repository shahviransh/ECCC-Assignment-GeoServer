<template>
    <div>
        <!-- Select ID component to choose the ID from a list of IDs -->
        <select v-model="selectedID" class="custom-select" @change="emitSelectedID">
            <option value="" disabled selected>Select ID</option>
            <option v-for="id in ids" :key="id" :value="id">{{ id }}</option>
        </select>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Define props for the component
defineProps({
    ids: {
        type: Array,
        required: true,
    },
});

// Define emits for the component
const emits = defineEmits(['idSelected']);
const selectedID = ref(null);

// Emit the selected ID
const emitSelectedID = () => {
    emits('idSelected', selectedID.value);
};
</script>

<style scoped>
.custom-select {
    margin: 0 auto;
    width: 200px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
    text-align: center;
}

.custom-select option {
    background-color: #333;
    color: #fff;
}
</style>