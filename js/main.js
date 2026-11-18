document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!menuIsOpen));
            menuButton.setAttribute("aria-label", menuIsOpen ? "Открыть меню" : "Закрыть меню");
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

    const printButton = document.getElementById("print-version-button");
    if (printButton) {
        printButton.addEventListener("click", function () {
            const enabled = document.body.classList.toggle("print-version");
            printButton.setAttribute("aria-pressed", String(enabled));
            printButton.textContent = enabled ? "Обычная версия" : "Версия для печати";
        });
    }

    const visionButton = document.getElementById("vision-version-button");
    if (visionButton) {
        visionButton.addEventListener("click", function () {
            const enabled = document.body.classList.toggle("vision-mode");
            visionButton.setAttribute("aria-pressed", String(enabled));
            visionButton.textContent = enabled ? "Обычная версия" : "Версия для слабовидящих";
        });
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
            const subject = encodeURIComponent("Обращение с сайта «Форма»: " + topic);
            const letterText = encodeURIComponent(
                "Имя: " + name + "\nПочта: " + email + "\nТема: " + topic + "\n\n" + message
            );
            const note = document.getElementById("form-note");
            if (note) {
                note.textContent = "Открываем почтовую программу. Если она не запустилась, напишите на hello@forma-home.ru.";
            }
            window.location.href = "mailto:hello@forma-home.ru?subject=" + subject + "&body=" + letterText;
        });
    }

    const filterResults = document.getElementById("filter-results");
    if (filterResults) {
        const products = [
            {name:"Кресло «Линия»",category:"furniture",categoryName:"Мебель",description:"Тканевая обивка, деревянные ножки.",price:28900,materials:["fabric","wood"],rooms:["living"],anchor:"furniture"},
            {name:"Столик «Точка»",category:"furniture",categoryName:"Мебель",description:"Журнальный столик, натуральный шпон.",price:14500,materials:["wood"],rooms:["living"],anchor:"furniture"},
            {name:"Стеллаж «Ритм»",category:"furniture",categoryName:"Мебель",description:"Открытая система хранения.",price:22000,materials:["wood","metal"],rooms:["living","bedroom"],anchor:"furniture"},
            {name:"Комплект «Облако»",category:"bedding",categoryName:"Постельный текстиль",description:"Хлопок, двуспальный комплект.",price:8900,materials:["cotton"],rooms:["bedroom"],anchor:"bedding"},
            {name:"Покрывало «Тихо»",category:"bedding",categoryName:"Постельный текстиль",description:"Хлопок, размер 220 × 240 см.",price:6400,materials:["cotton"],rooms:["bedroom"],anchor:"bedding"},
            {name:"Набор наволочек",category:"bedding",categoryName:"Постельный текстиль",description:"Две наволочки из хлопка.",price:1800,materials:["cotton"],rooms:["bedroom"],anchor:"bedding"},
            {name:"Тумба «Баланс»",category:"bathroom",categoryName:"Ванная комната",description:"Влагостойкое покрытие, ширина 80 см.",price:31500,materials:["other"],rooms:["bathroom"],anchor:"bathroom"},
            {name:"Полка «Лаконика»",category:"bathroom",categoryName:"Ванная комната",description:"Настенная полка из металла.",price:3200,materials:["metal"],rooms:["bathroom"],anchor:"bathroom"},
            {name:"Набор аксессуаров",category:"bathroom",categoryName:"Ванная комната",description:"Дозатор и стакан.",price:2700,materials:["other"],rooms:["bathroom"],anchor:"bathroom"},
            {name:"Ваза «Контур»",category:"accessories",categoryName:"Аксессуары",description:"Керамика, ручная отделка.",price:2900,materials:["ceramic"],rooms:["any"],anchor:"accessories"},
            {name:"Аромадиффузор",category:"accessories",categoryName:"Аксессуары",description:"Объём 100 мл.",price:1600,materials:["other"],rooms:["any"],anchor:"accessories"},
            {name:"Поднос «Форма»",category:"accessories",categoryName:"Аксессуары",description:"Дерево, длина 30 см.",price:2200,materials:["wood"],rooms:["any"],anchor:"accessories"}
        ];

        const controls = {
            category: document.getElementById("filter-category"),
            material: document.getElementById("filter-material"),
            room: document.getElementById("filter-room"),
            price: document.getElementById("filter-price")
        };
        const count = document.getElementById("filter-result-count");
        const resetButton = document.getElementById("filter-reset");

        function matches(product, filters, ignoredFilter) {
            if (ignoredFilter !== "category" && filters.category && product.category !== filters.category) return false;
            if (ignoredFilter !== "material" && filters.material && !product.materials.includes(filters.material)) return false;
            if (ignoredFilter !== "room" && filters.room && !product.rooms.includes(filters.room)) return false;
            if (ignoredFilter !== "price" && filters.price && product.price > Number(filters.price)) return false;
            return true;
        }

        function getFilters() {
            return {
                category: controls.category.value,
                material: controls.material.value,
                room: controls.room.value,
                price: controls.price.value
            };
        }

        function updateFilterOptions(filters) {
            Object.keys(controls).forEach(function (filterName) {
                Array.from(controls[filterName].options).forEach(function (option) {
                    if (!option.value) {
                        option.disabled = false;
                        return;
                    }
                    const possible = products.some(function (product) {
                        const candidateFilters = Object.assign({}, filters);
                        candidateFilters[filterName] = option.value;
                        return matches(product, candidateFilters);
                    });
                    option.disabled = !possible && option.value !== filters[filterName];
                });
            });
        }

        function showProducts() {
            const filters = getFilters();
            const found = products.filter(function (product) {
                return matches(product, filters);
            });

            updateFilterOptions(filters);
            count.textContent = "Найдено товаров: " + found.length;

            if (found.length === 0) {
                filterResults.innerHTML = '<p class="filter-empty">По выбранным параметрам ничего не найдено. Измените условия поиска.</p>';
                return;
            }

            filterResults.innerHTML = found.map(function (product) {
                return '<article class="filter-product">' +
                    '<p class="section-kicker">' + product.categoryName + '</p>' +
                    '<h3>' + product.name + '</h3>' +
                    '<p>' + product.description + '</p>' +
                    '<p class="filter-product-price">' + product.price.toLocaleString("ru-RU") + ' ₽</p>' +
                    '<a href="#' + product.anchor + '">О разделе каталога</a>' +
                    '</article>';
            }).join("");
        }

        Object.keys(controls).forEach(function (filterName) {
            controls[filterName].addEventListener("change", showProducts);
        });

        resetButton.addEventListener("click", function () {
            Object.keys(controls).forEach(function (filterName) {
                controls[filterName].value = "";
            });
            showProducts();
        });

        showProducts();
    }
});
