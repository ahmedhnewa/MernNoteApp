import createHttpError from 'http-errors'
import NoteModel, { CreateNoteInput } from '../models/note'

export async function getAllNotesOfUser(userId: string) {
    const notes = await NoteModel.find({
        userId: userId,
    }).exec()
    return notes
}

export async function getNoteOfUserById(noteId: string, userId: string) {
    const note = await NoteModel.findById(noteId)
        // .where('userId', userId) // important for production
        .exec()
    if (!note) throw createHttpError(404, 'Note not found.')

    // Double check
    if (note.userId !== userId) {
        throw createHttpError(401, 'You don\'t have access to this note.')
    }
    return note
}

export async function createNote(input: CreateNoteInput) {
    const note = await NoteModel.create({
        title: input.title,
        text: input.text,
        userId: input.userId,
    })
    return note
}
