const keys = [
  'workLength',
  'workSoundTime',
  'breakLength',
  'breakSoundTime',
  'timeDisplay',
  'playSound',
  'quoteEnabled',
  'quotesList'
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
