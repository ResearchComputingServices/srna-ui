/* eslint-disable no-restricted-globals */
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export default function useSchema() {
    const [t] = useTranslation('common');
    yup.addMethod(yup.number, 'formatEmptyNumber', function() {
        return this.transform(value => (isNaN(value) ? undefined : value));
    });

    yup.addMethod(yup.number, 'noZero', function() {
        return this.test('no-zero', 'value cannot be zero', value => value === undefined || value !== 0);
    });

    yup.addMethod(yup.number, 'betweenOne', function() {
        return this.test('between-one', 'value must be between 0 and 1', value => value === undefined || (value >= 0 && value <= 1));
    });

    const fileRequired = t('computationForm.fileRequired');

    return yup.object().shape({
        sequenceFile: yup
            .object()
            .required(fileRequired),
        format: yup
            .string()
            .nullable()
            .required(),
        shift: yup
            .number()
            .integer()
            .formatEmptyNumber()
            .noZero()
            .required(),
        length: yup
            .number()
            .integer()
            .formatEmptyNumber()
            .positive()
            .required(),
        cutOff: yup
            .number()
            .formatEmptyNumber()
            .positive()
            .required(),
        identity: yup
            .number()
            .formatEmptyNumber()
            .betweenOne()
            .required(),
        recomputingShift: yup
            .number()
            .integer()
            .formatEmptyNumber()
            .noZero()
            .when('reCompute', {
                is: true,
                then: yup
                    .number()
                    .integer()
                    .formatEmptyNumber()
                    .noZero()
                    .required(),
            }),
        tagFile: yup
            .object()
            .when('computeOnlyTags', {
                is: true,
                then: yup
                    .object()
                    .required(fileRequired),
            }),
    });
}
