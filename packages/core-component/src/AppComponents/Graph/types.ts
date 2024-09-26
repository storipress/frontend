export interface TSubscriber {
  subscribers: number
  paid_subscribers: number
  date: string
}

export interface TRevenue {
  revenue: string
  date: string
}

export type TApexchartsSeries = {
  revenue: string
  date: string
}[]

export type TSeries = TSeriesItem[]

export interface TSeriesItem {
  name: string
  data: TSeriesItemData
}

export type TSeriesItemData = [string, number][]
