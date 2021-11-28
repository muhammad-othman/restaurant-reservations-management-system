import { model, Schema, Document } from 'mongoose';
import { ITable } from './table.model';
import { IUser } from './user.model';

export interface IRestaurant extends Document {
    name: string;
    tables: Array<ITable["_id"]>;
    manager: IUser["_id"];
};

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    tables: [{
        type: Schema.Types.ObjectId,
        ref: 'Table'
    }],
    manager: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default model<IRestaurant>('Restaurant', restaurantSchema);