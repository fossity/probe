/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import AppConfig from '@config/AppConfigModule';
import icon from '@assets/icon.png';
import { IAppInfo } from '@api/dto';
import { useTranslation } from 'react-i18next';
import LicensesText from './LicensesText';

const AboutModule = () => {
  const [appInfo, setAppInfo] = useState<IAppInfo>(null);
  const { t } = useTranslation();

  const onInit = async (): Promise<void> => {
    const info = await window.app.getInfo();
    setAppInfo(info);
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div
      style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        height: '100%',
        display: 'grid',
        width: "100%",
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <header
        style={{
          textAlign: 'justify',
          padding: '1rem 2rem 0 2rem',
        }}
      >
        <div className="d-flex align-center">
          <img src={icon} width="64" alt="logo" className="mr-4" />
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>{AppConfig.ABOUT_MESSAGE}</p>
            <p style={{ fontSize: '0.75rem', margin: 0 }} className="text-right">
              VERSION: {appInfo?.version}
            </p>
          </div>
        </div>
      </header>

      <div
        style={{
          padding: '0 1.25rem 0 2rem',
          height: '100%',
          textAlign: 'justify',
        }}
      >
        <p>
          This program is free software: you can redistribute it and/or modify it under the terms of the GNU General
          Public License as published by the Free Software Foundation, version 2.
        </p>
        <p>
          This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
          implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
          for more details.
        </p>
        <p>
          You should have received a copy of the GNU General Public License along with this program. If not, see{' '}
          <a href="https://www.gnu.org/licenses/" target="_blank" rel="noreferrer">
            https://www.gnu.org/licenses/
          </a>
          .
        </p>
        <p>
          By using this tool you accept that the results provided do not represent any kind of legal advise, and that you have not included any sensitive information in the entered texts. This tool gathers fingerprints from the source code. These fingerprints cannot be reversed back to the original code. No sensitive information should be submitted to Fossity.
        </p>
        <p>Copyright &copy; {new Date().getFullYear()} Fossity Auditing S.L.</p>
        {/*
        <p>
          <LicensesText />
        </p>
        */}
      </div>
      <footer
        style={{
          margin: 10,
          textAlign: 'right',
        }}
      >
        <button
          style={{
            padding: '6px 15px',
          }}
          type="button"
          onClick={close}
        >
          {t('Button:OK')}
        </button>
      </footer>
    </div>
  );
};

export default AboutModule;
