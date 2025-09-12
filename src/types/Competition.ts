export type Competition = {
  name: string,
  groupId: number | string,
  token: string,
  referencePointId: string | number,
}

export type ReferencePoint = { 
  id: number | string, 
  name: string, 
  display_order: number, 
}
  