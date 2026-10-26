import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number // its optional but if we have it then its DT is number
}

const connection:ConnectionObject = { } //initially we are able to keep it empty cs we said its DT is optional above

async function dbConnect():Promise<void> { //void = we dont care what type of data we getting
    if(connection.isConnected){
        console.log("Already connected to dB")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("Db connection established successfully")

    } catch (error) {
    
        console.log("Database connection failed", error);
        process.exit(1)
    }
}

export default dbConnect;