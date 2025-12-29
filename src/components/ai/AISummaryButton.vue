<script setup>
import { ChatLineRound } from '@element-plus/icons-vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '一鍵 AI 總結',
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.loading || props.disabled) {
    return
  }
  emit('click')
}
</script>

<template>
  <el-button
    type="primary"
    class="summary-button"
    :loading="loading"
    :disabled="disabled"
    @click="handleClick"
  >
    <el-icon v-if="!loading">
      <ChatLineRound />
    </el-icon>
    <span>{{ label }}</span>
  </el-button>
</template>

<style scoped>
.summary-button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
</style>
