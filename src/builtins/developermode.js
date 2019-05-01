import BuiltinModule from "../structs/builtin";

export default class DeveloperMode extends BuiltinModule {
    get ids() {return ["bda-gs-8", "fork-dm-1"];}
    get name() {return "DeveloperMode";}
    
    enabled() {
        var self = this;
        this.disable();
        $(window).on("keydown.bdDevmode", function(e) {
            if (e.which === 119 || e.which == 118) {//F8
               console.log("%c[%cDevMode%c] %cBreak/Resume", "color: red;", "color: #303030; font-weight:700;", "color:red;", "");
               debugger; // eslint-disable-line no-debugger
            }
        });
        
       if (!selectorMode) return; // TODO: check for selector mode
        $(document).on("contextmenu.bdDevmode", function(e) {
            self.lastSelector = self.getSelector(e.toElement);
    
            function attach() {
               var cm = $(".contextMenu-HLZMGh");
               if (cm.length <= 0) {
                   cm = $("<div class=\"contextMenu-HLZMGh bd-context-menu\"></div>");
                   cm.addClass($(".app").hasClass("theme-dark") ? "theme-dark" : "theme-light");
                   cm.appendTo(".app");
                   cm.css("top", e.clientY);
                   cm.css("left", e.clientX);
                   $(document).on("click.bdDevModeCtx", () => {
                       cm.remove();
                       $(document).off(".bdDevModeCtx");
                   });
                   $(document).on("contextmenu.bdDevModeCtx", () => {
                       cm.remove();
                       $(document).off(".bdDevModeCtx");
                   });
                   $(document).on("keyup.bdDevModeCtx", (e) => {
                       if (e.keyCode === 27) {
                           cm.remove();
                           $(document).off(".bdDevModeCtx");
                       }
                   });
               }
               
               var cmo = $("<div/>", {
                   "class": "itemGroup-1tL0uz"
               });
               var cmi = $("<div/>", {
                   "class": "item-1Yvehc",
                   "click": function() {
                       BDV2.NativeModule.copy(self.lastSelector);
                       cm.hide();
                   }
               }).append($("<span/>", {text: "Copy Selector"}));
               cmo.append(cmi);
               cm.append(cmo);
               if (cm.hasClass("undefined")) cm.css("top",  "-=" + cmo.outerHeight());
            }
            
            setImmediate(attach);
            
            e.stopPropagation();
        });
    }

    disabled() {
        $(window).off("keydown.bdDevmode");
        $(document).off("contextmenu.bdDevmode");
        $(document).off("contextmenu.bdDevModeCtx");
    }

    getRules(element, css = element.ownerDocument.styleSheets) {
        //if (window.getMatchedCSSRules) return window.getMatchedCSSRules(element);
        return [].concat(...[...css].map(s => [...s.cssRules || []])).filter(r => r && r.selectorText && element.matches(r.selectorText) && r.style.length && r.selectorText.split(", ").length < 8);
    }

    getSelector(element) {
        if (element.id) return `#${element.id}`;
        const rules = this.getRules(element);
        const latestRule = rules[rules.length - 1];
        if (latestRule) return latestRule.selectorText;
        else if (element.classList.length) return `.${Array.from(element.classList).join(".")}`;
        return `.${Array.from(element.parentElement.classList).join(".")}`;
    }
}