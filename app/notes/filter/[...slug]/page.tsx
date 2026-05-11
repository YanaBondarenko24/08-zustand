import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';



type Props = {
  searchParams: Promise<{
    query?: string,
    page?: number,
  }>;
  params: Promise<{ slug: string[] }>;
};
export default async function Notes({
  searchParams,params }:Props) {
  const { slug } = await params;
   const rawTag = slug?.[0];
  const tag = rawTag === "all" ? undefined : (rawTag as NoteTag | undefined);
  
  const queryClient = new QueryClient();
  const search = await searchParams;
  const page = Number(search.page ?? 1);
  const query = String(search.query ?? '')
  await queryClient.prefetchQuery({
    queryKey: ["notes",query,page,tag],
    queryFn: () => fetchNotes(query,page,tag),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        tag={tag}/>
    </HydrationBoundary>
  )
}
