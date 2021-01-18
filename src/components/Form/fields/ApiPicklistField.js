import _ from 'lodash';
import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTypeahead } from '../../../hooks';
import { useStyles } from '..';

function formatDefaultValue(field) {
    const defaultValue = _.get(field, 'defaultValue');
    const isArray = _.get(field, 'multiple');
    if (_.isNil(defaultValue) || (_.eq(defaultValue, ''))) {
        return isArray ? [] : null;
    }
    return defaultValue;
}
function ApiPicklistField({ field, controls: { control, errors } }) {
    const classes = useStyles();
    const disabled = _.get(field, 'disabled');
    const defaultValue = formatDefaultValue(field);
    const query = _.get(field, 'query');
    const multiple = _.get(field, 'multiple');
    const filter = _.get(field, 'filter');
    const {
        loading,
        items,
        identifierKey,
        onTypeahead,
    } = useTypeahead(field.entity, defaultValue, { disabled, query });
    return (
        <Box className={classes.field}>
            <Controller
                getOptionLabel={option => _.get(option, [identifierKey], null)}
                getOptionSelected={(option, value) => _.eq(_.get(option, [identifierKey]), _.get(value, [identifierKey]))}
                options={_.isFunction(filter) ? _.filter(items, filter) : items}
                rules={{
                    required: field.required,
                    ...(multiple && field.required ? { validate: data => !_.isEmpty(data) || '' } : {}),
                }}
                {..._.omit(field, ['entity', 'filter', 'query'])}
                as={<Autocomplete />}
                control={control}
                defaultValue={defaultValue}
                name={field.name}
                onChange={([, data]) => {
                    _.isFunction(field.onChange) && field.onChange(data);
                    return data;
                }}
                renderInput={
                    params => (
                        <TextField
                            {...params}
                            disabled={field.disabled}
                            helperText={field.helperText}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? (
                                            <CircularProgress
                                                color='inherit'
                                                size={20}
                                            />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                            label={field.label}
                            onChange={event => {
                                _.isFunction(onTypeahead) && onTypeahead(_.get(event, 'target.value'));
                            }}
                            required={field.required}
                            variant={field.variant}
                        />
                    )
                }
            />
            {field.field in errors && (_.eq(_.get(errors, [field.field, 'type']), 'custom') ? (
                <Box className={classes.error}>
                    {errors[field.field].message}
                </Box>
            ) : (
                <Box className={classes.error}>
                    The field &quot;
                    {field.label}
                    &quot; is Mandatory for save
                </Box>
            ))}
        </Box>
    );
}

ApiPicklistField.propTypes = {
    field: PropTypes.object.isRequired,
    controls: PropTypes.object.isRequired,
};

export default ApiPicklistField;
