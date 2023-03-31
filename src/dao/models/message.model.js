import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})

const messageModel = mongoose.model("messages", messageSchema)
export default messageModel