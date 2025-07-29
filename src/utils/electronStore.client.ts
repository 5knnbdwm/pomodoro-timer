const keys = [
  'workLength',
  'workSoundTime',
  'workTitleTime',
  'breakLength',
  'breakSoundTime',
  'breakTitleTime',
  'timeDisplay',
  'playSound',
  'quoteEnabled',
  'quotesList',
  'darkMode',
  'darkModeAutoSwitch',
  'darkModeStartTime'
] as const
type Keys = (typeof keys)[number]

export function setValue(key: Keys, value: any) {
  window.electronAPI.setValue(key, value)
}

export async function getValue<T>(key: Keys) {
  const value = (await window.electronAPI.getValue(key)) as T | undefined
  console.log(key, value)
  return value
}
