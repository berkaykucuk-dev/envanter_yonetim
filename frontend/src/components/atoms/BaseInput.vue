<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="type" :required="required" class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
</template>
<script setup>
defineProps({ modelValue: [String, Number], type: { type: String, default: 'text' }, required: Boolean })
defineEmits(['update:modelValue'])
</script>
