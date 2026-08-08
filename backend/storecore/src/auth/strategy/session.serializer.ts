import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../user/schemas/user.schema";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {
        super();
    }



    // SERIALIZA AL USUARIO PARA LA SESIÓN
    serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
        done(null, {
            _id: user._id?.toString ? user._id.toString() : user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    }



    // DESERIALIZA AL USUARIO DESDE LA SESIÓN
    async deserializeUser(payload: any, done: (err: Error | null, payload: any) => void): Promise<any> {
        try {
            const user = await this.userModel.findById(payload._id).lean().exec();
            if (!user) {
                return done(new Error('Session invalid: user not found'), null);
            }
            done(null, payload);
        } catch (err) {
            done(err instanceof Error ? err : new Error(String(err)), null);
        }
    }
}
