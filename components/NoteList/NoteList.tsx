'use client';
import type { Note } from '../../types/note'
import css from './NoteList.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface NoteListProps{
  notes: Note[]; 
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
   const deleteMutation = useMutation({
  mutationFn: deleteNote,

  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Successfully delete!');
  },
   });
    return (<ul className={css.list}>
	{notes.map((note) => <li key={note.id} className={css.listItem}>
    <h2 className={css.title}>{ note.title}</h2>
    <p className={css.content}>{note.content}</p>
    <div className={css.footer}>
      <span className={css.tag}>{note.tag}</span>
      <Link href ={`/notes/${note.id}`} >View details</Link>
      <button onClick={() => {
        deleteMutation.mutate(note.id);
       
      }} className={css.button}>Delete</button>
    </div>
  </li>) 
}
</ul>
)
}
