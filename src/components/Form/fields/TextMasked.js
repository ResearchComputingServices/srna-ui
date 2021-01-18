import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import _ from 'lodash';
import { useStyles } from '..';

function formatDefaultValue(field) {
    const defaultValue = _.get(field, 'defaultValue');
    if (_.isNil(defaultValue)) {
        return '';
    }
    return defaultValue;
}

function TextMasked({ field, controls: { control, errors } }) {
    const classes = useStyles();
    return (
        <Box className={classes.field}>
            <Controller
                {...field}
                as={(
                    <InputMask>
                        {
                            () => (
                                <TextField
                                    label={field.title}
                                    variant={field.variant}
                                    {..._.pick(field, ['fullWidth', 'size', 'className', 'required'])}
                                />
                            )
                        }
                    </InputMask>
                )}
                control={control}
                defaultValue={formatDefaultValue(field)}
                rules={{ required: field.required }}
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

TextMasked.propTypes = {
    field: PropTypes.object.isRequired,
    controls: PropTypes.object.isRequired,
};

export default TextMasked;
