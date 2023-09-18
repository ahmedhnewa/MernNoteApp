import { isValidObjectId as isValidMongoObjectId } from "mongoose";
import createHttpError from "http-errors";

export const validateItemId = (itemId: string, errorMessage?: string) => {
    if (!isValidMongoObjectId(itemId)) throw createHttpError(400, errorMessage ?? 'Id is not valid')
}
