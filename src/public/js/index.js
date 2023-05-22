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
const logoutBtn = document.getElementById("logout");
// const loginForm = document.getElementById("loginForm");
// const getProfile = document.getElementById("getProfile")

if (listCart || listMessages || listProducts) {
  var socket = io();
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    fetch("sessions/logout", {
      method: "post"
    })
      .then((res) => res.json())
      .then(() => window.location.href="/login")
  });
}

// if (loginForm) {
//   loginForm.addEventListener("submit", async (evt) => {
//     evt.preventDefault();
//     const formValues = {
//       email: loginForm.email.value,
//       password: loginForm.password.value,
//     };
//     if (
//       loginForm.email.value.trim().length &&
//       loginForm.password.value.trim().length > 0
//     ) {
//       console.log(formValues);
//       const response = await fetch("sessions/login", {
//         method: "post",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify(formValues),
//       });
//       const data = await response.json()
//     }
//   });
// }

// if(getProfile){
//   getProfile.addEventListener("click", async(evt)=>{
//     const response = await fetch("sessions/profile-jws-passport", {
//       method: "get",
//     });
//     const data = await response.json()
//     console.log({response: data})
//   })
// }

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
    if (data) {
      for (const el of data.docs) {
        const li = document.createElement("li");
        const cartButton = document.createElement("button");
        cartButton.innerText = "Agregar al carrito";
        li.innerText = `${el.title}: ${el.price}, _id: ${el._id}, CODE: ${el.code}, STATUS:${el.status}, STOCK:${el.stock}`;
        li.appendChild(cartButton);
        listProducts.appendChild(li);
      }
      if (pageList) {
        pageList.innerHTML = "";
        if (data.hasPrevPage) {
          const buttonPrev = document.createElement("button");
          buttonPrev.innerText = "Anterior";
          buttonPrev.addEventListener("click", (evt) => {
            evt.preventDefault();
            socket.emit("page", data.prevPage);
          });
          pageList.appendChild(buttonPrev);
        }
        if (data.hasNextPage) {
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
    }
  });
}
