import axios from 'axios';
import type { Note,NoteTag } from '../types/note';
import  {NoteFormValues} from '../components/NoteForm/NoteForm';

const BASE_URL = "https://notehub-public.goit.study/api";
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;


interface FetchNotesProps{
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes(query:string, page:number,tag?:NoteTag ) {
    const res = await axios.get<FetchNotesProps>(`${BASE_URL}/notes`, {
        headers: {
            Authorization: `Bearer ${myKey}`
        },
        params: {
            search: query,
            page,
            ...(tag ? { tag } : {}),
            
        }
    })
    return res.data;
}



export async function createNote(note:NoteFormValues) {
    const res = await axios.post<Note>(`${BASE_URL}/notes`, note,{
        headers: {
         Authorization: `Bearer ${myKey}`  
        },
        
    })

    return res.data;
}




export async function deleteNote(id:string) {
    const res = await axios.delete<Note>(`${BASE_URL}/notes/${id}`,
        {
        headers: {
         Authorization: `Bearer ${myKey}`  
        },
    }
    )

return res.data  
}

export async function fetchNoteById (id:string) {
  const res = await fetch(`${BASE_URL}/notes/${id}`,
      {
        headers: {
         Authorization: `Bearer ${myKey}`  
        },
    }
  )
    if (!res.ok) throw new Error('Failed to feach post!');
    const data = (await res.json()) as Note;
  return data;
}

