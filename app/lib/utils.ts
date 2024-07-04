export const toCamelCase = (row: Record<string, any>) => {
  const newRow: Record<string, any> = {}
  for (const key in row) {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    )
    newRow[camelCaseKey] = row[key]
  }
  return newRow
}

export const mapToOptions = (map: Record<string | number | symbol, string>) => {
  return Object.entries(map).map(([key, value]) => ({
    label: value,
    value: key,
  }))
}

export function getKeyByValue(
  object: Record<string | number | symbol, string>,
  value: string,
) {
  for (const key in object) {
    if (object[key] === value) {
      return key
    }
  }
  return null
}

export function objectHavingKeys(
  obj: Record<string | number | symbol, any>,
  keys: Array<string | number | symbol>,
) {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const itemKeys = Object.keys(obj)

  // Check if all keys are present in the object
  return (
    itemKeys.length === keys.length &&
    itemKeys.every((key) => keys.includes(key))
  )
}
