import { model, Schema, Document } from 'mongoose';
import validator from 'validator';
import { ITable } from './table.model';


export interface IReservation extends Document {
    date: Date;
    customerName: string;
    customerEmail: string;
    customerPhoneNumber: string;
    table: ITable["_id"];
}

const reservationSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    customerPhoneNumber: {
        type: String,
        required: true,
    },
    table: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Table'
    },
}, {
    timestamps: true
});


export default model<IReservation>('Reservation', reservationSchema);