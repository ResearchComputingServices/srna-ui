import _ from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '..';
import {
    useIsWideScreenMode,
    useStore,
    useActions,
    useState,
} from '../../hooks';

export const useStyles = makeStyles(() => ({ root: { zIndex: 1000000 } }));

function ModalInfo({
    show,
    onHide,
    title,
    children,
    animation,
    className,
    style,
    centered,
    staticModal,
    buttons,
}) {
    const wideScreenMode = useIsWideScreenMode();
    const { enabled: drawerEnabled, open: drawerOpen } = useStore('drawer');
    const { hide: hideDrawer, show: showDrawer } = useActions('drawer');
    const [drawerHiddenManually, setDrawerHiddenManually] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        if (show && drawerOpen && drawerEnabled) {
            hideDrawer();
            setDrawerHiddenManually(true);
        }
    }, [drawerEnabled, hideDrawer, show, drawerOpen]);

    const hide = () => {
        onHide();
        if (drawerEnabled && wideScreenMode && drawerHiddenManually) {
            showDrawer();
            setDrawerHiddenManually(false);
        }
    };

    return (
        <Modal
            animation={animation}
            backdrop={staticModal ? 'static' : true}
            centered={centered}
            className={clsx(classes.root, className)}
            onHide={hide}
            show={show}
            style={style}
        >
            {title && (
                <Modal.Header closeButton>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                </Modal.Header>
            )}
            <Modal.Body>
                {children}
            </Modal.Body>
            {!_.isEmpty(buttons) && (
                <>
                    <br />
                    <Modal.Footer>
                        {_.map(buttons, (button, index) => (
                            <Button
                                key={index}
                                {...(_.isObject(button.props) ? button.props : {})}
                                onClick={async () => {
                                    _.isFunction(button.onClick) && await button.onClick();
                                    _.eq(button.hideModal, true) && hide();
                                }}
                            >
                                {button.title}
                            </Button>
                        ))}
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
}

ModalInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func,
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    animation: PropTypes.bool,
    centered: PropTypes.bool,
    buttons: PropTypes.array,
    staticModal: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};

ModalInfo.defaultProps = {
    title: '',
    animation: true,
    centered: true,
    staticModal: false,
    buttons: [],
    className: '',
    onHide: _.noop,
    style: undefined,
};

export default ModalInfo;
