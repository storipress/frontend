export function getAvatarURL(seed?: string | null) {
  return `https://avatars.dicebear.com/api/initials/${seed ?? 'undefined'}.svg`
}
