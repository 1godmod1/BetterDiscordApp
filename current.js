var minSupportedVersion = "0.3.0";
var bbdVersion = "0.2.4";


/*V2 Premature*/

class V2 {

    constructor() {
        this.editorDetached = false;
        this.WebpackModules = (() => {
            const req = webpackJsonp.push([[], {__extra_id__: (module, exports, req) => module.exports = req}, [["__extra_id__"]]]);
            delete req.m.__extra_id__;
            delete req.c.__extra_id__;
            const find = (filter) => {
                for (let i in req.c) {
                    if (req.c.hasOwnProperty(i)) {
                        let m = req.c[i].exports;
                        if (m && m.__esModule && m.default && filter(m.default)) return m.default;
                        if (m && filter(m))	return m;
                    }
                }
                console.warn("Cannot find loaded module in cache");
                return null;
            };

            const findAll = (filter) => {
                const modules = [];
                for (let i in req.c) {
                    if (req.c.hasOwnProperty(i)) {
                        let m = req.c[i].exports;
                        if (m && m.__esModule && m.default && filter(m.default)) modules.push(m.default);
                        else if (m && filter(m)) modules.push(m);
                    }
                }
                return modules;
            };
            
            const findByUniqueProperties = (propNames) => find(module => propNames.every(prop => module[prop] !== undefined));
            const findByDisplayName = (displayName) => find(module => module.displayName === displayName);
                
            return {find, findAll, findByUniqueProperties, findByDisplayName};
        })();

        this.internal = {
            react: this.WebpackModules.findByUniqueProperties(["Component", "PureComponent", "Children", "createElement", "cloneElement"]),
            reactDom: this.WebpackModules.findByUniqueProperties(["findDOMNode"])
        };
        this.getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];
    }

    initialize() {
        this.patchSocial();
    }

    get react() {return this.internal.react;}
    get reactDom() {return this.internal.reactDom;}
    get reactComponent() {return this.internal.react.Component;}
    
    get messageClasses() {return this.WebpackModules.findByUniqueProperties(["message", "containerCozy"]);}
    get guildClasses() {return this.WebpackModules.findByUniqueProperties(["guildsWrapper"]);}
    get MessageContentComponent() {return this.WebpackModules.find(m => m.defaultProps && m.defaultProps.hasOwnProperty("disableButtons"));}
    get TimeFormatter() {return this.WebpackModules.findByUniqueProperties(["dateFormat"]);}
    get TooltipWrapper() {return this.WebpackModules.find(m => m.prototype && m.prototype.showDelayed);}
    get NativeModule() {return this.WebpackModules.findByUniqueProperties(["setBadge"]);}
    get Tooltips() {return this.WebpackModules.find(m => m.hide && m.show && !m.search && !m.submit && !m.search && !m.activateRagingDemon && !m.dismiss);}
    get KeyGenerator() {return this.WebpackModules.find(m => m.toString && /"binary"/.test(m.toString()));}

    parseSettings(cat) {
        return Object.keys(settings).reduce((arr, key) => { 
            let setting = settings[key];
            if (setting.cat === cat && setting.implemented && !setting.hidden) { 
                setting.text = key;
                arr.push(setting);
            } return arr; 
        }, []);
    }

    patchSocial() {
        if (this.socialPatch) return;
        const TabBar = BdApi.findModule(m => m.displayName == "TabBar");
        const Anchor = BdApi.findModule(m => m.displayName == "Anchor");
        if (!TabBar || !Anchor) return;
        this.socialPatch = BdApi.monkeyPatch(TabBar.prototype, "render", {after: (data) => {
            const children = data.returnValue.props.children;
            if (!children || !children.length) return;
            if (children[children.length - 1].type.displayName !== "SocialLinks") return;
            const original = children[children.length - 1].type;
            const newOne = function() {
                const returnVal = original(...arguments);
                returnVal.props.children.push(BdApi.React.createElement(Anchor, {className: "bd-social-link", href: "https://github.com/rauenzi/BetterDiscordApp", rel: "author", title: "BandagedBD", target: "_blank"},
                    BdApi.React.createElement(BDLogo, {size: "16px", className: "bd-social-logo"})
                ));
                return returnVal;
            };
            children[children.length - 1].type = newOne;
        }});
    }


}

var BDV2 = new V2();
