import { model, Schema, Document } from 'mongoose';
import validator from 'validator';
import { IUser } from './user.model';

export interface IRestaurant extends Document {
    name: string;
    tables: Array<ITable>;
    manager: IUser["_id"];
};

export interface ITable {
    referenceNumber: number;
    index: number;
    seats: number;
    reservations: Array<IReservation>;
}

export interface IReservation {
    date: Date;
    customerName: string;
    customerEmail: string;
    customerPhoneNumber: string;
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
}, {
    timestamps: true
});

const tableSchema = new Schema({
    referenceNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    index: {
        type: Number,
        required: true,
        unique: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    reservations: [reservationSchema],
}, {
    timestamps: true
});

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    tables: [tableSchema],
    manager: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});


export default model<IRestaurant>('Restaurant', restaurantSchema);;