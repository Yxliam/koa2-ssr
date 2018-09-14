class BaseController {
    static xss(val) {
        val = val.toString();
        val = val.replace(/[<%3C]/g, "&lt;");
        val = val.replace(/[>%3E]/g, "&gt;");
        val = val.replace(/"/g, "&quot;");
        val = val.replace(/'/g, "&#39;");
        return val;
    }
}

module.exports = BaseController;