var key = "";
var defaultDictionary = {
    "GITHUB": {
        "en": "It's GITHUB",
        "zh": "它是 GITHUB",
    }
};
var localstorageKey = "DICT";
var dic = defaultDictionary;

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function show(container) {
    const landingContainer = $(".landing-container");
    const resultContainer = $(".result-container");
    const editorContainer = $(".editor-container");
    switch (container) {
        case "landing": {
            landingContainer.style.display = "flex";
            resultContainer.style.display = "none";
            editorContainer.style.display = "none";
            $("#input1").focus();
            break;
        }
        case "result": {
            landingContainer.style.display = "none";
            resultContainer.style.display = "flex";
            editorContainer.style.display = "none";
            $("#input2").focus();
            break;
        }
        case "editor": {
            landingContainer.style.display = "none";
            resultContainer.style.display = "none";
            editorContainer.style.display = "block";
            prefillEditor();
            break;
        }
        default: {
            return;
        }
    }
}

function search() {
    const keyword = key.toUpperCase();
    const results = Object.keys(dic).filter(dictKey => dictKey.toUpperCase() === keyword).map(dictKey => {
        return {
            key: dictKey,
            value: dic[dictKey]
        }
    });

    const resultEmptyTemplate = $("#resultempty");
    const resultItemTemplate = $("#resultitem");
    const resultContentContainer = $("#results");

    if (results.length === 0) {
        resultContentContainer.innerHTML = "";
        const emptyResult = resultEmptyTemplate.content.cloneNode(true);
        emptyResult.querySelector("h3").textContent = `Cannot find "${key}" in dictionary.`;
        resultContentContainer.appendChild(emptyResult);
    } else {
        resultContentContainer.innerHTML = "";
        results.forEach(result => {
            const resultItem = resultItemTemplate.content.cloneNode(true);
            resultItem.querySelector("h3").textContent = result.key;
            if (result.value.en) {
                resultItem.querySelector("p[en]").textContent = result.value.en;
            }
            if (result.value.zh) {
                resultItem.querySelector("p[zh]").textContent = result.value.zh;
            }
            resultContentContainer.appendChild(resultItem);
        });
    }
}

function update() {
    const editor = $("#editor");
    const value = editor.value;
    // todo

    showToaster("Dictionary updated successfully.");
}

function prefillEditor() {
    const rows = [];
    Object.keys(dic).forEach(dictKey => {
        const value = dic[dictKey];
        const row = `${dictKey}     ${value.en || ""}       ${value.zh || ""}`;
        rows.push(row);
    });
    $("#editor").value = rows.join("\n");
}

function buttonEventsBinding() {
    $("#edit").addEventListener("click", () => {
        show("editor");
    });
    $("#cancel").addEventListener("click", () => {
        show("result");
    });
    $("#save").addEventListener("click", () => {
        update();
        show("result");
    });
    $("#search1").addEventListener("click", () => {
        $("#input2").value = key;
        show("result");
        search();
    });
    $("#search2").addEventListener("click", () => {
        search();
    });
    $("#input1").addEventListener("change", (event) => {
        key = event.target.value;
        $("#input2").value = key;
        show("result");
        search();
    });
    $("#input2").addEventListener("change", (event) => {
        key = event.target.value;
        search();
    })
    $("#logo").addEventListener("click", () => {
        key = "";
        $("#input1").value = key;
        $("#input2").value = key;
        show("landing");
    })
}

function initDictionary() {
    const localDictionary = localStorage.getItem("DICT") || "";
    try {
        dic = JSON.parse(localDictionary);
    } catch (error) {
        dic = defaultDictionary;
    }
}

function showToaster(message) {
    const toasterContainer = $("#toastercontainer");
    const toasterTemplate = $("#toaster");
    const toaster = toasterTemplate.content.cloneNode(true);
    toaster.querySelector(".toaster").textContent = message;
    toasterContainer.style.height = "150px";
    toasterContainer.appendChild(toaster);

    setTimeout(() => {
        toasterContainer.innerHTML = "";
        toasterContainer.style.height = "0px";
    }, 1500);
}

function init() {
    show("result");
    buttonEventsBinding();
    initDictionary();
}

window.addEventListener("load", init);