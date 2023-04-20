let userName;

const btnCookies = document.getElementById("get-cookie-btn");
if (btnCookies) {
  btnCookies.addEventListener("click", () => {
    fetch("/api/cookies/get")
      .then((res) => res.json())
      .then((data) => console.log(data));
  });
}
const listMessages = document.getElementById("list-messages");
const listCart = document.getElementById("list-carts");
const listProducts = document.getElementById("list-products");
const pageList = document.getElementById("list-page");

if (listCart || listMessages || listProducts) {
  var socket = io();
}

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

if (listCart) {
  socket.on("list-carts", (data) => {
    console.log(data.products);
    listCart.innerHTML = "";
    for (const el of data.products) {
      const li = document.createElement("li");

      li.innerText = `Quantity: ${el.quantity}, ID: ${el.product._id}
      ${el.product.title}
      `;
      listCart.appendChild(li);
    }
  });
}

if (listProducts) {
  socket.on("list-products", (data) => {
    listProducts.innerHTML = "";
    for (const el of data.docs) {
      const li = document.createElement("li");
      const cartButton = document.createElement("button");
      cartButton.innerText = "Agregar al carrito";
      // if (el.id >= 0) {
      //   li.innerText = `${el.title}: ${el.price}, ID: ${el.id}, CODE: ${el.code}, STATUS:${el.status}, STOCK:${el.stock}`;
      //   listProducts.appendChild(li);
      // } else if (el._id) {     }

      li.innerText = `${el.title}: ${el.price}, _id: ${el._id}, CODE: ${el.code}, STATUS:${el.status}, STOCK:${el.stock}`;
      li.appendChild(cartButton);
      listProducts.appendChild(li);
    }
    if (pageList) {
      pageList.innerHTML = "";
      if (data.hasPrevPage) {
        // const aPrev = document.createElement("a");
        // aPrev.href = `/products?page=${data.prevPage}`;
        // aPrev.innerHTML = `Anterior`;
        // pageList.appendChild(aPrev);

        //button
        const buttonPrev = document.createElement("button");
        buttonPrev.innerText = "Anterior";
        buttonPrev.addEventListener("click", (evt) => {
          evt.preventDefault();
          socket.emit("page", data.prevPage);
        });
        pageList.appendChild(buttonPrev);
      }
      if (data.hasNextPage) {
        // const ahasPrev = document.createElement("a");
        // ahasPrev.href = `/products?page=${data.nextPage}`;
        // ahasPrev.innerHTML = `Siguiente`;
        // pageList.appendChild(ahasPrev);

        const buttonNext = document.createElement("button");
        buttonNext.innerText = "Siguiente";
        buttonNext.addEventListener("click", (evt) => {
          evt.preventDefault();
          socket.emit("page", data.nextPage);
        });
        pageList.appendChild(buttonNext);
      }
      const spanPage = document.createElement("span");
      spanPage.innerHTML = `Pagina ${data.page} de ${data.totalPages}`;
      pageList.appendChild(spanPage);
    }
  });
}
