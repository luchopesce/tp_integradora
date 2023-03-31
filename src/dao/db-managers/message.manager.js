import messageModel from "./../models/message.model.js";
export default class MessageManager {
  constructor() {
    console.log("Working with messages using dbsystem");
  }

  getMessages = async () => {
    const messages = await messageModel.find().lean();
    return messages;
  };

  createMessage = async (data) => {
    const newMessage = new messageModel({
      usuario: data.userName,
      message: data.message,
    });
    return newMessage
  };
}
