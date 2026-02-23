import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Title is required'),
    content: Yup.string()
        .min(10, 'Content must be at least 10 characters')
        .required('Content is required'),
    tags: Yup.array()
        .of(Yup.string())
        .min(1, 'At least one tag is required'),
    banner: Yup.mixed().nullable()
        .test('fileSize', 'Banner image must be less than 2MB', (value: any) => {
            if (!value) return true;
            const file: File | null = value instanceof File ? value : (value && (value as FileList)[0]) || null;
            if (!file) return true;
            return file.size <= 2 * 1024 * 1024;
        }),
        authorDetails: Yup.object().shape({
            name: Yup.string()
                .min(2, 'Author name must be at least 2 characters')
                .required('Author name is required'),
            profile: Yup.mixed().nullable()
                .test('fileSize', 'Profile image must be less than 2MB', (value: any) => {
                    if (!value) return true;
                    const file: File | null = value instanceof File ? value : (value && (value as FileList)[0]) || null;
                    if (!file) return true;
                    return file.size <= 2 * 1024 * 1024;
                }),
        })
});