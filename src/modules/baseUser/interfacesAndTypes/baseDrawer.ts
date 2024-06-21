export interface IBaseDrawerBasicItem {
  key: string
  path: string
  leftIcon: any
  rightIcon?: any
  permission?: string
}

export interface IMenuItem extends IBaseDrawerBasicItem {
  subMenus?: IBaseDrawerBasicItem[]
}
