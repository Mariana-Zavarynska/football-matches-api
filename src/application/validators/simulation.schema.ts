import * as yup from 'yup';

export const startSimulationSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .min(8, 'Name must be at least 8 characters long')
        .max(30, 'Name must be at most 30 characters long')
        .matches(/^[A-Za-z0-9\s]+$/, 'Name may contain only letters, digits and spaces')
});
