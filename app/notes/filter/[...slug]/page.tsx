import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';
import { Metadata } from 'next';




type Props = {
  searchParams: Promise<{
    query: string,
    page: number,
  }>;
  params: Promise<{ slug: string[] }>;
};


export async function generateMetadata({ searchParams, params }: Props):Promise<Metadata>{
  const { slug } = await params;
  const { query, page } = await searchParams;
    const rawTag = slug?.[0];
  const tag = rawTag === "all" ? undefined : (rawTag as NoteTag | undefined);
  const notes = await fetchNotes(query,page,tag)
  return {
    title: `${tag} notes.`,
    description: `You have ${tag?.length} ${tag} notes.`,
    openGraph: {
     title: `${tag} notes.`,
    description: `You have ${tag?.length} ${tag} notes.`,
    url: `https://localhost:3000/notes/filter/${tag}`,
        images: [{
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: "NoteHub"
    }]
    }
  }
}
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
