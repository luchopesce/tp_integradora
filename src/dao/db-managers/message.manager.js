import messageModel from "./../models/message.model.js";
export default class MessageManager {
  constructor() {
    console.log("Working with messages using dbsystem");
  }

  getMessages = async () => {
    const messages = await messageModel.find().lean();
    return messages;
  };

  createMessage = async (data, io) => {
    const newMessage = new messageModel({
      usuario: data.userName,
      message: data.message,
    });
    newMessage
      .save()
      .then(() => {
        console.log("Mensaje guardado en MongoDB" )
        this.sendMessage(io)
      })
      .catch((error) =>
        console.error("Error al guardar el mensaje en MongoDB", error)
      );
  };

  sendMessage = async (app) => {
    const io = app
    const messages = await this.getMessages();
    io.emit("messages", messages);
  }
}
