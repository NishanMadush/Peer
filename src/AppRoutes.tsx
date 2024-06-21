import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import PrivateRoute from './core/components/PrivateRoute'
import {
  COMMON_403_ROUTE,
  COMMON_404_ROUTE,
  COMMON_UNDER_CONSTRUCTION_ROUTE,
  PUBLIC_BASE_ROUTE_URL,
  PUBLIC_LANDING_ROUTE,
} from './core/constants/routes'
import {
  PUBLIC_FORGOT_PASSWORD_ROUTE,
  PUBLIC_LOGIN_ROUTE,
  PUBLIC_REGISTER_ROUTE,
  PUBLIC_RESET_PASSWORD_ROUTE,
} from './modules/auth/constants/routes'
import {
  DASHBOARD_PERMISSION,
  FAQ_PERMISSION,
  HELP_PERMISSION,
  HOME_PERMISSION,
  PROFILE_PERMISSION,
  ROOT_PERMISSION,
} from './modules/baseUser/constants/permissions'
import {
  DASHBOARD_ROUTE,
  FAQ_ROUTE,
  HELP_ROUTE,
  HOME_ROUTE,
  PROFILE_ROUTE,
  ROOT_ROUTE,
} from './modules/baseUser/constants/routes'
import { COUNTRY_MANAGEMENT_PERMISSION } from './modules/countries/constants/permissions'
import { COUNTRY_MANAGEMENT_ROUTE } from './modules/countries/constants/routes'
import { INSTITUTIONALIZATION_COUNTRY_MANAGEMENT_PERMISSION } from './modules/institutionalization/countryReview/constants/permission'
import { INSTITUTIONALIZATION_COUNTRIES_REVIEWS_MANAGEMENT_ROUTE } from './modules/institutionalization/countryReview/constants/routes'
import { INSTITUTIONALIZATION_FORM_MANAGEMENT_PERMISSION } from './modules/institutionalization/formTemplate/constants/permissions'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_MANAGEMENT_ROUTE } from './modules/institutionalization/formTemplate/constants/routes'
import { INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION } from './modules/institutionalization/organizationAssessment/constants/permissions'
import {
  INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE,
} from './modules/institutionalization/organizationAssessment/constants/routes'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE } from './modules/institutionalization/print/constants/routes'
import { LANGUAGE_MANAGEMENT_PERMISSION } from './modules/languages/constants/permissions'
import { LANGUAGE_MANAGEMENT_ROUTE } from './modules/languages/constants/routes'
import { ORGANIZATION_MANAGEMENT_PERMISSION } from './modules/organizations/constants/permissions'
import { ORGANIZATION_MANAGEMENT_ROUTE } from './modules/organizations/constants/routes'
import { REPORT_PERMISSION } from './modules/reports/Institutionalization/constants/permissions'
import {
  REPORT_INSTITUTIONALIZATION_ASSESSMENT_ROUTE,
  REPORT_INSTITUTIONALIZATION_COUNTRY_IN_DETAIL_ROUTE,
  REPORT_INSTITUTIONALIZATION_COUNTRY_ROUTE,
  REPORT_INSTITUTIONALIZATION_ORGANIZATION_ROUTE,
} from './modules/reports/Institutionalization/constants/routes'
import { USER_MANAGEMENT_PERMISSION } from './modules/users/constants/permissions'
import { USER_MANAGEMENT_ROUTE } from './modules/users/constants/routes'

// User
const User = lazy(() => import('./modules/baseUser/layouts/BaseLayout'))
const Print = lazy(() => import('./modules/baseUser/layouts/PrintLayout'))
const Dashboard = lazy(() => import('./modules/baseUser/pages/Dashboard'))
const Faq = lazy(() => import('./modules/baseUser/pages/Faq'))
const HelpCenter = lazy(() => import('./modules/baseUser/pages/HelpCenter'))
const Home = lazy(() => import('./modules/baseUser/pages/Home'))
const Profile = lazy(() => import('./modules/baseUser/pages/Profile'))

// Auth
const ForgotPassword = lazy(() => import('./modules/auth/pages/ForgotPassword'))
const CreateOrResetPassword = lazy(
  () => import('./modules/auth/pages/CreateOrResetPassword')
)
const Login = lazy(() => import('./modules/auth/pages/Login'))
const Register = lazy(() => import('./modules/auth/pages/Register'))

// Core
const Forbidden = lazy(() => import('./core/pages/Forbidden'))
const NotFound = lazy(() => import('./core/pages/NotFound'))
const UnderConstructions = lazy(() => import('./core/pages/UnderConstructions'))

// Landing
const Landing = lazy(() => import('./modules/landing/pages/Landing'))

// Users
const UserManagement = lazy(
  () => import('./modules/users/pages/UserManagement')
)

// Countries
const CountryManagement = lazy(
  () => import('./modules/countries/pages/CountryManagement')
)

// Languages
const LanguageManagement = lazy(
  () => import('./modules/languages/pages/LanguageManagement')
)

// Organizations
const OrganizationManagement = lazy(
  () => import('./modules/organizations/pages/OrganizationManagement')
)

// Institutionalization
const InstitutionalizationFormTemplateManagement = lazy(
  () =>
    import('./modules/institutionalization/formTemplate/pages/FormManagement')
)
const InstitutionalizationCountryReviewManagement = lazy(
  () =>
    import(
      './modules/institutionalization/countryReview/pages/CountryReviewManagement'
    )
)
const InstitutionalizationOrganizationHistoryManagement = lazy(
  () =>
    import(
      './modules/institutionalization/organizationAssessment/pages/OrganizationHistoryManagement'
    )
)
const InstitutionalizationOrganizationCourseManagement = lazy(
  () =>
    import(
      './modules/institutionalization/organizationAssessment/pages/OrganizationCourseManagement'
    )
)

const InstitutionalizationOrganizationAssessmentManagement = lazy(
  () =>
    import(
      './modules/institutionalization/organizationAssessment/pages/OrganizationAssessmentManagement'
    )
)
const InstitutionalizationOrganizationAssessmentPrintManagement = lazy(
  () =>
    import(
      './modules/institutionalization/print/pages/AssessmentPrintManagement'
    )
)

// Reports
const ReportStatCountry = lazy(
  () => import('./modules/reports/Institutionalization/pages/ReportStatCountry')
)
const ReportStatCountryInDetail = lazy(
  () =>
    import(
      './modules/reports/Institutionalization/pages/ReportStatCountryInDetail'
    )
)
const ReportStatOrganization = lazy(
  () =>
    import(
      './modules/reports/Institutionalization/pages/ReportStatOrganization'
    )
)
const ReportStatAssessment = lazy(
  () =>
    import('./modules/reports/Institutionalization/pages/ReportStatAssessment')
)

const AppRoutes = (): JSX.Element => {
  return (
    <Routes basename={PUBLIC_BASE_ROUTE_URL}>
      {/* Public routes */}
      <Route path={PUBLIC_LANDING_ROUTE} element={<Landing />} />
      <Route path={PUBLIC_LOGIN_ROUTE} element={<Login />} />
      <Route path={PUBLIC_REGISTER_ROUTE} element={<Register />} />
      <Route path={PUBLIC_FORGOT_PASSWORD_ROUTE} element={<ForgotPassword />} />
      <Route
        path={PUBLIC_RESET_PASSWORD_ROUTE}
        element={<CreateOrResetPassword />}
      />

      {/* Logged user routes */}
      <PrivateRoute
        path={ROOT_ROUTE}
        element={<User />}
        permission={ROOT_PERMISSION}
      >
        {/* Home route */}
        {/* <PrivateRoute
          path={HOME_ROUTE}
          element={<Home />}
          permission={HOME_PERMISSION}
        /> */}
        {/* Dashboard route */}
        <PrivateRoute
          // path={DASHBOARD_ROUTE}
          path={HOME_ROUTE}
          element={<Dashboard />}
          permission={DASHBOARD_PERMISSION}
        />
        {/* FAQ route */}
        <PrivateRoute
          path={FAQ_ROUTE}
          element={<Faq />}
          permission={FAQ_PERMISSION}
        />
        {/* Help route */}
        <PrivateRoute
          path={HELP_ROUTE}
          element={<HelpCenter />}
          permission={HELP_PERMISSION}
        />
        {/* Profile route */}
        <PrivateRoute
          path={PROFILE_ROUTE}
          element={<Profile />}
          permission={PROFILE_PERMISSION}
        />
        {/* Project route */}
        <PrivateRoute
          path="projects"
          element={
            <Navigate
              to={`${PUBLIC_BASE_ROUTE_URL}/${COMMON_UNDER_CONSTRUCTION_ROUTE}`}
              replace
            />
          }
        />
        {/* User route */}
        <PrivateRoute
          path={USER_MANAGEMENT_ROUTE}
          element={<UserManagement />}
          permission={USER_MANAGEMENT_PERMISSION}
        />
        {/* Organization route */}
        <PrivateRoute
          path={ORGANIZATION_MANAGEMENT_ROUTE}
          element={<OrganizationManagement />}
          permission={ORGANIZATION_MANAGEMENT_PERMISSION}
        />

        {/* Country route */}
        <PrivateRoute
          path={COUNTRY_MANAGEMENT_ROUTE}
          element={<CountryManagement />}
          permission={COUNTRY_MANAGEMENT_PERMISSION}
        />
        {/* Language route */}
        <PrivateRoute
          path={LANGUAGE_MANAGEMENT_ROUTE}
          element={<LanguageManagement />}
          permission={LANGUAGE_MANAGEMENT_PERMISSION}
        />
        {/* Institutionalization routes */}
        <PrivateRoute
          path={INSTITUTIONALIZATION_FORMS_TEMPLATES_MANAGEMENT_ROUTE}
          element={<InstitutionalizationFormTemplateManagement />}
          permission={INSTITUTIONALIZATION_FORM_MANAGEMENT_PERMISSION}
        />
        <PrivateRoute
          path={INSTITUTIONALIZATION_COUNTRIES_REVIEWS_MANAGEMENT_ROUTE}
          element={<InstitutionalizationCountryReviewManagement />}
          permission={INSTITUTIONALIZATION_COUNTRY_MANAGEMENT_PERMISSION}
        />
        <PrivateRoute
          path={INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}
          element={<InstitutionalizationOrganizationHistoryManagement />}
          permission={INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION}
        />
        <PrivateRoute
          path={INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE}
          element={<InstitutionalizationOrganizationCourseManagement />}
          permission={INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION}
        />
        <PrivateRoute
          path={INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_MANAGEMENT_ROUTE}
          element={<InstitutionalizationOrganizationAssessmentManagement />}
          permission={INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION}
        />
        {/* Report/statistics routes */}
        <PrivateRoute
          path={REPORT_INSTITUTIONALIZATION_COUNTRY_ROUTE}
          element={<ReportStatCountry />}
          permission={REPORT_PERMISSION}
        />
        <PrivateRoute
          path={REPORT_INSTITUTIONALIZATION_COUNTRY_IN_DETAIL_ROUTE}
          element={<ReportStatCountryInDetail />}
          permission={REPORT_PERMISSION}
        />
        <PrivateRoute
          path={REPORT_INSTITUTIONALIZATION_ORGANIZATION_ROUTE}
          element={<ReportStatOrganization />}
          permission={REPORT_PERMISSION}
        />
        <PrivateRoute
          path={REPORT_INSTITUTIONALIZATION_ASSESSMENT_ROUTE}
          element={<ReportStatAssessment />}
          permission={REPORT_PERMISSION}
        />
      </PrivateRoute>
      {/* Print routes */}
      <PrivateRoute
        path={ROOT_ROUTE}
        element={<Print />}
        permission={ROOT_PERMISSION}
      >
        <PrivateRoute
          path={INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE}
          element={
            <InstitutionalizationOrganizationAssessmentPrintManagement />
          }
          permission={INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION}
        />
      </PrivateRoute>

      {/* Common routes */}
      <Route
        path={COMMON_UNDER_CONSTRUCTION_ROUTE}
        element={<UnderConstructions />}
      />
      <Route path={COMMON_403_ROUTE} element={<Forbidden />} />
      <Route path={COMMON_404_ROUTE} element={<NotFound />} />

      {/* Default route */}
      <Route
        path="*"
        element={
          <Navigate
            to={`${PUBLIC_BASE_ROUTE_URL}/${COMMON_404_ROUTE}`}
            replace
          />
        }
      />
    </Routes>
  )
}

export default AppRoutes
