"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 7860;
const HOST = '0.0.0.0';
app_1.default.listen(7860, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
    console.log("TOKEN:", process.env.HF_ACCESS_TOKEN);
    console.log("REPO:", process.env.HF_REVIEW);
});
