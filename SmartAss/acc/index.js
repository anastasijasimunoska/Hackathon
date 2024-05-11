const body = document.querySelector("body");
const currentAcount = localStorage.getItem("currentAccount");

window.addEventListener("load", load);

function load() {
    if(getCurrentAccountUsers().length > 0) loadUserStorage();
    
    const h1 = document.querySelector("h1");
    const userStorage = getCurrentAccountUsers();
    
    if(userStorage.length) h1.innerText = `Welcome back, ${currentAcount}!`;
    else h1.innerText = `Welcome, ${currentAcount}!`;
}

function getCurrentAccountUsers() {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    let users = [];

    accounts.forEach(account => {
        if(account.username === currentAcount) users = account.users;
    });

    return users;
}

function loadUserStorage() {
    const userStorage = getCurrentAccountUsers();
    const userList = document.querySelector(".user-list");
    const addUserHolder = document.querySelector(".add-user-holder");

    userStorage.forEach(user => {
        const userTemplate = document.querySelector(".user-template");
        const userElement = userTemplate.content.cloneNode(true);

        const userElementImg = userElement.querySelector("img");
        const userElementP = userElement.querySelector("p");

        userElementImg.src = user.avatar;
        userElementP.innerText = user.username;

        userList.insertBefore(userElement, addUserHolder);

        const realUserElement = userElementImg.parentNode;
        
        realUserElement.onclick = () => {
            localStorage.setItem("username", userElementP.innerText);
            window.location.href = "../bots/index.html";
        }
    });
}

function updateUserStorage(user) {
    const currentUserStorage = getCurrentAccountUsers();
    const newUserStorage = [...currentUserStorage, user];

    const accountStorage = JSON.parse(localStorage.getItem("accounts"));
    const newAccountsStorage = [];

    accountStorage.forEach(account => {
        if(account.username === currentAcount) newAccountsStorage.push({...account, users: newUserStorage});
        else newAccountsStorage.push(account);
    });

    localStorage.setItem("accounts", JSON.stringify(newAccountsStorage));
}

const addUserButton = document.querySelector(".add-user-button");
addUserButton.onclick = createAddUserModal;

function createAddUserModal() {
    const addUserTemplate = document.querySelector(".add-user-template");
    const addUserElement = addUserTemplate.content.cloneNode(true);

    const welcome = document.querySelector(".welcome");
    welcome.appendChild(addUserElement);

    const addButton = document.querySelector(".add-user form button");
    addButton.onclick = e => addUser(e);

    setTimeout(() => {
        body.addEventListener("click", checkAddUserModal);
    }, 10);
}

function checkAddUserModal(e) {
    if(!e.target.classList.contains("add-user")) {
        if(e.target.parentNode) {
            if(checkParent(e.target.parentNode)) deleteAddUserModal();
    
            function checkParent(parent) {
                if(parent.classList?.contains("add-user")) return false;
                else if(parent.parentNode) return checkParent(parent.parentNode);
                else return true;
            }
        }

        else deleteAddUserModal();
    }
}

function deleteAddUserModal() {
    const addUserElement = document.querySelector(".add-user");
    addUserElement.remove();

    body.removeEventListener("click", checkAddUserModal);
}

function addUser(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const userList = document.querySelector(".user-list");
    const addUserHolder = document.querySelector(".add-user-holder");

    const userTemplate = document.querySelector(".user-template");
    const userElement = userTemplate.content.cloneNode(true);

    const avatar = document.querySelector(".add-user img").src;
    const username = document.querySelector(".add-user form input").value;
    
    const newUser = {avatar, username};
    
    const userElementP = userElement.querySelector("p");
    userElementP.innerText = username;

    userList.insertBefore(userElement, addUserHolder);

    const realUserElement = userElementP.parentNode;
    
    realUserElement.onclick = () => {
        localStorage.setItem("username", userElementP.innerText);
        window.location.href = "../bots/index.html";
    }

    updateUserStorage(newUser);
    deleteAddUserModal();
}