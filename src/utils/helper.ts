import lodash from 'lodash'

export const dateToString = (date: any): string => {
  if (lodash.isString(date) && !lodash.isEmpty(date)) {
    return date.split('T')[0] ?? ''
  }

  return ''
}
