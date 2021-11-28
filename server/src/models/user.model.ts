import { model, Schema, Document, Model, ObjectId } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IRestaurant } from './restaurant.model';

export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    restaurant: IRestaurant["_id"];
    generateAuthToken: () => string;
}

interface UserModel extends Model<IUser> {
    findByCredentials: (email: string, password: string) => Promise<IUser>;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.methods.generateAuthToken = function () {
    const user = this as IUser;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'reservations-secret')
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre<IUser>('save', async function (next) {
    const user = this as IUser;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = model<IUser, UserModel>('User', userSchema);

export default User;