'use client';
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from 'react';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from '@/app/notes/page.module.css'
import { keepPreviousData, useQuery} from '@tanstack/react-query'
import NoteList from '@/components/NoteList/NoteList';
import type { NoteTag } from '@/types/note';

import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Link from 'next/link';

type Props = {
  tag?: NoteTag;
};

export default function NotesClient({ tag }: Props) {
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
         <Link href="/notes/action/create" className={css.button}>Create note +</Link>
      </header>
      
        {isLoading && <Loader />}
        {isError && <ErrorMessage/>}
        {data?.notes && <NoteList notes={data.notes}/>}  
        
    </div>)
}