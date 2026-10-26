import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    _id: string;
    content : string;
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessages : boolean;
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        match : [/.+\@.+\..+/, "Please use a valid email address"] //regex -> regular expression
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    verifyCode : {
        type : String,
        required : [true, "Verification is required"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "Verification Code Expiry is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        default : false,
    },
    messages : [MessageSchema] //messageSchema type ka array
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema)) //first one if the model is already made and available and second one if its our first time creating the model is dB or dono me type introduced hai while fetching and saving

export default UserModel;


//Express me ek baar server ban gya models vgerah ka initialisation hogya toh ab vo app baar baar ni chalri ek bar chal gya matlb chalta hi rehta hai, but since Nextjs edge pe run karta hai it doesnt realise if its first time the application is booting up or it already did in the past isly nextJs ke andar data export thoda diff hota hai (as shown above) 