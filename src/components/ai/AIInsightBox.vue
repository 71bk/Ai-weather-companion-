<script setup>
import { computed } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: 'AI 智慧洞察',
  },
  content: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  emptyMessage: {
    type: String,
    default: '尚無分析結果',
  },
})

// Process markdown-like formatting (simple bolding) and cleanup
const formattedLines = computed(() =>
  props.content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
)
</script>

<template>
  <div class="insight-container">
    <!-- Header -->
    <div class="insight-header">
      <div class="header-icon">
        <el-icon><MagicStick /></el-icon>
      </div>
      <h3 class="header-title">{{ title }}</h3>
      <div v-if="loading" class="pulse-dot"></div>
    </div>

    <!-- Body -->
    <div class="insight-body">
      <!-- Error State -->
      <div v-if="error" class="state-container error">
        <el-alert :title="error" type="error" show-icon :closable="false" />
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="state-container loading">
        <el-skeleton animated>
          <template #template>
             <div class="skeleton-wrapper">
               <el-skeleton-item variant="text" style="width: 80%; height: 20px; margin-bottom: 12px" />
               <el-skeleton-item variant="text" style="width: 90%; height: 16px; margin-bottom: 8px" />
               <el-skeleton-item variant="text" style="width: 70%; height: 16px" />
             </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Content State -->
      <div v-else-if="formattedLines.length" class="content-wrapper">
        <div 
          v-for="(line, index) in formattedLines" 
          :key="index"
          class="insight-paragraph"
        >
          {{ line }}
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="state-container empty">
        <p>{{ emptyMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.insight-container {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e0f2fe; /* Light blue border */
  box-shadow: 0 4px 12px -2px rgba(14, 165, 233, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.insight-container:hover {
  box-shadow: 0 8px 16px -4px rgba(14, 165, 233, 0.15);
  transform: translateY(-2px);
}

/* Header */
.insight-header {
  background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #bae6fd;
}

.header-icon {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0284c7;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0369a1;
  flex: 1;
}

/* Pulsing Dot for Loading */
.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #0284c7;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(2, 132, 199, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(2, 132, 199, 0); }
}

/* Body */
.insight-body {
  padding: 20px;
}

.state-container {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.state-container.empty {
  align-items: center;
  color: #94a3b8;
  font-style: italic;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-paragraph {
  color: #334155;
  line-height: 1.6;
  font-size: 0.95rem;
  position: relative;
  padding-left: 14px;
}

/* Add a nice decorative bar for each paragraph */
.insight-paragraph::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background: #cbd5e1;
  border-radius: 2px;
  transition: background 0.3s;
}

.insight-paragraph:hover::before {
  background: #38bdf8;
}
</style>