<template>
  <div
    @click="close"
    class="flex h-full w-full flex-col items-center justify-center p-32 transition-colors duration-300"
    :class="isDarkMode ? 'bg-gray-900/50' : 'bg-blue-500/50'"
  >
    <div
      @click="
        (e) => {
          e.stopPropagation()
        }
      "
      class="relative flex h-fit w-[600px] flex-col gap-y-5 rounded-2xl px-10 py-6 transition-colors duration-300"
      :class="isDarkMode ? 'bg-gray-800' : 'bg-white'"
    >
      <div class="absolute right-5 top-5 flex h-fit w-fit items-center justify-center gap-x-2">
        <button
          class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
          @click="close"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      <p class="text-center text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-black'">Einstellungen</p>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="workLength" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Aktions Dauer
          </label>
          <div class="mt-2">
            <input
              v-model="workLength"
              type="text"
              name="workLength"
              id="workLength"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
              placeholder="60"
            />
          </div>
          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="workLength-description">In Sekunden</p>
        </div>
        <div class="w-full">
          <label for="breakLength" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Pausen Dauer
          </label>
          <div class="mt-2">
            <input
              v-model="breakLength"
              type="text"
              name="breakLength"
              id="breakLength"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
              placeholder="20"
            />
          </div>
          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="breakLength-description">In Sekunden</p>
        </div>
      </div>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="workSoundTime" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Aktions Warn Ton
          </label>
          <div class="mt-2">
            <input
              v-model="workSoundTime"
              type="text"
              name="workSoundTime"
              id="workSoundTime"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
              placeholder="10"
            />
          </div>
          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="workSoundTime-description">
            Wie lange vor Ende der Phase. In Sekunden. 0 um zu deaktivieren.
          </p>
        </div>
        <div class="w-full">
          <label for="breakSoundTime" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Pausen Warn Ton
          </label>
          <div class="mt-2">
            <input
              v-model="breakSoundTime"
              type="text"
              name="breakSoundTime"
              id="breakSoundTime"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
              placeholder="5"
            />
          </div>
          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="breakSoundTime-description">
            Wie lange vor Ende der Phase. In Sekunden. 0 um zu deaktivieren.
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="workTitleTime" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Aktions Titel Dauer
          </label>
          <div class="mt-2">
            <input
              v-model="workTitleTime"
              type="text"
              name="workTitleTime"
              id="workTitleTime"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
              placeholder="2"
            />
          </div>
          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="workTitleTime-description">
            Für wie lange soll der 'Go!' Titel angezeigt werden. In Sekunden. 0 um zu deaktivieren.
          </p>
        </div>
        <div class="w-full">
          <label for="breakTitleTime" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Pausen Titel Dauer
          </label>
          <div class="mt-2">
            <input
              v-model="breakTitleTime"
              type="text"
              name="breakTitleTime"
              id="breakTitleTime"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
              placeholder="2"
            />
          </div>
          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="breakTitleTime-description">
            Für wie lange soll der 'Pause' Titel angezeigt werden. In Sekunden. 0 um zu
            deaktivieren.
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="quotes" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Sprüche
          </label>
          <div class="mt-2">
            <textarea
              v-model="quotesList"
              rows="4"
              name="comment"
              id="comment"
              class="block max-h-96 min-h-[104px] w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
            />
          </div>

          <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" id="quotes-description">
            Zeilenumbrüche trennen die Sprüche
          </p>
        </div>
      </div>
      
      <!-- Dark Mode Settings -->
      <div class="border-t pt-5" :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'">
        <p class="text-lg font-semibold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-black'">Dark Mode Einstellungen</p>
        
        <div class="flex items-center space-x-3 mb-4">
          <input
            v-model="darkModeAutoSwitch"
            type="checkbox"
            id="darkModeAutoSwitch"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="darkModeAutoSwitch" class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
            Automatisch zu Dunkelmodus am Abend wechseln
          </label>
        </div>
        
        <p class="text-xs mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
          App startet immer im Hellmodus und wechselt nur zu den angegebenen Zeiten in den Dunkelmodus.
        </p>
        
        <div class="flex flex-row gap-x-5" v-if="darkModeAutoSwitch">
          <div class="w-full">
            <label for="darkModeStartTime" class="block text-sm font-medium leading-6 transition-colors duration-300" :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'">
              Dunkelmodus ab (Stunde)
            </label>
            <div class="mt-2">
              <input
                v-model="darkModeStartTime"
                type="number"
                name="darkModeStartTime"
                id="darkModeStartTime"
                min="0"
                max="23"
                class="block w-full rounded-md border-0 p-1 pl-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
                :class="isDarkMode ? 'bg-gray-700 text-white ring-gray-600' : 'bg-white text-gray-900 ring-gray-300'"
                placeholder="18"
              />
            </div>
            <p class="mt-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">24-Stunden Format (z.B. 18 für 18:00). App kehrt zu Hellmodus zurück beim nächsten Start.</p>
          </div>
        </div>
      </div>
      
      <!-- workLength: {{ workLength }} <br />
      workSoundTime: {{ workSoundTime }} <br />
      breakLength: {{ breakLength }} <br />
      breakSoundTime: {{ breakSoundTime }} <br />
      quotesList: {{ quotesList }} <br /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { setValue } from './../utils/electronStore.client'
import { computed, ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emits = defineEmits(['close', 'reset'])
const props = defineProps<{
  workLength: number
  workSoundTime: number
  workTitleTime: number
  breakLength: number
  breakSoundTime: number
  breakTitleTime: number
  quotesList: string[]
  isDarkMode: boolean
  darkModeAutoSwitch: boolean
  darkModeStartTime: number
}>()

const workLength = ref(props.workLength.toString())
const workSoundTime = ref(props.workSoundTime.toString())
const workTitleTime = ref(props.workTitleTime.toString())
const breakLength = ref(props.breakLength.toString())
const breakSoundTime = ref(props.breakSoundTime.toString())
const breakTitleTime = ref(props.breakTitleTime.toString())
const quotesList = ref(props.quotesList.join('\n'))
const darkModeAutoSwitch = ref(props.darkModeAutoSwitch)
const darkModeStartTime = ref(props.darkModeStartTime.toString())

const edited = computed(() => {
  return (
    workLength.value !== props.workLength.toString() ||
    workSoundTime.value !== props.workSoundTime.toString() ||
    workTitleTime.value !== props.workTitleTime.toString() ||
    breakLength.value !== props.breakLength.toString() ||
    breakSoundTime.value !== props.breakSoundTime.toString() ||
    breakTitleTime.value !== props.breakTitleTime.toString() ||
    quotesList.value !== props.quotesList.join('\n') ||
    darkModeAutoSwitch.value !== props.darkModeAutoSwitch ||
    darkModeStartTime.value !== props.darkModeStartTime.toString()
  )
})

function save() {
  if (workLength.value === '') workLength.value = '60'
  setValue('workLength', Number(workLength.value))
  if (workSoundTime.value === '') workSoundTime.value = '0'
  setValue('workSoundTime', Number(workSoundTime.value))
  if (workTitleTime.value === '') workTitleTime.value = '2'
  setValue('workTitleTime', Number(workTitleTime.value))
  if (breakLength.value === '') breakLength.value = '20'
  setValue('breakLength', Number(breakLength.value))
  if (breakSoundTime.value === '') breakSoundTime.value = '0'
  setValue('breakSoundTime', Number(breakSoundTime.value))
  if (breakTitleTime.value === '') breakTitleTime.value = '2'
  setValue('breakTitleTime', Number(breakTitleTime.value))
  setValue('quotesList', quotesList.value.trim().split('\n'))
  setValue('darkModeAutoSwitch', darkModeAutoSwitch.value)
  if (darkModeStartTime.value === '') darkModeStartTime.value = '18'
  setValue('darkModeStartTime', Number(darkModeStartTime.value))
}

function close() {
  if (edited.value) {
    save()
    emits('close')
    emits('reset')
  } else {
    emits('close')
  }
}
</script>
