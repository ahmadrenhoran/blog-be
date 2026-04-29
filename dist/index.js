"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const PORT = process.env.PORT ? Number(process.env.PORT) : 7860;
const HOST = '0.0.0.0';
const startServer = async () => {
    await (0, db_1.assertDbConnection)();
    app_1.default.listen(PORT, HOST, () => {
        console.log(`Server listening on http://${HOST}:${PORT}`);
        console.log('Database connected');
    });
};
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
