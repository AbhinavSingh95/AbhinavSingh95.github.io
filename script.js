const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
let theme = localStorage.getItem("theme");

if (theme == null) {
    setTheme("light");
} else {
    setTheme(theme);
}

let themeDots = document.getElementsByClassName("theme-dot");

for (var i = 0; themeDots.length > i; i++) {
    themeDots[i].addEventListener("click", function () {
        let mode = this.dataset.mode;
        console.log("Options clicked:", mode);
        setTheme(mode);
    });
}

function setTheme(mode) {
    if (mode == "light") {
        document.getElementById("theme-style").href = "default.css";
    }
    if (mode == "blue") {
        document.getElementById("theme-style").href = "blue.css";
    }
    if (mode == "purple") {
        document.getElementById("theme-style").href = "purple.css";
    }
    if (mode == "green") {
        document.getElementById("theme-style").href = "green.css";
    }

    localStorage.setItem("theme", mode);
}

function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch("https://getform.io/f/75f08d80-b90d-429b-bbed-d5b267545e96", {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json",
        },
    })
        .then((response) => {
            form.reset();
        })
        .catch((error) => console.log(error));
}

form.addEventListener("submit", formSubmit);
