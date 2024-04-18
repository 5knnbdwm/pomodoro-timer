import Store from 'electron-store'

const store = new Store()

export function set<T>(key: string, value: T) {
  store.set(key, value)
}

export function get<T>(key: string, defaultValue: T): T {
  const value = store.get(key) as T
  if (value === undefined) {
    store.set(key, defaultValue)
    return defaultValue
  }
  return value
}

export function clear() {
  try {
    store.clear()
  } catch (e) {
    console.error(e)
  }
  // store.clear()
}
