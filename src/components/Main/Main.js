import React from 'react';
import clsx from 'clsx';
import {
    ToastsContainer,
    ToastsStore,
} from 'react-toasts';
import { Switch } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMount } from 'react-use';
import {
    Brightness2 as LightModeIcon,
    Flare as DarkModeIcon,
} from '@material-ui/icons';
import { Logo } from '..';
import {
    useProvider,
    useWindowSize,
    useRoutes,
    useService,
    useActions,
    useStore,
} from '../../hooks';
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
    const routes = useRoutes('main');
    const routesAssemblerService = useProvider('route')();
    const interceptorService = useService('interceptor');
    const theme = useStore('theme');
    const themeActions = useActions('theme');
    const isDark = theme.palette.type === 'dark';

    const switchThemeMode = () => themeActions.setMode(!isDark ? 'dark' : 'light');

    useMount(async () => {
        // Responsible for parsing all request from camel case to snake case and responses from snake case to camel case.
        interceptorService.registerDataTransformInterceptor();
        interceptorService.registerUnhandledInterceptor(() => console.error('Server failed to send back a response or has crashed.'));
    });

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
                            sRNA Computation
                        </Typography>
                        <UserMenu
                            displayName='Settings'
                            dropdowns={[
                                {
                                    title: `${!isDark ? 'Dark' : 'Light'} Theme`,
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
                <ToastsContainer
                    position='bottom_left'
                    store={ToastsStore}
                />
            </main>
        </>
    );
}

export default Main;
