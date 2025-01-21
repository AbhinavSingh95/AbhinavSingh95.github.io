const tabs = document.querySelector(".tabs");

tabs.addEventListener("click", (e) => handleClick(e));

function handleClick(e) {
    e.preventDefault();
    const target = e.target.closest("div");
    const tabNum = target.dataset.tab;
    const activeTab = document.querySelector(".tabs .active");
    const activeContent = document.querySelector(".content .visible");
    const currentContent = document.querySelector(
        `.content__section[data-tab='${tabNum}']`
    );

    if (!tabNum) {
        return;
    }

    activeTab.classList.remove("active");
    activeTab.classList.remove("selected");
    target.classList.add("active");
    target.classList.add("selected");
    activeContent.classList.remove("visible");
    currentContent.classList.add("visible");
}
