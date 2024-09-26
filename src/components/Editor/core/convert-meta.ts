import type { BookmarkMeta, EmbedMeta } from './api'
import type { IFramely, IFramelyLink } from '~/utils/editor/clients/iframely'

const PREFER_ICON_SIZE = 32

export function resolveBookmarkMeta(url: string, data: IFramely): BookmarkMeta {
  const embed = Object.assign(
    {},
    ...(data.links?.thumbnail ?? []).map((link) => resolveMedia(link)),
    ...(data.links?.app ?? []).map((link) => resolveMedia(link)),
    ...(data.links?.player ?? []).map((link) => resolveMedia(link)),
  )
  embed.aspectRadio ??= 1

  return {
    title: data.meta.title || '',
    description: data.meta.description || '',
    author: data.meta.author || '',
    icon: findIcon(data.links.icon) || '',
    publisher: data.meta.site,
    url: data.meta.canonical || url,
    thumbnail: data.links?.thumbnail?.[0]?.href || '',
    html: data.html,
    iframe0: data.iframe0,
    ...embed,
  }
}

function resolveMedia(link?: IFramelyLink): Partial<Omit<EmbedMeta, 'html'>> {
  if (!link || !link.media) {
    return {} as EmbedMeta
  }

  const { media } = link
  const aspectRatioFromRect = media.width != null && media.height != null ? media.width / media.height : null

  return {
    aspectRadio: media['aspect-radio'] ?? aspectRatioFromRect ?? 1,
    maxHeight: media['max-height'],
    maxWidth: media['max-width'],
  }
}

function findIcon(link?: IFramelyLink[]): string | undefined {
  if (!link || link.length === 0) {
    return undefined
  }

  let best = link[0]
  let bestWidth = best.media?.width ?? Number.MAX_SAFE_INTEGER
  for (const item of link) {
    if (typeof item.media?.width === 'number' && item.media.width >= PREFER_ICON_SIZE && item.media.width < bestWidth) {
      best = item
      bestWidth = item.media.width
    }
  }

  return best.href
}
