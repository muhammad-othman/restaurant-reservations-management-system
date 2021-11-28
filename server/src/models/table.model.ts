import { model, Schema, Document } from 'mongoose';
import { IReservation } from './reservation.model';
import { IRestaurant } from './restaurant.model';


export interface ITable extends Document {
    referenceNumber: number;
    index: number;
    seats: number;
    restaurant: IRestaurant["_id"];
    reservations: Array<IReservation["_id"]>;
}

const tableSchema = new Schema({
    referenceNumber: {
        type: Number,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation'
    }],
    restaurant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'
    },
}, {
    timestamps: true
});


export default model<ITable>('Table', tableSchema);
