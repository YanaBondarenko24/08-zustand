'use client';
import css from './NoteForm.module.css'
import { Formik, Form, Field, type FormikHelpers, ErrorMessage} from 'formik';
import { useId } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import toast from 'react-hot-toast';
import { createNote } from '@/lib/api';


export interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo"| "Work"| "Personal"| "Meeting"| "Shopping"
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short.")
    .max(50, "Title too long.")
    .required("This is a required field!"),
  content: Yup.string()
    .max(500, "Content too long."),
  tag: Yup.string()
  .oneOf(["Todo", "Work","Personal","Meeting", "Shopping"])
})

interface NoteFormProps{
  onCancel: () => void;
}

const initialValues: NoteFormValues = {
    title:'',
    content: '',
    tag:'Work',
}
export default function NoteForm({ onCancel}:NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
  mutationFn: createNote,

  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    toast.success('Successfully created!');
    onCancel();
  },
         });
  
  const handleSubmit = (
    values: NoteFormValues,
    formikHelpers: FormikHelpers<NoteFormValues>,
  ) => {
    createMutation.mutate(values); 
    formikHelpers.resetForm();
  };


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
    <Form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
        <ErrorMessage name="title" className={css.error} component="span"/>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <Field as="textarea"
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
        />
         <ErrorMessage name="content" className={css.error} component="span"/>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>
         <ErrorMessage name="tag" className={css.error} component="span"/>
      </div>

      <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onCancel}>
      Cancel
    </button>
          <button
          type="submit"
          className={css.submitButton}
          disabled={false}
        >
          Create note
        </button>
      </div>
      </Form>
    </Formik>
);
}