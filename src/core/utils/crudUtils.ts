export function addOne<T>(items: T[] = [], newItem: T): any {
  return [...items, newItem]
}

export function removeOne<T extends { id: string }>(
  items: T[] = [],
  itemId: string
): any {
  return items.filter((item) => item.id !== itemId)
}

export function removeMany<T extends { id: string }>(
  items: T[] = [],
  itemIds: string[]
): any {
  return items.filter((item) => !itemIds.includes(item.id))
}

export function updateOne<T extends { id: string }>(
  items: T[] = [],
  updatedItem: T
): any {
  console.log('!@# crud item: ', updatedItem)
  const x = items.map((item) => {
    console.log(`-- ${item.id} --> ${updatedItem.id}`)
    return item.id === updatedItem.id ? updatedItem : item
  })
  console.log('!@# crud list: ', x)
  return x
}
