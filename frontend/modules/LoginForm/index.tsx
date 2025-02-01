import Link from 'next/link';
import { useRouter } from 'next/router';

import React, { useState, useEffect } from 'react';

import { ChevronRight } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import Button from '@/components/core/Button';
import Input from '@/components/core/FieldInput';
import SnackBar from '@/components/core/SnackBar';
import { SnackBarType } from '@/components/core/SnackBar/SnackBar';
import FullscreenLoader from '@/components/FullscreenLoader';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import { clearError, getAuthDataSelector, loginUserThunk, setUser } from '@/store/auth';
import { loginValidation } from '@/validations';

import {
  DivStylesFormStyles,
  DivStyled,
  StyledInputAdornment,
  StyledLabel,
  StyledText,
  DivSignUpLabel,
} from './index.styles';
import { FormValues } from './index.type';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [snackBarvisible, setSnackBarvisible] = useState<boolean>(false);
  const [snackBarmessage, setSnackBarmessage] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user, error, otpSent, otpVerified, isAuthenticated } = useAppSelector(getAuthDataSelector);
  const onFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    dispatch(setUser({ ...user, accountId: values.accountId }));
    dispatch(loginUserThunk(values));

    setTimeout(() => {
      if (!isAuthenticated) {
        setIsSubmitting(false);
      }
    }, 2000);
  };

  useEffect(() => {
    if (error && error.length > 0) {
      setSnackBarvisible(true);
      setSnackBarmessage(error);
      dispatch(clearError());
    } else if (otpSent) {
      router.push('/authenticate');
    }
  }, [error, user, otpSent]);

  return (
    <DivStylesFormStyles data-testid="login-form">
      <Formik
        initialValues={{
          accountId: '',
        }}
        validationSchema={() => loginValidation}
        onSubmit={onFormSubmit}
      >
        {({ errors, touched, isValid, dirty }) => {
          return (
            <Form>
              <StyledLabel htmlFor="accountId">ACCOUNT ID</StyledLabel>
              {isSubmitting && <FullscreenLoader />}
              <Field
                as={Input}
                id="accountId"
                name="accountId"
                placeholder="john"
                error={errors.accountId && touched.accountId ? true : false}
                helperText={<ErrorMessage name="accountId" />}
                data-testid="account-id-input"
                InputProps={{
                  endAdornment: <StyledInputAdornment position="end">.near</StyledInputAdornment>,
                }}
              />
              <DivStyled>
                <Button className="btn-login" disabled={!(dirty && isValid)} type="submit" data-testid={`login-allow`}>
                  Next <ChevronRight />
                </Button>
              </DivStyled>
            </Form>
          );
        }}
      </Formik>
      <SnackBar
        type={SnackBarType.ERROR}
        visible={snackBarvisible}
        setVisible={setSnackBarvisible}
        content={snackBarmessage}
      />
      <Divider />
      <DivStyled>
        <StyledText data-testid="footer-text-login">Don't have a NEAR account?</StyledText>
      </DivStyled>
      <Link href="/signup">
        <DivSignUpLabel>Sign Up</DivSignUpLabel>
      </Link>
    </DivStylesFormStyles>
  );
};

export default LoginForm;
