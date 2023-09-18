import Joi from "joi";
import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    text: {
        type: String,
        min: 6,
        max: 50000
    },
}, { timestamps: true, });

const validationSchema = Joi.object({
    title: Joi.string()
        .min(6)
        .max(255)
        .required(),
    text: Joi
        .string()
        .min(6)
        .max(50000),
})

type Note = InferSchemaType<typeof noteSchema>;

export interface CreateNoteInput {
    title: string,
    text?: string,
    userId: string,
}

export default model<Note>("Note", noteSchema);
export const NoteValidationSchema = validationSchema