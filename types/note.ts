export  interface Note {
    content: string;
    title: string;
    tag: NoteTag;
    id: string;
    createdAt: string;
    updatedAt: string;
    
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";