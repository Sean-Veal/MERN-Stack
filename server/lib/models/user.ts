import { Document, Schema, Model, model } from 'mongoose';

export interface IUser {
    googleId?: string;
    credits?: number;
}

export interface IUserDocument extends IUser, Document {

}

export var UserSchema: Schema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
});

export const User: Model<IUserDocument> = model<IUserDocument>("User", UserSchema);