export interface IInventoryItem {
  itemCode: string
  itemName: string
  description: string
  unit: string
  unitPrice: number
  dateOfExpiry: Date
  storeContent: number
}

export interface IInventoryGroupItem
  extends Pick<IInventoryItem, 'itemCode' | 'itemName'> {
  itemId: string
}

export interface IInventoryGroup {
  groupCode: string
  groupName: string
  description: string
  parentGroup: string
  items: IInventoryGroupItem[]
}

export interface IInventoryTemplateGroup extends IInventoryGroup {
  groupId: string
}

export interface IInventoryTemplate {
  templateCode: string
  templateName: string
  description: string
  groups: IInventoryTemplateGroup[]
}

export interface IInvoiceItem extends IInventoryItem, IInventoryGroupItem {
  total: number
}

export interface IInvoiceGroup
  extends Omit<IInventoryTemplateGroup, 'items' | 'parentGroup'> {
  items: IInvoiceItem[]
  itemCount: number
  groupTotal: number
}

export interface IInvoice {
  invoiceCode: string
  invoiceDate: Date
  grandItemCount: number
  grandTotal: number
  groups: IInvoiceGroup[]
}
