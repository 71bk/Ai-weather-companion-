<script setup>
import { computed } from 'vue'
import ForecastItemCard from './ForecastItemCard.vue'

const props = defineProps({
  forecasts: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '未來 36 小時',
  },
})

const items = computed(() => (Array.isArray(props.forecasts) ? props.forecasts : []))
</script>

<template>
  <el-card class="forecast-list-card">
    <template #header>
      <div class="forecast-list-title">{{ title }}</div>
    </template>
    <el-empty v-if="items.length === 0" description="尚無預報資料" />
    <div v-else class="forecast-list">
      <ForecastItemCard v-for="(item, index) in items" :key="index" :item="item" />
    </div>
  </el-card>
</template>

<style scoped>
.forecast-list-card {
  max-width: 960px;
}

.forecast-list-title {
  font-weight: 600;
}

.forecast-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
</style>
