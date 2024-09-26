export type RecordType = 'A' | 'CNAME'
export type DnsTutorialType = 'apexDomain' | 'wwwSubdomain' | 'otherSubdomain'

interface DnsRecordTutorial {
  type: RecordType
  host: string
  value: string
}

export type DnsRecordTutorialForm = {
  [key in DnsTutorialType]: DnsRecordTutorial[]
}

export const dnsTutorial: DnsRecordTutorialForm = {
  apexDomain: [
    { type: 'A', host: '@ or empty', value: '13.248.202.255' },
    { type: 'CNAME', host: 'www', value: '' },
  ],
  wwwSubdomain: [
    { type: 'A', host: '@ or empty', value: '13.248.202.255' },
    { type: 'CNAME', host: 'www', value: '' },
  ],
  otherSubdomain: [{ type: 'CNAME', host: '', value: 'cdn.storipress.com' }],
}
