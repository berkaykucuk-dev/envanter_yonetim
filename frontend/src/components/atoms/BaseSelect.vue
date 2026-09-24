<template>
  <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" :required="required" class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
    <slot></slot>
  </select>
</template>
<script setup>
defineProps({ modelValue: [String, Number], required: Boolean })
defineEmits(['update:modelValue'])
</script>
