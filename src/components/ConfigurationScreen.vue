<template>
  <div
    @click="close"
    class="flex h-full w-full flex-col items-center justify-center bg-blue-500/50 p-32"
  >
    <div
      @click="
        (e) => {
          e.stopPropagation()
        }
      "
      class="relative flex h-fit w-[600px] flex-col gap-y-5 rounded-2xl bg-white px-10 py-6"
    >
      <div class="absolute right-5 top-5 flex h-fit w-fit items-center justify-center gap-x-2">
        <button
          class="h-fit w-fit cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 active:bg-blue-700"
          @click="close"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      <p class="text-center text-2xl font-bold">Einstellungen</p>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="workLength" class="block text-sm font-medium leading-6 text-gray-900">
            Aktions Dauer
          </label>
          <div class="mt-2">
            <input
              v-model="workLength"
              type="text"
              name="workLength"
              id="workLength"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="60"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500" id="workLength-description">In Sekunden</p>
        </div>
        <div class="w-full">
          <label for="workLength" class="block text-sm font-medium leading-6 text-gray-900">
            Aktions Warn Ton
          </label>
          <div class="mt-2">
            <input
              v-model="workSoundTime"
              type="text"
              name="workLength"
              id="workLength"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="10"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500" id="workLength-description">
            Wie lange vor Ende der Phase. In Sekunden. 0 um zu deaktivieren.
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="breakLength" class="block text-sm font-medium leading-6 text-gray-900">
            Pausen Dauer
          </label>
          <div class="mt-2">
            <input
              v-model="breakLength"
              type="text"
              name="breakLength"
              id="breakLength"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="20"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500" id="breakLength-description">In Sekunden</p>
        </div>

        <div class="w-full">
          <label for="breakLength" class="block text-sm font-medium leading-6 text-gray-900">
            Pausen Warn Ton
          </label>
          <div class="mt-2">
            <input
              v-model="breakSoundTime"
              type="text"
              name="breakLength"
              id="breakLength"
              min="0"
              class="block w-full rounded-md border-0 p-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="5"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500" id="breakLength-description">
            Wie lange vor Ende der Phase. In Sekunden. 0 um zu deaktivieren.
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-x-5">
        <div class="w-full">
          <label for="quotes" class="block text-sm font-medium leading-6 text-gray-900">
            Sprüche
          </label>
          <div class="mt-2">
            <textarea
              v-model="quotesList"
              rows="4"
              name="comment"
              id="comment"
              class="block max-h-96 min-h-[104px] w-full rounded-md border-0 p-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <p class="mt-2 text-sm text-gray-500" id="quotes-description">
            Zeilenumbrüche trennen die Sprüche
          </p>
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
  breakLength: number
  breakSoundTime: number
  quotesList: string[]
}>()

const workLength = ref(props.workLength.toString())
const workSoundTime = ref(props.workSoundTime.toString())
const breakLength = ref(props.breakLength.toString())
const breakSoundTime = ref(props.breakSoundTime.toString())
const quotesList = ref(props.quotesList.join('\n'))

const edited = computed(() => {
  return (
    workLength.value !== props.workLength.toString() ||
    workSoundTime.value !== props.workSoundTime.toString() ||
    breakLength.value !== props.breakLength.toString() ||
    breakSoundTime.value !== props.breakSoundTime.toString() ||
    quotesList.value !== props.quotesList.join('\n')
  )
})

function save() {
  if (workLength.value === '') workLength.value = '60'
  setValue('workLength', Number(workLength.value))
  if (workSoundTime.value === '') workSoundTime.value = '0'
  setValue('workSoundTime', Number(workSoundTime.value))
  if (breakLength.value === '') breakLength.value = '20'
  setValue('breakLength', Number(breakLength.value))
  if (breakSoundTime.value === '') breakSoundTime.value = '0'
  setValue('breakSoundTime', Number(breakSoundTime.value))
  setValue('quotesList', quotesList.value.trim().split('\n'))
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
