import { Document, Schema, Model, model } from 'mongoose';

export interface IUser {
    googleId?: string;
}

export interface IUserDocument extends IUser, Document {

}

export var UserSchema: Schema = new Schema({
    googleId: String
});

export const User: Model<IUserDocument> = model<IUserDocument>("User", UserSchema);