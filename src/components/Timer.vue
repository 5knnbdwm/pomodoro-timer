<template>
  <p>{{ displayTime }}</p>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  mode: 'seconds' | 'minutes'
  time: number
}>()

const displayTime = ref('')

function leftPad(str: string, length: number, char: string = ' '): string {
  if (str.length >= length) {
    return str
  } else {
    const padding = char.repeat(length - str.length)
    return padding + str
  }
}

watch(
  () => props,
  () => {
    if (props.mode === 'seconds') {
      displayTime.value = props.time.toString() + 's'
    } else {
      const minutes = Math.floor(props.time / 60)
      const seconds = props.time % 60
      displayTime.value = `${minutes}:${leftPad(seconds.toString(), 2, '0')}`
    }
  },
  { immediate: true, deep: true }
)
</script>
