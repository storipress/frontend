import dayjs from 'dayjs'
import { html } from 'proper-tags'
import type { ApexOptions } from 'apexcharts'
import { GraphType } from './enums'
import type { TSeriesItemData } from './types'

export interface PresetConfig {
  colors: string[]
  tooltip: {
    class: string
    prefix: string
    suffix: string
  }
}

export const CHART_COLOR_GREEN = '#65a30d'
export const CHART_COLOR_GREY = '#a1a1aa'

export function getOptions(graphType: GraphType): ApexOptions {
  const colors =
    graphType === GraphType.Subscribers ? [CHART_COLOR_GREY, CHART_COLOR_GREEN] : [CHART_COLOR_GREEN, CHART_COLOR_GREY]

  const tooltipClass = graphType === GraphType.Revenue ? 'bg-lime-600' : 'bg-stone-400'

  const prefix = graphType === GraphType.Revenue ? '$' : ''
  const suffix = graphType === GraphType.Revenue ? 'MRR' : ''

  return getOptionsFromPreset({
    colors,
    tooltip: {
      class: tooltipClass,
      prefix,
      suffix,
    },
  })
}

export function getOptionsFromPreset({ colors, tooltip }: PresetConfig): ApexOptions {
  return {
    chart: {
      id: 'graph',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      type: 'datetime',
      tickPlacement: '',
      tickAmount: 2,
      crosshairs: {
        show: true,
        position: 'back',
        stroke: {
          color: '#e2e2e2',
          width: 4,
          dashArray: 0,
        },
      },
      labels: {
        rotate: 0,
        style: {
          colors: '#e4e4e7',
          fontSize: '0.75rem',
          fontWeight: 400,
          cssClass: 'text-xs leading-tight text-center text-stone-800',
        },
        datetimeFormatter: {
          year: 'MMM yyyy',
          month: 'dd MMM',
          day: 'dd MMM',
        },
      },
      axisTicks: {
        height: 4,
        borderType: 'dotted',
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          colors: '#e4e4e7',
          fontSize: '0.75rem',
          fontWeight: 400,
          cssClass: 'text-xs leading-tight text-center text-stone-800',
        },
        formatter: (val) => {
          return `${Math.ceil(val)}`
        },
      },
    },
    colors,
    markers: {
      size: 0,
    },
    stroke: {
      curve: 'smooth',
      width: 1.3,
    },
    tooltip: {
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
      followCursor: true,
      custom: ({ series, dataPointIndex, w }) => {
        const seriesValue = series.map((s: TSeriesItemData) => s[dataPointIndex as number])
        const dataDate = dayjs(w.globals.seriesX[0][dataPointIndex]).format('DD MMMM YYYY')
        return html`
          <div class="shadow-lg rounded border border-stone-100 bg-stone-800 p-2 pb-3">
            <p class="mb-3 text-xs text-white">${dataDate}</p>
            <div class="flex">
              <div class="item-center ${seriesValue?.[0] === undefined ? 'hidden' : ''} mr-4 flex">
                <div class="${tooltip.class} mr-2 h-4 w-4 rounded-sm"></div>
                <span class="text-xs text-white"> ${tooltip.prefix}${seriesValue?.[0]} ${tooltip.suffix} </span>
              </div>
              <div class="item-center ${seriesValue?.[1] === undefined ? 'hidden' : ''} mr-4 flex">
                <div class="mr-2 h-4 w-4 rounded-sm bg-lime-600"></div>
                <span class="text-xs text-white">${seriesValue?.[1]}</span>
              </div>
            </div>
          </div>
        `
      },
    },
    grid: {
      borderColor: '#d1d5db',
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      horizontalAlign: 'right',
      offsetY: 10,
      markers: {
        // @ts-expect-error unknown option
        width: 12,
        height: 12,
        radius: 2,
      },
      labels: {
        colors: '#9ca3af',
      },
    },
  }
}
