<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <el-card class="intro-card">
    <template #header>
      <div class="card-header">
        <span>{{ msg }}</span>
        <el-tag size="small" type="success">UI Ready</el-tag>
      </div>
    </template>
    <div class="card-body">
      <p>Start building the weather UI with Element Plus components.</p>
      <div class="actions">
        <el-button type="primary" @click="count++"
          >Count is {{ count }}</el-button
        >
        <el-button @click="count = 0">Reset</el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.intro-card {
  max-width: 640px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.card-body {
  display: grid;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
