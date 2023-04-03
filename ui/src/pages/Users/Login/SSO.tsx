import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RouteAlias } from '@/router/alias';
import { REDIRECT_PATH_STORAGE_KEY } from '@/common/constants';
import { usePageTags } from '@/hooks';
import type { SSOLoginReqParams } from '@/common/interface';
import { loggedUserInfoStore } from '@/stores';
import { guard, floppyNavigation } from '@/utils';
import { SSOLogin } from '@/services';
import Storage from '@/utils/storage';

export const addHashParamToUrl = (
  url: string,
  param: string,
  value: string,
): string => {
  const [path, search] = url.split('?');
  const searchParams = new URLSearchParams(search);
  searchParams.set(param, encodeURI(value));
  const newSearch = searchParams.toString();
  return `${path}?${newSearch}`;
};

const Index: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { update: updateUser } = loggedUserInfoStore((_) => _);

  const token = searchParams.get('token');

  const redirectToSSO = () => {
    const SSO_URL = `${process.env.SSO_PREFIX}user/login`; // SSO_URL should request from Config
    const redirectUrl = addHashParamToUrl(
      addHashParamToUrl(SSO_URL, 'redirect', window.location.href),
      'sso',
      '1',
    );
    window.location.replace(redirectUrl);
  };

  const handleLoginRedirect = () => {
    const redirect = Storage.get(REDIRECT_PATH_STORAGE_KEY) || RouteAlias.home;
    Storage.remove(REDIRECT_PATH_STORAGE_KEY);
    floppyNavigation.navigate(redirect, () => {
      navigate(redirect, { replace: true });
    });
  };

  const SSOAuth = (authToken: string) => {
    const params: SSOLoginReqParams = {
      token: authToken,
    };

    SSOLogin(params)
      .then((res) => {
        updateUser(res);
        const userStat = guard.deriveLoginState();
        if (userStat.isNotActivated) {
          // inactive
          redirectToSSO();
        } else {
          handleLoginRedirect();
        }
      })
      .catch(() => {
        redirectToSSO();
      });
  };

  if (!token) {
    redirectToSSO();
  } else {
    SSOAuth(token);
  }

  usePageTags({
    title: t('login', { keyPrefix: 'page_title' }),
  });
  return <Container style={{ paddingTop: '4rem', paddingBottom: '5rem' }} />;
};

export default React.memo(Index);
