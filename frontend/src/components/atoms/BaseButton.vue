<template>
  <button :type="type" :class="['px-4 py-2 rounded text-sm font-medium transition-colors', variantClass]">
    <slot></slot>
  </button>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ type: { type: String, default: 'button' }, variant: { type: String, default: 'primary' } })
const variantClass = computed(() => props.variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300')
</script>
