<template>
  <div class="mb-4">
    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">{{ label }}</label>
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({ label: String })
</script>