const socket = io();
let userName;

const listMessages = document.getElementById("list-messages");
if (listMessages) {
  Swal.fire({
    title: "Login",
    input: "text",
    text: "Ingresa tu nombre de usuario",
    inputValidator: (value) => {
      return !value && "Es obligatorio introducir nombre de usuario";
    },
    allowOutsideClick: false,
  }).then((res) => {
    userName = res.value;
    socket.emit("new-user", userName);
  });

  const chatInput = document.getElementById("chat-input");
  chatInput.addEventListener("keyup", (ev) => {
    if (ev.key === "Enter") {
      const inputMessage = chatInput.value;
      if (inputMessage.trim().length > 0) {
        socket.emit("chat-message", { userName, message: inputMessage });
        chatInput.value = "";
      }
    }
  });

  const messagesInput = document.getElementById("messages");
  socket.on("messages", (data) => {
    let messages = "";

    data.forEach((element) => {
      messages += `<b>${element.usuario}:</b>
                        ${element.message}</br>`;
    });

    messagesInput.innerHTML = messages;
  });

  socket.on("new-user", (user) => {
    Swal.fire({
      title: `${user} se a unido al chat`,
      toast: true,
      position: "top-end",
    });
  });
}

const listProducts = document.getElementById("list-products");
if (listProducts) {
  socket.on("list-products", (data) => {
    listProducts.innerHTML = "";
    for (const el of data) {
      const li = document.createElement("li");
      if (el.id >= 0) {
        li.innerText = `${el.title}: ${el.price}, ID: ${el.id}, CODE: ${el.code}, STATUS:${el.status}, STOCK:${el.stock}`;
        listProducts.appendChild(li);
      } else if (el._id) {
        li.innerText = `${el.title}: ${el.price}, _id: ${el._id}, CODE: ${el.code}, STATUS:${el.status}, STOCK:${el.stock}`;
        listProducts.appendChild(li);
      }
    }
  });
}
