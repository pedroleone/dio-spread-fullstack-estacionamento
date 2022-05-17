
addEventToHeader();

function addEventToHeader() {
    document.getElementsByTagName("header")[0].addEventListener("click", function (e) {
        let element = e.target as HTMLElement;
        if (element.classList.contains('btn-menu')) {
            toggleOpenClass(element);
            let childSectionName = element.getAttribute("data-child-section");
            controlSectionDisplay(childSectionName);
        }
    });
}

function toggleOpenClass (element: Element) {
    if (element.classList.contains('open')) {
        element.classList.remove('open');
    } else {
        element.classList.add('open');
    }
}

function controlSectionDisplay(childSectionName: string) {
    let element = document.getElementsByClassName(childSectionName)[0] as HTMLElement;
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}