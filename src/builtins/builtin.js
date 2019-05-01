import Utilities from "../modules/utilities";

export default class BuiltinModule {

    enable() {
        this.log("Enabled");
        this.enabled();
    }

    disable() {
        this.log("Disabled");
        this.disabled();
    }

    enabled() {}
    disabled() {}

    log(message) {
        Utilities.log(this.name, message);
    }

    warn(message) {
        Utilities.warn(this.name, message);
    }

    error(message) {
        Utilities.err(this.name, message);
    }
}