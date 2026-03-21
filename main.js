const successBtn = document.getElementById("successBtn");
const failedBtn = document.getElementById("failedBtn");
const main = document.getElementById("main-body");
const loading = document.getElementById("loading");
const list = document.getElementById("nameList");
let isLoading = false;

// Helper functions
const wait = async (timer = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timer);
  });
};

function arrayHtml(array) {
  list.textContent = "";
  array.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item.fullName;
    list.appendChild(li);
  });
}

function loadUser() {
  const oldErrorMessage = main.querySelector(".errorMessage");
  if (oldErrorMessage) oldErrorMessage.remove();
  list.textContent = "";
  loading.style.display = "block";
  console.log("Fetching users...");
}

// async function
async function fetchUser(header) {
  if (isLoading) return;

  isLoading = true;
  successBtn.disabled = true;
  failedBtn.disabled = true;

  loadUser();
  const config = {};

  if (header) {
    config.headers = header;
  }
  await wait();
  try {
    const response = await fetch("https://reqres.in/api/users", config);

    if (response.ok) {
      const user = await response.json();
      const data = user.data;
      const onlyName = data.map(({ first_name, last_name }) => ({
        fullName: first_name + " " + last_name,
      }));
      // onlyName.forEach((i) => console.log(`${i.fullName}`));
      arrayHtml(onlyName);
      console.log("Done");
    } else {
      throw new Error(
        "Something went wrong with your request. Status: " + response.status,
      );
    }
  } catch (error) {
    let errorMessage = main.querySelector(".errorMessage");

    if (!errorMessage) {
      errorMessage = document.createElement("p");
      errorMessage.className = "errorMessage";
      main.append(errorMessage);
    }
    errorMessage.textContent = "No users";
    console.log(error.message);
  } finally {
    loading.style.display = "none";
    successBtn.disabled = false;
    failedBtn.disabled = false;
    isLoading = false;
  }
}

// Button clicks
successBtn.addEventListener("click", () =>
  fetchUser({ "x-api-key": "reqres_6e0c647f5b164d83a9ec1167694a4759" }),
);

failedBtn.addEventListener("click", () => fetchUser());
