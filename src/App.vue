<template>
  <div class="flex h-screen w-screen flex-col">
    <div class="flex w-full grow flex-col items-center justify-center">
      <div
        class="size-14 rounded-full"
        :class="{
          'bg-red-600': time.mode === 'break',
          'bg-blue-600': time.mode === 'work'
        }"
      />
      <Timer
        :style="{
          'font-size': height / 3 + 'px',
          lineHeight: (height / 3) * 1.25 + 'px'
        }"
        :mode="isTimeDisplay ? 'seconds' : 'minutes'"
        :time="time.time"
      />
      <div
        class="px-32 text-center opacity-0 transition-opacity duration-1000 ease-in-out"
        :class="{
          'opacity-100': isQuoteShowing
        }"
      >
        {{ quotesList[quoteIndex] }}
      </div>
    </div>
    <div
      class="w-full basis-32 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
    >
      <div class="flex h-full w-full flex-row items-center justify-center gap-x-3 rounded-lg p-6">
        <button
          class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700"
          @click="toggleFullscreen"
        >
          <ArrowsPointingInIcon v-if="isFullscreen" class="h-6 w-6" />
          <ArrowsPointingOutIcon v-else class="h-6 w-6" />
        </button>
        <button
          class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700"
          @click="toggleTimeDisplay"
        >
          <ClockIconSolid v-if="isTimeDisplay" class="h-6 w-6" />
          <ClockIconOutline v-else class="h-6 w-6" />
        </button>
        <button
          class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700"
          @click="togglePlaySound"
        >
          <SpeakerWaveIcon v-if="isPlaySound" class="h-6 w-6" />
          <SpeakerXMarkIcon v-else class="h-6 w-6" />
        </button>
        <button
          class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700"
          @click="toggleShowQuote"
        >
          <DocumentTextIcon v-if="isQuoteEnabled" class="h-6 w-6" />
          <DocumentIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize, useIntervalFn } from '@vueuse/core'
import { useSound } from '@vueuse/sound'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  DocumentIcon,
  DocumentTextIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/vue/24/solid'
import { ClockIcon as ClockIconOutline } from '@heroicons/vue/24/outline'

import BeepSound from './assets/one_beep-99630.mp3'
import Timer from './components/Timer.vue'

const initialLoading = ref(true)
const defaultWorkLength = ref(60) // in seconds
const defaultWorkSoundTime = ref(5) // in seconds (0 to disable)
const defaultBreakLength = ref(20) // in seconds
const defaultBreakSoundTime = ref(1) // in seconds (0 to disable)

const isQuoteEnabled = ref(true)
const quotesList = ref([
  'You are the only one who can make the difference between a good and a bad day.',
  'The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle.',
  'If you want to go fast, go alone. If you want to go far, go together.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'Don’t watch the clock; do what it does. Keep going.',
  'Believe you can and you’re halfway there.',
  'The only limit to our realization of tomorrow will be our doubts of today.',
  "You can't use up creativity. It's a finite resource.",
  'It does not matter how slowly you go as long as you do not stop.',
  'The only limit to our realization of tomorrow will be our doubts of today.'
])
const quoteIndex = ref(Math.floor(Math.random() * quotesList.value.length))

const isTimeDisplay = ref(true)
const isFullscreen = ref(false)
const isPlaySound = ref(true)

const { height } = useWindowSize()

async function loadConfig() {
  const workLength = await window.electronAPI.getValue('workLength', defaultWorkLength.value)
  const workSoundTime = await window.electronAPI.getValue(
    'workSoundTime',
    defaultWorkSoundTime.value
  )
  const breakLength = await window.electronAPI.getValue('breakLength', defaultBreakLength.value)
  const breakSoundTime = await window.electronAPI.getValue(
    'breakSoundTime',
    defaultBreakSoundTime.value
  )
  const timeDisplay = await window.electronAPI.getValue('timeDisplay', isTimeDisplay.value)
  const playSound = await window.electronAPI.getValue('playSound', isPlaySound.value)
  const quoteEnabled = await window.electronAPI.getValue('quoteEnabled', isQuoteEnabled.value)

  time.value.time = workLength
  defaultWorkLength.value = workLength
  defaultWorkSoundTime.value = workSoundTime
  defaultBreakLength.value = breakLength
  defaultBreakSoundTime.value = breakSoundTime
  isTimeDisplay.value = timeDisplay
  isPlaySound.value = playSound
  isQuoteEnabled.value = quoteEnabled

  initialLoading.value = false
}
loadConfig()

const time = ref<{
  mode: 'work' | 'break'
  time: number
}>({
  mode: 'work',
  time: defaultWorkLength.value
})

useIntervalFn(() => {
  time.value.time--

  if (time.value.mode === 'work') {
    if (time.value.time === 0) {
      time.value.mode = 'break'
      time.value.time = defaultBreakLength.value
      playBeepSound(true)
    }
    if (time.value.time === defaultWorkSoundTime.value && defaultWorkSoundTime.value !== 0) {
      playBeepSound()
    }
  } else if (time.value.mode === 'break') {
    if (time.value.time === 0) {
      time.value.mode = 'work'
      time.value.time = defaultWorkLength.value
      quoteIndex.value = Math.floor(Math.random() * quotesList.value.length)
    }
    if (time.value.time === defaultBreakSoundTime.value && defaultBreakSoundTime.value !== 0) {
      playBeepSound()
    }
  }
}, 1000)

function toggleTimeDisplay() {
  isTimeDisplay.value = !isTimeDisplay.value
  window.electronAPI.setValue('timeDisplay', isTimeDisplay.value)
}

function toggleFullscreen() {
  window.electronAPI.toggleFullscreen()
  if (isFullscreen.value) {
    isFullscreen.value = false
  } else {
    isFullscreen.value = true
  }
}

function togglePlaySound() {
  isPlaySound.value = !isPlaySound.value
  window.electronAPI.setValue('playSound', isPlaySound.value)
}

const { play } = useSound(BeepSound, {
  volume: 10
})
function playBeepSound(double: boolean = false) {
  if (!isPlaySound.value) return
  play()
  if (double) {
    // wait 1000ms
    setTimeout(() => {
      play()
    }, 600)
  }
}

const isQuoteShowing = computed(() => {
  if (time.value.mode === 'break') return false
  if (!isQuoteEnabled.value) return false

  if (time.value.time - 10 < 0) return false

  if (time.value.time + 10 > defaultWorkLength.value) return false

  return true
})
function toggleShowQuote() {
  isQuoteEnabled.value = !isQuoteEnabled.value
  window.electronAPI.setValue('quoteEnabled', isQuoteEnabled.value)
}

console.log('👋 This message is being logged by "App.vue", included via Vite')
</script>
