import React from 'react';
import FileSaver from 'file-saver';
import { Tooltip, Box, IconButton } from '@material-ui/core';
import { Refresh as RefreshIcon, GetApp as DownloadIcon, Add as CreateIcon } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useToast } from '../ToastContext';
import Button from '../Button';
import Ripple from '../Ripple';
import { useActions, useService, useStore } from '../../hooks';

const useStyles = makeStyles(() => ({
    refreshIcon: {
        height: 35,
        width: 35,
    },
    downloadIcon: {
        height: 30,
        width: 30,
    },
}));

function Computations() {
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();
    const [t] = useTranslation('common');
    const historyService = useService('history');
    const toastActions = useToast();
    const computations = useStore('computations');
    const computationsActions = useActions('computations');
    const computationService = useService('computation');

    const saveFile = (computation, response) => {
        const extension = 'xlsx';
        const filename = 'sRNAComputation';
        FileSaver.saveAs(response, `${filename}-${computation.taskId}.${extension}`);
    };

    const download = async computation => {
        try {
            const response = await computationService.outputFile(computation.taskId);
            saveFile(computation, response);
            computationsActions.attemptComputationDownload(computation.taskId);
            // Get the task object and increments it's download counter to indicate that results were downloaded once.
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                console.log(err);
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    const columns = [
        {
            title: t('computations.taskId'),
            field: 'taskId',
        },
        {
            title: t('computations.filename'),
            field: 'filename',
        },
        {
            title: t('computations.status'),
            field: 'status',
        },
        {
            title: t('computations.createdDate'),
            field: 'createdDate',
        },
        {
            title: t('computations.downloadResult'),
            field: 'downloadResult',
            filtering: false,
            render: rowData => (
                rowData.status === 'Pending'
                    ? (
                        <Box ml={1.5}>
                            <Ripple
                                color='warning'
                                size={50}
                            />
                        </Box>
                    )
                    : (
                        <Box ml={1}>
                            <IconButton
                                color='primary'
                                onClick={event => {
                                    event.stopPropagation();
                                    download(rowData);
                                }}
                            >
                                <DownloadIcon className={classes.downloadIcon} />

                            </IconButton>
                        </Box>
                    )),
        },
    ];

    const onCreate = () => historyService.go('/create');

    const onRowClick = (_, data) => historyService.go(`computation/${data.taskId}`);

    const refresh = async () => {
        try {
            setLoading(true);
            const statuses = await computationService.statuses(Object.keys(computations.data));
            const completedStatuses = [];
            statuses.forEach(status => {
                if (status.taskStatus === 'SUCCESS') {
                    completedStatuses.push(status.taskId);
                }
            });
            computationsActions.completeComputations(completedStatuses);
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            ml={3}
            mr={3}
            mt={5}
        >
            <Box
                alignItems='center'
                display='flex'
                justifyContent='space-between'
                mb={1}
            >
                <Button
                    color='primary'
                    onClick={onCreate}
                    startIcon={<CreateIcon />}
                    variant='contained'
                >
                    Create
                </Button>
                <Tooltip title={t('computations.refreshComputations')}>
                    <IconButton
                        color='primary'
                        disabled={loading}
                        onClick={refresh}
                    >
                        <RefreshIcon
                            className={classes.refreshIcon}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <MaterialTable
                columns={columns}
                data={Object.keys(computations.data).map(key => ({
                    taskId: computations.data[key].taskId,
                    status: computations.data[key].status,
                    filename: computations.data[key].filename,
                    createdDate: moment(computations.data[key].createdDate).format('LLLL'),
                }))}
                isLoading={loading}
                onRowClick={onRowClick}
                options={{
                    filtering: true,
                    pageSize: 5,
                }}
                style={{
                    padding: 10,
                    minWidth: 480,
                }}
                title={t('computations.title')}
            />
        </Box>
    );
}

export default Computations;
