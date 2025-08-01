<template>
  <div class="relative flex h-screen w-screen flex-col transition-colors duration-300" :class="darkModeClasses.background">
    <div v-if="!initialLoading" class="flex w-full grow flex-col items-center justify-center">
      <div class="flex basis-1/3 items-end">
        <div
          class="h-14 w-32 rounded-full"
          :class="{
            'bg-red-600': time.mode === 'break',
            'bg-blue-600': time.mode === 'work'
          }"
        />
      </div>
      <div class="basis-1/3">
        <template v-if="isShowTitle">
          <p
            :style="{
              'font-size': height / 2 + 'px',
              lineHeight: (height / 2) * 1.25 + 'px'
            }"
            class="font-bold transition-colors duration-300"
            :class="darkModeClasses.text"
          >
            <template v-if="time.mode === 'work'">Go!</template>
            <template v-else>Pause</template>
          </p>
        </template>
        <Timer
          v-else
          :style="{
            'font-size': height / 2 + 'px',
            lineHeight: (height / 2) * 1.25 + 'px'
          }"
          class="font-bold transition-colors duration-300"
          :class="darkModeClasses.text"
          :mode="isTimeDisplay ? 'seconds' : 'minutes'"
          :time="time.time"
        />
      </div>
      <div
        class="basis-1/3 px-32 text-center opacity-0 transition-all duration-1000 ease-in-out"
        :class="[
          {
            'opacity-100': isQuoteShowing
          },
          darkModeClasses.text
        ]"
        :style="{
          'font-size': height / 18 + 'px',
          lineHeight: (height / 18) * 1.25 + 'px'
        }"
      >
        {{ quotesList[quoteIndex] }}
      </div>
    </div>
    <template v-if="!initialLoading">
      <ConfigScreen
        class="absolute left-0 top-0 z-10 h-full w-full"
        @close="isShowConfig = false"
        @reset="loadConfig"
        v-if="isShowConfig"
        :workLength="defaultWorkLength"
        :workSoundTime="defaultWorkSoundTime"
        :workTitleTime="defaultWorkTitleTime"
        :breakLength="defaultBreakLength"
        :breakSoundTime="defaultBreakSoundTime"
        :breakTitleTime="defaultBreakTitleTime"
        :quotesList="quotesList"
        :isDarkMode="isDarkMode"
        :darkModeAutoSwitch="darkModeAutoSwitch"
        :darkModeStartTime="darkModeStartTime"
      />
      <div
        class="absolute bottom-0 h-32 w-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
      >
        <div class="flex h-full w-full flex-row items-center justify-center gap-x-3 rounded-lg p-6">
          <button
            class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
            @click="toggleFullscreen"
          >
            <ArrowsPointingInIcon v-if="isFullscreen" class="h-6 w-6" />
            <ArrowsPointingOutIcon v-else class="h-6 w-6" />
          </button>
          <button
            class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
            @click="toggleTimeDisplay"
          >
            <ClockIconSolid v-if="isTimeDisplay" class="h-6 w-6" />
            <ClockIconOutline v-else class="h-6 w-6" />
          </button>
          <button
            class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
            @click="togglePlaySound"
          >
            <SpeakerWaveIcon v-if="isPlaySound" class="h-6 w-6" />
            <SpeakerXMarkIcon v-else class="h-6 w-6" />
          </button>
          <button
            class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
            @click="toggleShowQuote"
          >
            <DocumentTextIcon v-if="isQuoteEnabled" class="h-6 w-6" />
            <DocumentIcon v-else class="h-6 w-6" />
          </button>
          <button
            class="h-fit w-fit cursor-pointer rounded-lg p-2 text-white transition-colors duration-200"
            :class="{
              'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700': isDarkMode,
              'bg-gray-800 hover:bg-gray-700 active:bg-gray-900': !isDarkMode
            }"
            @click="toggleDarkMode"
          >
            <SunIcon v-if="isDarkMode" class="h-6 w-6" />
            <MoonIcon v-else class="h-6 w-6" />
          </button>
          <button
            class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
            @click="showConfig"
          >
            <Cog6ToothIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
      <div class="absolute top-0 w-full p-10 text-end">
        <p
          class="transition-colors duration-300"
          :class="darkModeClasses.muted"
          :style="{
            'font-size': height / 15 + 'px',
            lineHeight: (height / 15) * 1.25 + 'px'
          }"
        >
          {{ currentTime.toLocaleTimeString() }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWindowSize, useIntervalFn } from '@vueuse/core'
import { useSound } from '@vueuse/sound'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  DocumentIcon,
  DocumentTextIcon,
  ClockIcon as ClockIconSolid,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/solid'
import { ClockIcon as ClockIconOutline, Cog6ToothIcon } from '@heroicons/vue/24/outline'

import BeepSound from './assets/beep.mp3'
import Timer from './components/Timer.vue'
import ConfigScreen from './components/ConfigurationScreen.vue'
import { setValue, getValue } from './utils/electronStore.client'

const initialLoading = ref(true)
const defaultWorkLength = ref(60) // in seconds
const defaultWorkSoundTime = ref(5) // in seconds (0 to disable)
const defaultWorkTitleTime = ref(2) // in seconds (0 to disable)
const defaultBreakLength = ref(20) // in seconds
const defaultBreakSoundTime = ref(1) // in seconds (0 to disable)
const defaultBreakTitleTime = ref(2) // in seconds (0 to disable)

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
const currentTime = ref(new Date())

const isTimeDisplay = ref(true)
const isFullscreen = ref(false)
const isPlaySound = ref(true)

const { height } = useWindowSize()

async function loadConfig() {
  time.value.time = (await getValue('workLength')) ?? defaultWorkLength.value
  time.value.mode = 'work'
  defaultWorkLength.value = (await getValue('workLength')) ?? defaultWorkLength.value
  defaultWorkSoundTime.value = (await getValue('workSoundTime')) ?? defaultWorkSoundTime.value
  defaultWorkTitleTime.value = (await getValue('workTitleTime')) ?? defaultWorkTitleTime.value
  defaultBreakLength.value = (await getValue('breakLength')) ?? defaultBreakLength.value
  defaultBreakSoundTime.value = (await getValue('breakSoundTime')) ?? defaultBreakSoundTime.value
  defaultBreakTitleTime.value = (await getValue('breakTitleTime')) ?? defaultBreakTitleTime.value
  isTimeDisplay.value = (await getValue('timeDisplay')) ?? isTimeDisplay.value
  isPlaySound.value = (await getValue('playSound')) ?? isPlaySound.value
  isQuoteEnabled.value = (await getValue('quoteEnabled')) ?? isQuoteEnabled.value
  quotesList.value = (await getValue('quotesList')) ?? quotesList.value
  isDarkMode.value = (await getValue('darkMode')) ?? isDarkMode.value
  darkModeAutoSwitch.value = (await getValue('darkModeAutoSwitch')) ?? darkModeAutoSwitch.value
  darkModeStartTime.value = (await getValue('darkModeStartTime')) ?? darkModeStartTime.value

  // Initialize dark mode based on current time and settings
  initializeDarkMode()

  initialLoading.value = false
}

const time = ref<{
  mode: 'work' | 'break'
  time: number
}>({
  mode: 'work',
  time: defaultWorkLength.value
})

useIntervalFn(() => {
  currentTime.value = new Date()

  // Check for auto dark mode switching every minute
  if (currentTime.value.getSeconds() === 0) {
    checkAutoSwitchDarkMode()
  }

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
  setValue('timeDisplay', isTimeDisplay.value)
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
  setValue('playSound', isPlaySound.value)
}
const { play } = useSound(BeepSound, {
  volume: 10
})
function playBeepSound(double: boolean = false) {
  if (!isPlaySound.value) return
  play()

  if (double) {
    setTimeout(() => {
      play()
    }, 700)
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
  setValue('quoteEnabled', isQuoteEnabled.value)
}

const isShowConfig = ref(false)
function showConfig() {
  isShowConfig.value = true
}

const isShowTitle = computed(() => {
  if (time.value.mode === 'work') {
    if (defaultWorkLength.value - time.value.time < defaultWorkTitleTime.value) return true
  } else if (time.value.mode === 'break') {
    if (defaultBreakLength.value - time.value.time < defaultBreakTitleTime.value) return true
  }

  return false
})

// Dark mode functionality
const isDarkMode = ref(false)
const darkModeAutoSwitch = ref(true)
const darkModeStartTime = ref(18) // 6 PM (24-hour format)

const darkModeClasses = computed(() => {
  if (isDarkMode.value) {
    return {
      background: 'dark bg-gray-900',
      text: 'text-white',
      muted: 'text-gray-300'
    }
  } else {
    return {
      background: 'bg-white',
      text: 'text-black',
      muted: 'text-gray-600'
    }
  }
})

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  // Disable auto-switch when manually toggled
  darkModeAutoSwitch.value = false
  setValue('darkMode', isDarkMode.value)
  setValue('darkModeAutoSwitch', darkModeAutoSwitch.value)
  updateDocumentClass()
}

function updateDocumentClass() {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function checkAutoSwitchDarkMode() {
  if (!darkModeAutoSwitch.value) return
  
  const now = new Date()
  const currentHour = now.getHours()
  
  // Only switch to dark mode during evening/night hours (after start time)
  const shouldBeDark = currentHour >= darkModeStartTime.value
  
  if (shouldBeDark !== isDarkMode.value) {
    isDarkMode.value = shouldBeDark
    setValue('darkMode', isDarkMode.value)
    updateDocumentClass()
  }
}

// Initialize dark mode on app start
function initializeDarkMode() {
  if (darkModeAutoSwitch.value) {
    // If auto-switch is enabled, determine mode based on current time
    // This will override any saved preference to ensure proper time-based switching
    const now = new Date()
    const currentHour = now.getHours()
    const shouldBeDark = currentHour >= darkModeStartTime.value
    
    isDarkMode.value = shouldBeDark
    setValue('darkMode', isDarkMode.value)
  }
  // If auto-switch is disabled, keep the saved preference (or default to false)
  
  updateDocumentClass()
}

// Watch for dark mode changes
watch(isDarkMode, updateDocumentClass, { immediate: true })

loadConfig()
</script>
