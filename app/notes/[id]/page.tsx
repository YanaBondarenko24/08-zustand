
import { fetchNoteById } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

type Props = {
  params: Promise<{id:string}>
}

export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {id}  = await params;
  const note = await fetchNoteById(id);
  
  return {
    title: `Note ${note.title}`,
    description: `Note ${note.content}`,
    openGraph: {
      title: `Note ${note.title}`,
      description: `Note ${note.content}`,
      url: `https://08-zustand-beta-nine.vercel.app/notes/${id}`,
      images: [{
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: "NoteHub"
    }]
    }
  }
}

export default async function NoteDetails({ params }: Props) { 
  const queryClient = new QueryClient();
  const {id} = await params;
  await queryClient.prefetchQuery({
    queryKey: ["notes",id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient  />
    </HydrationBoundary>
  )
}
