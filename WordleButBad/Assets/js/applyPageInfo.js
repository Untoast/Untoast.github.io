async function loadPageInfo() {
    const pageInfoJsonPath = "Resources/JSON/Settings.json";
    const JsonObjectNames = ["page_info", "custom_theming", "give_up_data"];

    // elements
    const versionText = document.getElementById("Version");
    const gibsonButton = document.getElementById("Gibson");

    var JsonData = new Array();
    await fetch(pageInfoJsonPath)
        .then(response => response.json())
        .then(data => {
            for (const field in JsonObjectNames) {
                JsonData.push(data[JsonObjectNames[field]]);
            }
        });
    console.log(JsonData);
    
    // version info
    const version = JsonData[0]["version"];
    const themeEnabled = JsonData[1]["enabled"];
    const customTheme = JsonData[1]["theme_name"];

    // gibson text
    const gibson_text = JsonData[0]["gibson_text"];
    
    // setting correct version info
    let themeText = "Version ".concat(version);
    if (themeEnabled) {
        themeText += " (".concat(customTheme).concat(")");
    }
    versionText.innerHTML = themeText;

    // setting gibson button text
    if (gibson_text) {
        gibsonButton.innerHTML = gibson_text;
    } else {
        gibsonButton.innerHTML = "Gibson";
    }
}



loadPageInfo();