
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute("aria-expanded", String(!menuIsOpen));
            menuButton.setAttribute(
                "aria-label",
                menuIsOpen ? "Открыть меню" : "Закрыть меню"
            );

            navigation.classList.toggle("is-open", !menuIsOpen);
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Открыть меню");
                navigation.classList.remove("is-open");
            });
        });
    }

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const feedbackForm = document.getElementById("feedback-form");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(feedbackForm);
            const name = formData.get("name");
            const email = formData.get("email");
            const topic = formData.get("topic");
            const message = formData.get("message");

            const subject = encodeURIComponent(
                "Обращение с сайта «Форма»: " + topic
            );

            const letterText = encodeURIComponent(
                "Имя: " + name +
                "\nПочта: " + email +
                "\nТема: " + topic +
                "\n\n" + message
            );

            const note = document.getElementById("form-note");

            if (note) {
                note.textContent =
                    "Открываем почтовую программу. Если она не запустилась, " +
                    "напишите на hello@forma-home.ru.";
            }

            window.location.href =
                "mailto:hello@forma-home.ru?subject=" +
                subject +
                "&body=" +
                letterText;
        });
    }
});
