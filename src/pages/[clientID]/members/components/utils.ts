export function getRank(activity: number): number {
  switch (true) {
    case activity > 90:
      return 5
    case activity > 70:
      return 4
    case activity > 50:
      return 3
    case activity > 30:
      return 2
    default:
      return 1
  }
}
