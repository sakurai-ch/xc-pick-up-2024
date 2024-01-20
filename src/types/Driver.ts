export type FetchedDriver = {
  capacity: number,
  id: number,
  name: string,
}

export type Driver = {
  no: number,
  trackerNo: number,
  driverName: string,
  capacity: number | null,
} | null