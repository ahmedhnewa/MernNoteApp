import { RequestHandler } from "express";
import { NoteValidationSchema } from '../models/note'
import createHttpError from "http-errors";
import { validateItemId } from "../utils/database";
import { getAuthenticatedUser } from "../utils/auth";
import * as NotesDataSource from '../data/note'

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const userId = (await getAuthenticatedUser(req)).id
        const notes = await NotesDataSource.getAllNotesOfUser(userId)
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const getNote: RequestHandler = async (req, res, next) => {
    try {
        const userId = (await getAuthenticatedUser(req)).id

        const noteId = req.params.noteId
        validateItemId(noteId)

        const note = await NotesDataSource.getNoteOfUserById(noteId, userId)

        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}

export const createNote: RequestHandler = async (req, res, next) => {
    try {
        await NoteValidationSchema.validateAsync(req.body)

        const title: string = req.body.title
        const text: string | undefined = req.body.text

        const userId = (await getAuthenticatedUser(req)).id

        const newNote = await NotesDataSource.createNote({
            title: title,
            text: text,
            userId: userId,
        })
        res.status(201).json(newNote)
    } catch (error) {
        next(error)
    }
}

export const updateNote: RequestHandler = async (req, res, next) => {
    try {
        const noteId = req.params.noteId
        validateItemId(noteId)

        await NoteValidationSchema.validateAsync(req.body)

        const newTitle: string = req.body.title
        const newText: string | undefined = req.body.text

        const userId = (await getAuthenticatedUser(req)).id

        const note = await NotesDataSource.getNoteOfUserById(noteId, userId)

        note.title = newTitle
        note.text = newText

        const updatedNote = await note.save()
        res.status(200).json(updatedNote)
    } catch (error) {
        next(error)
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    try {
        const noteId = req.params.noteId
        validateItemId(noteId)

        const userId = (await getAuthenticatedUser(req)).id
        
        const note = await NotesDataSource.getNoteOfUserById(noteId, userId)
        
        await note.deleteOne()
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}