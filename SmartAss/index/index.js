window.addEventListener("load", () => {
    if(localStorage.getItem("accounts") === null) return createAccountsStorage();
});

function createAccountsStorage() {
    localStorage.setItem("accounts", JSON.stringify([]));
}

function updateAccountsStorage(account) {
    const accountsStorage = JSON.parse(localStorage.getItem("accounts"));
    const newAccountsStorage = [...accountsStorage, account];

    localStorage.setItem("accounts", JSON.stringify(newAccountsStorage));
}

const signInButton = document.querySelector(".sign-in-button");

signInButton.onclick = () => {
    const { usernameValue, passwordValue } = validationCheck();
    updateAccountsStorage({ username: usernameValue, password: passwordValue, users: [] });
}

const logInButton = document.querySelector(".log-in-button");

logInButton.onclick = () => {
    const { usernameValue, passwordValue } = validationCheck();

    const accountsStorage = JSON.parse(localStorage.getItem("accounts"));
    let exists = false;

    accountsStorage.forEach(account => {
        if(account.username === usernameValue && account.password === passwordValue) exists = true;
    });

    if(exists) {
        window.location.href = "../acc/index.html";
        localStorage.setItem("currentAccount", usernameValue);
    }

    else alert("Wrong username or password.");
}

function validationCheck() {
    const [usernameForm, passwordForm] = document.querySelectorAll(".form-control");

    const usernameFormInput = usernameForm.querySelector("input");
    if(usernameFormInput.value.length < 3) return alert("Username must have 3 or more characters.");

    const passwordFormInput = passwordForm.querySelector("input");
    if(passwordFormInput.value.length < 8) return alert("Password must have 8 or more characters.");

    return { usernameValue: usernameFormInput.value, passwordValue: passwordFormInput.value };
}