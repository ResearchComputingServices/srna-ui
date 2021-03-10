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
    Search as SearchIcon,
    MenuBook as MoreInformationIcon,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import jwt from 'jsonwebtoken';
import Logo from '../Logo';
import Confirmation from '../Confirmation';
import {
    useWindowSize,
    useService,
    useActions,
    useStore,
    useMount,
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
    const userSession = useStore('userSession');
    const themeActions = useActions('theme');
    const isDark = theme.palette.type === 'dark';
    const [t] = useTranslation('common');
    const storageService = useService('storage');
    const sessionService = useService('session');
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const switchThemeMode = () => themeActions.setMode(!isDark ? 'dark' : 'light');

    const searchInEntrez = () => window.open('https://www.ncbi.nlm.nih.gov/sites/batchentrez', '_blank');

    const moreInformation = () => historyService.go('/more-information');

    const createSessionId = React.useCallback(() => {
        const sessionId = storageService.getItem('userSession.sessionId');
        if (sessionId) {
            userSessionActions.login(sessionId);
        } else {
            const sessionId = jwt.sign({ createdDate: new Date().toISOString() }, 'srna');
            userSessionActions.register(sessionId);
        }
    }, [storageService, userSessionActions]);

    const clearSession = async () => {
        userSessionActions.clearSession();
        historyService.replace('/');
        createSessionId();
        try { await sessionService.clear(); } catch (err) {}
    };

    useMount(() => {
        createSessionId();
        interceptorService.registerDataTransformInterceptor();
        interceptorService.registerUnhandledInterceptor(() => console.error('Server failed to send back a response or has crashed.'));
    });

    React.useEffect(() => {
        if (userSession.sessionId) {
            interceptorService.registerRequestInterceptor(request => (request.headers.Authorization = `Bearer ${userSession.sessionId}`));
        }
    }, [interceptorService, userSession]);

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
                                    title: t('appBar.searchInEntrez'),
                                    Icon: <SearchIcon />,
                                    handler: searchInEntrez,
                                },
                                {
                                    title: t('appBar.moreInformation'),
                                    Icon: <MoreInformationIcon />,
                                    handler: moreInformation,
                                },
                                {
                                    title: `${!isDark ? t('appBar.dark') : t('appBar.light')} ${t('appBar.theme')}`,
                                    Icon: !isDark ? <LightModeIcon /> : <DarkModeIcon />,
                                    handler: switchThemeMode,
                                },
                                {
                                    title: t('appBar.clearSession'),
                                    Icon: <ClearSessionIcon />,
                                    handler: () => setOpenConfirmation(true),
                                },
                            ]}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <Switch>{routesAssemblerService.assemble(routes)}</Switch>
            </main>
            <Confirmation
                content={t('appBar.sessionClearWarning')}
                onClose={() => setOpenConfirmation(false)}
                onConfirm={() => {
                    clearSession();
                    setOpenConfirmation(false);
                }}
                open={openConfirmation}
            />
        </>
    );
}

export default Main;
