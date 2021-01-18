import React from 'react';
import _ from 'lodash';
import { DateTimePicker } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import {
    PicklistField,
    ApiPicklistField,
    RawField,
    TextMasked,
    Checkbox,
    Field,
    NumberField,
} from './fields';

export default function(controls) {
    return {
        text: (key, field) => (
            <Field
                key={key}
                controls={controls}
                field={field}
            >
                <TextField />
            </Field>
        ),
        textarea: (key, field) => (
            <Field
                key={key}
                controls={controls}
                field={field}
            >
                <TextField multiline />
            </Field>
        ),
        number: (key, field) => (
            <NumberField
                key={key}
                controls={controls}
                field={field}
            />
        ),
        email: (key, field) => (
            <Field
                key={key}
                controls={controls}
                field={field}
            >
                <TextField type='email' />
            </Field>
        ),
        datetime: (key, field) => {
            const defaultValue = _.get(field, 'defaultValue');
            if (_.isNil(defaultValue) && _.isEmpty(defaultValue)) {
                field.defaultValue = moment.utc(field.defaultValue).local().toISOString();
            }
            return (
                <Field
                    key={key}
                    controls={controls}
                    field={{
                        ...field,
                        defaultValue: field.defaultValue || null,
                    }}
                >
                    <DateTimePicker inputVariant={field.variant} />
                </Field>
            );
        },
        phone: (key, field) => (
            <TextMasked
                key={key}
                controls={controls}
                field={{
                    ...field,
                    mask: '(999) 999 9999',
                }}
            />
        ),
        array: (key, field) => (
            <PicklistField
                key={key}
                controls={controls}
                field={{
                    ...field,
                    multiple: true,
                    freeSolo: true,
                    options: [],
                }}
            />
        ),
        picklist: (key, field) => (
            <PicklistField
                key={key}
                controls={controls}
                field={field}
            />
        ),
        'api-picklist': (key, field) => (
            <ApiPicklistField
                key={key}
                controls={controls}
                field={field}
            />
        ),
        'api-picklist-multiple': (key, field) => (
            <ApiPicklistField
                key={key}
                controls={controls}
                field={{
                    ...field,
                    multiple: true,
                }}
            />
        ),
        'picklist-multiple': (key, field) => (
            <PicklistField
                key={key}
                controls={controls}
                field={{
                    ...field,
                    multiple: true,
                }}
            />
        ),
        raw: (key, { content }) => (
            <RawField
                key={key}
                content={content}
                controls={controls}
            />
        ),
        checkbox: (key, field) => (
            <Checkbox
                key={key}
                controls={controls}
                field={field}
            />
        ),
    };
}
