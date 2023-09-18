import { Note, NoteInput } from "../models/note";
import { fetchWithError } from "../core/network";

export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchWithError('/api/notes', { method: 'GET' })
    return await response.json()
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchWithError('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    })
    return await response.json()
}

export async function deleteNote(noteId: string) {
    await fetchWithError(`/api/notes/${noteId}`, {
        method: 'DELETE'
    })
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await fetchWithError(`/api/notes/${noteId}`, 
    {
        'method': 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    })
    return response.json()
}