"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "http://localhost:3001"],
            "connect-src": ["'self'", "http://localhost:3001"]
        }
    }
}));
// servir favicon
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// endpoint de traducción
app.post("/api/translate", (req, res) => {
    const { text, from, to } = req.body;
    res.json({ translated: `[${from}->${to}] ${text}` });
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
