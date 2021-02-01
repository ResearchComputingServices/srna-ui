import React from 'react';
import clsx from 'clsx';
import { Switch } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Brightness2 as LightModeIcon,
    Flare as DarkModeIcon,
    LockOpen as ClearSessionIcon,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import Logo from '../Logo';
import {
    useWindowSize,
    useService,
    useActions,
    useStore,
} from '../../hooks';
import { routes } from '../../config';
import UserMenu from './UserMenu';

export const useStyles = makeStyles(theme => ({
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    appBar: {
        marginLeft: theme.spacing(2),
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        // Todo need to use appBar height from theme
        height: 64,
        alignItems: 'center',
    },
    content: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // TODO need to use appBar height from themes.
        paddingTop: 64,
    },
}));

function Main() {
    const classes = useStyles();
    const dimensions = useWindowSize();
    const [historyService, interceptorService, routesAssemblerService] = useService('history', 'interceptor', 'routesAssembler');
    const userSessionActions = useActions('userSession');
    const theme = useStore('theme');
    const themeActions = useActions('theme');
    const isDark = theme.palette.type === 'dark';
    const [t] = useTranslation('common');
    const storage = useService('storage');

    const switchThemeMode = () => themeActions.setMode(!isDark ? 'dark' : 'light');

    const createSessionId = React.useCallback(() => {
        if (storage.get().sessionId) {
            userSessionActions.login(storage.get().sessionId);
        } else {
            const sessionId = uuidv4();
            userSessionActions.login(sessionId);
            storage.get().sessionId = sessionId;
        }
    }, [storage, userSessionActions]);

    const clearSession = () => {
        storage.get().removeItem('sessionId');
        userSessionActions.clearSession();
        if (historyService.getUrl() !== '/history') {
            historyService.go('/history');
        } else {
            historyService.reload();
        }
    };

    const createInterceptors = React.useCallback(() => {
        interceptorService.registerDataTransformInterceptor();
        interceptorService.registerUnhandledInterceptor(() => console.error('Server failed to send back a response or has crashed.'));
    }, [interceptorService]);

    React.useEffect(() => {
        createSessionId();
        createInterceptors();
    }, [createSessionId, createInterceptors]);

    return (
        <>
            <AppBar position='fixed'>
                <Toolbar className={classes.toolbar}>
                    <Logo />
                    <Box className={classes.appBar}>
                        <Typography
                            className={
                                clsx(
                                    { [classes.hide]: dimensions.width < 690 },
                                )
                            }
                            variant='h5'
                        >
                            <Link
                                color='inherit'
                                href='/'
                                style={{ textDecoration: 'none' }}
                            >
                                {t('appBar.title')}
                            </Link>
                        </Typography>
                        <UserMenu
                            displayName={t('appBar.settings')}
                            dropdowns={[
                                {
                                    title: t('appBar.clearSession'),
                                    Icon: <ClearSessionIcon />,
                                    handler: clearSession,
                                },
                                {
                                    title: `${!isDark ? t('appBar.dark') : t('appBar.light')} ${t('appBar.theme')}`,
                                    Icon: !isDark ? <LightModeIcon /> : <DarkModeIcon />,
                                    handler: switchThemeMode,
                                },
                            ]}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <Switch>{routesAssemblerService.assemble(routes)}</Switch>
            </main>
        </>
    );
}

export default Main;
