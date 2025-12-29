<template>
  <div class="weather-search-bar">
    <el-select
      v-model="selectedValue"
      class="weather-select"
      filterable
      allow-create
      default-first-option
      clearable
      :loading="loading"
      :placeholder="placeholder"
      size="large"
      effect="light"
      @change="handleSearch"
    >
      <template #prefix>
        <el-icon class="search-icon"><Search /></el-icon>
      </template>
      <el-option
        v-for="option in normalizedOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    <el-button 
      class="search-btn" 
      type="primary" 
      size="large" 
      :loading="loading"
      :disabled="!selectedValue" 
      @click="handleSearch"
    >
      查詢天氣
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '請輸入縣市名稱 (例如: 臺北市)',
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const selectedValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const normalizedOptions = computed(() =>
  props.options
    .map((item) => {
      if (typeof item === 'string') {
        return { label: item, value: item }
      }
      if (item && typeof item === 'object') {
        const label = item.label ?? item.value ?? ''
        const value = item.value ?? item.label ?? ''
        return { label, value }
      }
      return null
    })
    .filter((item) => item && item.value)
)

const handleSearch = (val) => {
  const nextValue =
    typeof val === 'string' ? val : typeof selectedValue.value === 'string' ? selectedValue.value : ''
  const trimmed = nextValue.trim()
  if (!trimmed) {
    return
  }
  emit('search', trimmed)
}
</script>

<style scoped>
.weather-search-bar {
  display: flex;
  gap: 12px;
  width: 100%;
}

.weather-select {
  flex: 1;
  /* Customize Element Plus Select Shadow/Border if needed */
  --el-select-input-focus-border-color: var(--el-color-primary);
}

:deep(.el-input__wrapper) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  padding-left: 16px;
}

:deep(.el-input__inner) {
  font-size: 16px;
  height: 48px;
}

.search-btn {
  border-radius: 12px;
  padding: 0 24px;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.5);
  transition: all 0.2s;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgb(59 130 246 / 0.6);
}

.search-icon {
  font-size: 18px;
  color: #9ca3af;
}
</style>
