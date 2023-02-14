import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import i18next from 'i18next'
import { showTranslations } from 'translation-check'

import AppConfig from '@config/AppConfigModule';
import { DialogProvider } from '@context/DialogProvider';
import AppProvider from '@context/AppProvider';
import store from '@store/store';
import { createTheme, ThemeProvider, StyledEngineProvider, Theme } from '@mui/material/styles';

import { AppI18n } from '@shared/i18n';
import { IpcChannels } from '@api/ipc-channels';
import { userSettingService } from '@api/services/userSetting.service';
import WorkspaceModule from './features/workspace';
import AboutModule from './features/about';
import './App.global.scss';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export default class App {
  /**
   * Initialize React application.
   *
   * @returns {JSX.Element}
   */
  public async setup(): Promise<void | Element | React.Component> {
    const { LNG } = await userSettingService.get();

    AppI18n.setLng(LNG);
    AppI18n.init();

    this.setTitle();
    const theme = this.loadTheme();

    const app = (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <HashRouter>
              <Provider store={store}>
                <DialogProvider>
                  <AppProvider>
                    <React.Suspense fallback="">
                        <Routes>
                          <Route index element={<WorkspaceModule />} />
                          <Route path="/workspace/*" element={<WorkspaceModule />} />
                          <Route path="/about" element={<AboutModule />} />
                        </Routes>
                      </React.Suspense>
                  </AppProvider>
                </DialogProvider>
              </Provider>
            </HashRouter>
          </ThemeProvider>
        </StyledEngineProvider>
    );

    this.setupAppMenuListeners();

    const container = document.getElementById('root')!;
    const root = createRoot(container);
    root.render(app);
  }

  private async setTitle() {
    const appInfo = await window.app.getInfo()
    document.title = `${AppConfig.APP_NAME} (${appInfo.version})`;
  }

  setupAppMenuListeners() {
    window.electron.ipcRenderer.on(IpcChannels.MENU_OPEN_TRANSLATION_MANAGER, async (event) => {
     showTranslations(i18next);
    });
  }

  private loadTheme(): Theme {
    const primary = '#307FE2';
    const secondary = '#EBF3FD';

    const theme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: primary,
        },
        secondary: {
          main: secondary,
          contrastText: '#307FE2',
        },
        success: {
          main: '#02BD63',
        },
      },
      typography: {
        button: {
          fontWeight: 600,
          textTransform: 'none',
        },
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: 10,
            }
          }
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            }
          }
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              backgroundColor: 'white',
              borderRadius: 10,

              // TODO: we need to remove "!important" from rules. Currently, default style is more specific that custom styles. Could be controversial in the future
              '&.Mui-disabled': {

              },

              '&.Mui-error': {
                borderColor: '#d32f2f !important',
              },
              '&.Mui-focused.MuiInputBase-adornedStart > .MuiSvgIcon-root:first-child': {
                color: primary,
              },
            },
          },
        },
        MuiTableHead: {
          styleOverrides: {
            root: {
              '& .MuiTableCell-root': {
                color: '#27272A',
                backgroundColor: '#FAFAFA !important',
                fontWeight: 700,
              },
            },
          },
        },
      },
    });

    theme.shadows[1] = '0px 1px 3px 0px #0000001A; 1px 0px 2px 0px #0000000F';
    return theme;
  }
}
