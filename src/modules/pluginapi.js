/* BetterDiscordApp API for Plugins
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 11/12/2015
 * Last Update: 11/12/2015
 * https://github.com/Jiiks/BetterDiscordApp
 * 
 * Plugin Template: https://gist.github.com/Jiiks/71edd5af0beafcd08956
 */

var BdApi = {
    get React() { return BDV2.react; },
    get ReactDOM() { return BDV2.reactDom; },
    get WindowConfigFile() {
        if (this._windowConfigFile) return this._windowConfigFile;
        const base = require("electron").remote.app.getAppPath();
        const path = require("path");
        const location = path.resolve(base, "..", "app", "config.json");
        const fs = require("fs");
        if (!fs.existsSync(path.resolve(base, "..", "app"))) return this._windowConfigFile = null;
        if (!fs.existsSync(location)) fs.writeFileSync(location, JSON.stringify({}));
        return this._windowConfigFile = location;
    }
};

BdApi.getAllWindowPreferences = function() {
    if ((bdConfig.os !== "win32" && bdConfig.os !== "darwin") || !this.WindowConfigFile) return {}; // Tempfix until new injection on other platforms
    return require(this.WindowConfigFile);
};

BdApi.getWindowPreference = function(key) {
    if ((bdConfig.os !== "win32" && bdConfig.os !== "darwin") || !this.WindowConfigFile) return undefined; // Tempfix until new injection on other platforms
    return this.getAllWindowPreferences()[key];
};

BdApi.setWindowPreference = function(key, value) {
    if ((bdConfig.os !== "win32" && bdConfig.os !== "darwin") || !this.WindowConfigFile) return; // Tempfix until new injection on other platforms
    const fs = require("fs");
    const prefs = this.getAllWindowPreferences();
    prefs[key] = value;
    delete require.cache[this.WindowConfigFile];
    fs.writeFileSync(this.WindowConfigFile, JSON.stringify(prefs, null, 4));
};

//Inject CSS to document head
//id = id of element
//css = custom css
BdApi.injectCSS = function (id, css) {
    $("head").append($("<style>", {id: Utils.escapeID(id), html: css}));
};

//Clear css/remove any element
//id = id of element
BdApi.clearCSS = function (id) {
    $("#" + Utils.escapeID(id)).remove();
};

//Inject CSS to document head
//id = id of element
//css = custom css
BdApi.linkJS = function (id, url) {
    $("head").append($("<script>", {id: Utils.escapeID(id), src: url, type: "text/javascript"}));
};

//Clear css/remove any element
//id = id of element
BdApi.unlinkJS = function (id) {
    $("#" + Utils.escapeID(id)).remove();
};

//Get another plugin
//name = name of plugin
BdApi.getPlugin = function (name) {
    if (bdplugins.hasOwnProperty(name)) {
        return bdplugins[name].plugin;
    }
    return null;
};

var betterDiscordIPC = require("electron").ipcRenderer;
//Get ipc for reason
BdApi.getIpc = function () {
    Utils.warn("Deprecation Notice", "BetterDiscord's IPC has been deprecated and may be removed in future versions.");
    return betterDiscordIPC;
};

//Get BetterDiscord Core
BdApi.getCore = function () {
    return mainCore;
};

//Show modal alert
BdApi.alert = function (title, content) {
    // const ModalStack = EDApi.findModuleByProps("push", "update", "pop", "popWithKey");
    //     const AlertModal = EDApi.findModule(m => m.prototype && m.prototype.handleCancel && m.prototype.handleSubmit && m.prototype.handleMinorConfirm);
    //     if (!ModalStack || !AlertModal) return window.alert(body);
    //     ModalStack.push(function(props) {
    //         return EDApi.React.createElement(AlertModal, Object.assign({title, body}, props));
    //     });
    mainCore.alert(title, content);
};

//Show toast alert
BdApi.showToast = function(content, options = {}) {
    mainCore.showToast(content, options);
};

// Finds module
BdApi.findModule = function(filter) {
    return BDV2.WebpackModules.find(filter);
};

// Finds module
BdApi.findAllModules = function(filter) {
    return BDV2.WebpackModules.findAll(filter);
};

// Finds module
BdApi.findModuleByProps = function(...props) {
    return BDV2.WebpackModules.findByUniqueProperties(props);
};

// Gets react instance
BdApi.getInternalInstance = function(node) {
    if (!(node instanceof window.jQuery) && !(node instanceof Element)) return undefined;
    if (node instanceof jQuery) node = node[0];
    return BDV2.getInternalInstance(node);
};

// Gets data
BdApi.loadData = function(pluginName, key) {
    return DataStore.getPluginData(pluginName, key);
};

BdApi.getData = BdApi.loadData;

// Sets data
BdApi.saveData = function(pluginName, key, data) {
    return DataStore.setPluginData(pluginName, key, data);
};

BdApi.setData = BdApi.saveData;

// Deletes data
BdApi.deleteData = function(pluginName, key) {
    return DataStore.deletePluginData(pluginName, key);
};

// Patches other functions
BdApi.monkeyPatch = function(what, methodName, options) {
    return Utils.monkeyPatch(what, methodName, options);
};

// Event when element is removed
BdApi.onRemoved = function(node, callback) {
    return Utils.onRemoved(node, callback);
};

// Wraps function in try..catch
BdApi.suppressErrors = function(method, message) {
    return Utils.suppressErrors(method, message);
};

// Tests for valid JSON
BdApi.testJSON = function(data) {
    return Utils.testJSON(data);
};

BdApi.isPluginEnabled = function(name) {
    return !!pluginCookie[name];
};

BdApi.isThemeEnabled = function(name) {
    return !!themeCookie[name];
};

BdApi.isSettingEnabled = function(id) {
    return !!settingsCookie[id];
};

// Gets data
BdApi.getBDData = function(key) {
    return DataStore.getBDData(key);
};

// Sets data
BdApi.setBDData = function(key, data) {
    return DataStore.setBDData(key, data);
};

export default BdApi;