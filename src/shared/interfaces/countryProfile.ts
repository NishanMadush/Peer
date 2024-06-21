export interface ICountryProfile {
  countryName: string
  nodalAgency: string
  focalPoint: string
  cadre: string
  mfr: string
  csrr: string
  hope: string
  programYears: ProgramYearsEnum
  geographicCoverage: GeographicCoverageEnum
  // trainedResponders: PeerTrainedEnum
  // qualifiedInstructors: PeerTrainedEnum
  cadreTrainedResponders: number
  mfrTrainedResponders: number
  csrrTrainedResponders: number
  hopeTrainedResponders: number
  cadreQualifiedTrainedInstructors: number
  mfrQualifiedTrainedInstructors: number
  csrrQualifiedTrainedInstructors: number
  hopeQualifiedTrainedInstructors: number
}

export enum ProgramYearsEnum {
  MoreThanTwenty = '> 20 years',
  BetweenfifteenAndTwenty = '15-20 years',
  BetweenTenAndfifteen = '10-15 years',
  BetweenFiveAndTen = '5-10 years',
  LessThanFive = '< 5 years',
}

export enum GeographicCoverageEnum {
  National = 'Natianal',
  Provincial = 'Provincial',
  District = 'District',
  Village = 'Village',
}

export enum PeerTrainedEnum {
  Cadre = 'CADRE',
  Mfr = 'MFR',
  Cssr = 'CSSR',
  Hope = 'HOPE',
}
