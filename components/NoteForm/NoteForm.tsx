'use client';
import css from './NoteForm.module.css'
import { useId } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { createNote } from '@/lib/api';
import { useRouter } from 'next/navigation'; 
import type { NoteTag } from '@/types/note';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import { useState } from 'react';



export interface NoteFormValues {
  title: string;
  content: string;
  tag: string
}


/* const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short.")
    .max(50, "Title too long.")
    .required("This is a required field!"),
  content: Yup.string()
    .max(500, "Content too long."),
  tag: Yup.string()
  .oneOf(["Todo", "Work","Personal","Meeting", "Shopping"])
}) */




export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
    }
  
  const queryClient = useQueryClient();
  const createMutation = useMutation({
  mutationFn: createNote,

  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    toast.success('Successfully created!');
    clearDraft();
  router.push('/notes/filter/all');
  },
  });
  

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData) as unknown as NoteFormValues;
    
    
    const errorsValid: Record<string, string> = {};

  
    if (!String(data.title.trim().length <= 2)||(data.title === '')) {
      errorsValid.title = 'Enter you title!';
    }
    if (!String(data.content.trim().length <= 10)||(data.content === '')) {
      errorsValid.content = 'Enter you text!';
      console.log(errors.content);
      
    }
    if (Object.keys(errorsValid).length > 0) {
      setErrors(errorsValid);
      return;
    }
    setErrors({});
      const entriesData = {
    title: String(data.title),
    content: String(data.content),
    tag: data.tag as NoteTag,
    };
try {
  await createNote(entriesData);
  router.push('/notes/filter/all');
  createMutation.mutate(data);
} catch (error) {
  console.log(error);
  
}
    

    
};
          
       return (
          <form action={handleSubmit} className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
             <input defaultValue={draft.title} onChange={handleChange} id={`${fieldId}-title`} type="text" name="title" className={css.input} />
             {errors.title && (<p className={css.error}>{errors.title}</p>)}
           </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
             <textarea
               defaultValue={draft.content}
               onChange={handleChange}
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
             />
              {errors.content && (<p className={css.error}>{errors.content}</p>)}
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <select defaultValue={draft.tag} onChange={handleChange} id={`${fieldId}-tag`} name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
             </select>
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={() => { router.push("/notes/filter/all") }}>
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
          </form>
        )
    }
  