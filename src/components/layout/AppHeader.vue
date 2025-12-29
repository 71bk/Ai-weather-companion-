<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Sunny, 
  ChatDotRound, 
  TrendCharts, 
  InfoFilled 
} from '@element-plus/icons-vue'

const route = useRoute()

const menuItems = [
  { label: '首頁', path: '/', icon: Sunny },
  { label: 'AI 助理', path: '/assistant', icon: ChatDotRound },
  { label: '圖表分析', path: '/charts', icon: TrendCharts },
  { label: '關於專案', path: '/about', icon: InfoFilled },
]

const activePath = computed(() => route.path)
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      
      <!-- Logo Area -->
      <div class="brand" @click="$router.push('/')">
        <div class="logo-circle">
          <span class="logo-emoji">🌤️</span>
        </div>
        <div class="brand-text">
          <span class="title">AI Weather</span>
          <span class="subtitle">Companion</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-wrapper">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: activePath === item.path }"
        >
          <el-icon class="nav-icon"><component :is="item.icon" /></el-icon>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Mobile Menu (Optional placeholder for future expansion) -->
      <div class="mobile-menu-btn">
        <!-- Add hamburger icon here if needed for mobile -->
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  height: 70px;
  transition: all 0.3s ease;
}

.header-container {
  max-width: 1440px; /* Match global max-width */
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand Logo */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
}

.logo-circle {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  transition: transform 0.2s;
}

.brand:hover .logo-circle {
  transform: rotate(10deg) scale(1.05);
}

.logo-emoji {
  font-size: 20px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Navigation */
.nav-wrapper {
  display: flex;
  gap: 8px;
  background: rgba(241, 245, 249, 0.5);
  padding: 4px;
  border-radius: 14px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #334155;
  background: rgba(255, 255, 255, 0.5);
}

.nav-item.active {
  background: white;
  color: #2563eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.nav-icon {
  font-size: 1.1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-label {
    display: none; /* Hide text on mobile, keep icons */
  }
  
  .nav-item {
    padding: 10px;
  }
}
</style>