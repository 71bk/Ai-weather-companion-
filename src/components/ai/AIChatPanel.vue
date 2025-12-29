<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { ChatDotRound, User, Loading } from '@element-plus/icons-vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['send'])

const input = ref('')
const scrollArea = ref(null)

const canSend = computed(() => input.value.trim().length > 0 && !props.loading)

const handleSend = () => {
  const text = input.value.trim()
  if (!text) return
  emit('send', text)
  input.value = ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight
  }
}

watch(() => props.messages.length, scrollToBottom)
watch(() => props.loading, scrollToBottom)
</script>

<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <div class="header-left">
        <div class="icon-wrapper">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <span class="header-title">Weather AI Chat</span>
      </div>
      <el-tag effect="light" round size="small">Beta</el-tag>
    </div>

    <!-- Message Area -->
    <div class="chat-body" ref="scrollArea">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">🌤️</div>
        <p>有什麼天氣問題嗎？試著問我吧！</p>
        <div class="suggestions">
          <span @click="input = '今天適合洗衣服嗎？'">今天適合洗衣服嗎？</span>
          <span @click="input = '出門需要帶傘嗎？'">出門需要帶傘嗎？</span>
        </div>
      </div>
      
      <div v-else class="messages-list">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message-row"
          :class="msg.role"
        >
          <div v-if="msg.role === 'assistant'" class="avatar bot-avatar">AI</div>
          <div v-else class="avatar user-avatar"><el-icon><User /></el-icon></div>
          
          <div class="bubble">
            {{ msg.content }}
          </div>
        </div>
        
        <div v-if="loading" class="message-row assistant">
          <div class="avatar bot-avatar">AI</div>
          <div class="bubble loading-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-footer">
      <el-input
        v-model="input"
        class="chat-input"
        placeholder="輸入問題 (Enter 送出)..."
        @keydown.enter.exact.prevent="handleSend"
      >
        <template #suffix>
          <el-button 
            type="primary" 
            circle
            :disabled="!canSend"
            @click="handleSend"
          >
             <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
             <el-icon v-else><ChatDotRound /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

/* Header */
.chat-header {
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-title {
  font-weight: 700;
  color: #1e293b;
  font-size: 1.1rem;
}

/* Body */
.chat-body {
  flex: 1;
  background: #f8fafc;
  padding: 20px 24px 28px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Empty State */
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.suggestions span {
  font-size: 0.85rem;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestions span:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Messages */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-row {
  display: flex;
  gap: 12px;
  max-width: 76%;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-row.assistant {
  align-self: flex-start;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.bot-avatar {
  background: #3b82f6;
  color: white;
}

.user-avatar {
  background: #e2e8f0;
  color: #64748b;
}

.bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.assistant .bubble {
  background: white;
  color: #334155;
  border-top-left-radius: 4px;
}

.user .bubble {
  background: #3b82f6;
  color: white;
  border-top-right-radius: 4px;
}

/* Loading Dots */
.loading-bubble {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 16px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #cbd5e1;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Footer */
.chat-footer {
  padding: 16px 24px 20px;
  background: white;
  border-top: 1px solid #f1f5f9;
}

.chat-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  padding-left: 20px;
  min-height: 48px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  background: #f8fafc;
}

.chat-input :deep(.el-input__wrapper.is-focus) {
  background: white;
  box-shadow: 0 0 0 2px #3b82f6 inset;
}

.chat-input :deep(.el-input-group__append) {
  background: transparent;
  border: none;
  box-shadow: none;
}
</style>
