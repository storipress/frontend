export function convertNameToPath(name: string): string[] {
  if (name === 'drop-cap') {
    return ['article', 'article-content', '& .main-content > p:first-of-type::first-letter']
  }

  if (name.includes('-')) {
    return ['article', name]
  }

  return ['article', 'article-content', `& .main-content ${name}`]
}
