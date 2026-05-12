import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NoteFormValues } from "@/components/NoteForm/NoteForm";



type NoteDraftStore = {
    draft: NoteFormValues;
    setDraft: (note: NoteFormValues) => void;
    clearDraft: () => void;
}

const initialDraft: NoteFormValues = {
    title:'',
    content: '',
    tag:'Todo',
}

export const useNoteDraftStore = create<NoteDraftStore>()(persist(
    (set) => {
        return {
            draft: initialDraft,
            setDraft: (note) => {
                set(() => {
                    return {
                        draft: note
                    }
                })
            },
            clearDraft: () => {
                set(() => {
                    return {
                        draft:initialDraft
                    }
                })
            }
        }
    },
    {
        name: 'noteDraft',
        partialize: (state) => {
            return {
                draft: state.draft
            }
        }
    }
))



 