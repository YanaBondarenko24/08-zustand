'use client';

import { useEffect, useState } from 'react';
import { fetchNotes } from '@/lib/api';
import { useDebouncedCallback } from 'use-debounce'
import SearchBox from '@/components/SearchBox/SearchBox';
import css from '@/app/notes/page.module.css'
import { keepPreviousData, useQuery} from '@tanstack/react-query'
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import type { NoteTag } from '@/types/note';

import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

type Props = {
  tag?: NoteTag;
};

export default function NotesClient({ tag }: Props) {
   const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('')
    const {data,isError,isLoading,isSuccess} = useQuery({
        queryKey: ['notes', search, currentPage,tag],
        queryFn: () => fetchNotes(search,currentPage,tag),
        placeholderData: keepPreviousData,
        
    })
      useEffect(() => {
    if (isSuccess && data?.notes.length === 0) {
      toast("No notes found for your request.",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
    }
  }, [data, isSuccess]);
    const totalPages = data?.totalPages ?? 0;
    
    const handleSearch = useDebouncedCallback((value: string) => { setSearch(value); setCurrentPage(1)}, 300);

    return (<div className={css.app}>
        
        <header className={css.toolbar}>
            <SearchBox text={search} onSearch={handleSearch} />
            <Toaster/>
       {totalPages > 1 && isSuccess && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>}
         <button onClick={() => setIsModalOpen(true)} className={css.button}>Create note +</button>
         {isModalOpen && (
        <Modal onClose={() => {
            setIsModalOpen(false); 
                }}>
            <NoteForm  onCancel={() => setIsModalOpen(false) }/>
        </Modal>
      )}
      </header>
      
        {isLoading && <Loader />}
        {isError && <ErrorMessage/>}
        {data?.notes && <NoteList notes={data.notes}/>}  
        
    </div>)
}