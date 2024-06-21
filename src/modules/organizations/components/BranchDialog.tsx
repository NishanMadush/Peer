/* eslint-disable prettier/prettier */
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import lodash from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useSnackbar } from '../../../core/contexts/SnackbarProvider';
import { AddressTypeEnum } from '../../../shared/interfaces/address';
import {
  IOrganizationExt,
  IUserSettings,
} from '../../../shared/interfaces/base';
import { useAuth } from '../../auth/contexts/AuthProvider';
import { DefaultUsers } from '../../baseUser/constants/helper';
import { useCountries } from '../../countries/hooks/useCountries';
import { IOrganizationBranch } from '../interfacesAndTypes/organization';

type BranchDialogProps = {
  onAddBranch: (branch: IOrganizationBranch) => void;
  onCloseBranch: () => void;
  onUpdateBranch: (branch: IOrganizationBranch) => void;

  openBranch: boolean;
  processing: boolean;
  branch: Partial<IOrganizationBranch>;
};

const BranchDialog = ({
  onAddBranch,
  onCloseBranch,
  onUpdateBranch,
  openBranch,
  processing,
  branch,
}: BranchDialogProps): JSX.Element => {
  const { t } = useTranslation();
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const [errorMessage, setErrorMessage] = useState('')

  const editMode = Boolean(branch && branch._id);

  const { data: countriesData } = useCountries();

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values);

    const addBranchParams = {
      _id: values._id,
      branchName: values.branchName,
      isHeadOffice: values.isHeadOffice,
      isVirtual: values.isVirtual,
      contactPerson: values.contactPerson,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: {
        category: values.address?.category ?? AddressTypeEnum.Resident,
        line1: values.address?.line1 ?? '',
        street: values.address?.street ?? '',
        city: values.address?.city ?? '',
        postalCode: values.address?.postalCode ?? '',
        countryId: values.address?.countryId ?? '',
        location: {
          lat: -1,
          lng: -1,
        },
      },
      website: values.website,
      employees: values.employees,
    };
    if (branch && branch._id) {
      onUpdateBranch({ ...addBranchParams, _id: branch._id });
    } else {
      onAddBranch({ ...addBranchParams, branchName: values.branchName });
    }
  };

  const formik = useFormik({
    initialValues: {
      isHeadOffice: branch?.isHeadOffice ?? false,
      isVirtual: branch?.isVirtual ?? false,
      email: branch?.email ?? '',
      branchName: branch?.branchName ?? '',
      contactPerson: branch?.contactPerson ?? '',
      phoneNumber: branch?.phoneNumber ?? '',
      address: {
        category: branch?.address?.category ?? AddressTypeEnum.Resident,
        line1: branch?.address?.line1 ?? '',
        street: branch?.address?.street ?? '',
        city: branch?.address?.city ?? '',
        postalCode: branch?.address?.postalCode ?? '',
        countryId:branch?.address?.countryId ?? userInfo?.employment?.organization?.organizationId?.countryId ??
        '',
        location: {
          lat: -1,
          lng: -1,
        },
      },
      website: branch?.website ?? '',
      employees: branch?.employees ?? [],
    },

    validationSchema: Yup.object({
      branchName: Yup.string()
        .required(t('common.validations.required')),
      contactPerson: Yup.string()
        .required(t('common.validations.required')),
        address: Yup.object().shape({
          line1: Yup.string()
            .required(t('common.validations.required')),
          city: Yup.string()
            .required(t('common.validations.required')),
            countryId: Yup.string().required('Country is required'),
        }),
    }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (
      formik.submitCount > 0 &&
      formik.errors &&
      Object.keys(formik.errors).length > 0
    ) {
      snackbar.error(
        t('common:formik.validation.failed')
      )
    } else {
      setErrorMessage('')
    }
  }, [formik.submitCount, formik.errors])

  return (
    <Dialog
      open={openBranch}
      onClose={onCloseBranch}
      aria-labelledby="branch-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="branch-dialog-title">
          {editMode
            ? t('organizations:branchManagement.modal.edit.title')
            : t('organizations:branchManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            id="branchName"
            disabled={processing}
            fullWidth
            label={t('organizations:branchManagement.form.branchName.label')}
            name="branchName"
            value={formik.values.branchName}
            onChange={formik.handleChange}
            error={
              formik.touched.branchName && Boolean(formik.errors.branchName)
            }
            helperText={formik.touched.branchName && formik.errors.branchName}
          ></TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="contactPerson"
            label={t('organizations:branchManagement.form.contactPerson.label')}
            name="contactPerson"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            error={
              formik.touched.contactPerson &&
              Boolean(formik.errors.contactPerson)
            }
            helperText={
              formik.touched.contactPerson && formik.errors.contactPerson
            }
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label={t('organizations:branchManagement.form.email.label')}
            name="email"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            // type="number"
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label={t('organizations:branchManagement.form.phoneNumber.label')}
            autoComplete="given-phoneNumber"
            disabled={processing}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
          <FormControlLabel
            id="isHeadOffice"
            name="isHeadOffice"
            disabled={processing}
            onChange={formik.handleChange}
            checked={formik.values.isHeadOffice}
            control={<Checkbox />}
            label={t(
              'organizations:organizationManagement.form.isHeadOffice.label'
            )}
          />

          <DialogTitle align="left">{t('organizations:branchManagement.form.title.address')}</DialogTitle>
          <TextField
            margin="normal"
            required
            fullWidth
            id="line1"
            label={t('organizations:branchManagement.form.line1.label')}
            name="address.line1"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.address.line1}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.line1 &&
              Boolean(formik.errors.address?.line1)
            }
            helperText={
              formik.touched.address?.line1 && formik.errors.address?.line1
            }
          />
          <TextField
            margin="normal"
            fullWidth
            id="street"
            label={t('organizations:branchManagement.form.street.label')}
            name="address.street"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.address.street}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.street &&
              Boolean(formik.errors.address?.street)
            }
            helperText={
              formik.touched.address?.street && formik.errors.address?.street
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="city"
            label={t('organizations:branchManagement.form.city.label')}
            name="address.city"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.address.city}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.city &&
              Boolean(formik.errors.address?.city)
            }
            helperText={
              formik.touched.address?.city && formik.errors.address?.city
            }
          />

          <TextField
            margin="normal"
            fullWidth
            id="postalCode"
            label={t('organizations:branchManagement.form.postalCode.label')}
            name="address.postalCode"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.address.postalCode}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.postalCode &&
              Boolean(formik.errors.address?.postalCode)
            }
            helperText={
              formik.touched.address?.postalCode &&
              formik.errors.address?.postalCode
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            id="countryId"
            name="address.countryId"
            label={t('organizations:branchManagement.form.countryId.label')}
            autoComplete="given-name"
            disabled={processing ||
              userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR}
            value={formik.values.address.countryId}
            onChange={formik.handleChange}
          >
            {countriesData &&
              countriesData.map((countries) => (
                <MenuItem key={countries.id} value={countries.id}>
                  {countries.name}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseBranch}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t('organizations:branchManagement.modal.edit.action')
              : t('organizations:branchManagement.modal.add.action')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BranchDialog;
