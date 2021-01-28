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
        fileSequence: yup
            .mixed()
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
            .test(
                'equal',
                `${t('computationForm.shift')} and ${t('computationForm.shiftHits')} should not be equal`,
                function(v) {
                    const shiftHits = this.resolve(yup.ref('shiftHits'));
                    return v !== shiftHits;
                },
            )
            .required(),
        length: yup
            .number()
            .integer()
            .formatEmptyNumber()
            .positive()
            .required(),
        fileTags: yup
            .mixed()
            .when('onlyTags', {
                is: true,
                then: yup
                    .mixed()
                    .required(fileRequired),
            }),
        eCutoff: yup
            .number()
            .formatEmptyNumber()
            .positive()
            .when('blast', {
                is: true,
                then: yup
                    .number()
                    .formatEmptyNumber()
                    .positive()
                    .required(),
            }),
        identityPerc: yup
            .number()
            .formatEmptyNumber()
            .betweenOne()
            .when('blast', {
                is: true,
                then: yup
                    .number()
                    .formatEmptyNumber()
                    .betweenOne()
                    .required(),
            }),
        shiftHits: yup
            .number()
            .integer()
            .formatEmptyNumber()
            .noZero()
            .test(
                'equal',
                `${t('computationForm.shift')} and ${t('computationForm.shiftHits')} should not be equal`,
                function(v) {
                    const shift = this.resolve(yup.ref('shift'));
                    return v !== shift;
                },
            )
            .when('followHits', {
                is: true,
                then: yup
                    .number()
                    .integer()
                    .formatEmptyNumber()
                    .noZero()
                    .required(),
            }),
    });
}
