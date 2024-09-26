export function generateMembersData(numberOfMembers: number) {
  return Array(numberOfMembers)
    .fill(null)
    .map((_, index) => ({
      id: String(index + 1),
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      subscriber: `test_${index + 1}@example.com`,
      subscriptionType: 'Free',
      activity: 3,
      subscriptionDate: 'December 4th, 2021',
      revenue: 'US$24.00',
    }))
}
