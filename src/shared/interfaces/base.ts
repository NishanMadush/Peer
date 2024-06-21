import { ICountry } from './country'
import { IInstitutionalizationCountryReview } from './institutionalization'
import { ILanguage } from './language'
import { IOrganization, IOrganizationBranch } from './organization'
import { IRole } from './user'

export interface IOrganizationExt
  extends Pick<
    IOrganization,
    'id' | 'name' | 'countryId' | 'departments' | 'designations'
  > {
  branches?: Partial<IOrganizationBranch>[]
}

export interface IUserSettings {
  roles: Partial<IRole>[]
  countries: Partial<ICountry>[]
  languages: Partial<ILanguage>[]
  organizations: IOrganizationExt[]
  salutation: string[]
}

// export interface ICountrySettings {
//   countryReviews: Partial<IInstitutionalizationCountryReview>[]
// }
