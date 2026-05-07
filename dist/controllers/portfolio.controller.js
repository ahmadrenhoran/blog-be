"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicatePortfolio = exports.deletePortfolio = exports.updatePortfolio = exports.createPortfolio = exports.getPortfolioById = exports.getPortfolios = void 0;
const portfolioService = __importStar(require("../services/portfolio.service"));
const response_1 = require("../utils/response");
const getPortfolios = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const filters = req.query;
        const data = await portfolioService.getPortfolios(userId, filters);
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getPortfolios = getPortfolios;
const getPortfolioById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const data = await portfolioService.getPortfolioById(parseInt(id), userId);
        if (!data) {
            return response_1.ApiResponse.error(res, null, "Portfolio not found", 404);
        }
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getPortfolioById = getPortfolioById;
const createPortfolio = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await portfolioService.createPortfolio(userId, req.body);
        response_1.ApiResponse.success(res, data, "Portfolio created successfully", 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createPortfolio = createPortfolio;
const updatePortfolio = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const data = await portfolioService.updatePortfolio(parseInt(id), userId, req.body);
        response_1.ApiResponse.success(res, data, "Portfolio updated successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.updatePortfolio = updatePortfolio;
const deletePortfolio = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        await portfolioService.deletePortfolio(parseInt(id), userId);
        response_1.ApiResponse.success(res, null, "Portfolio deleted successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.deletePortfolio = deletePortfolio;
const duplicatePortfolio = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const data = await portfolioService.duplicatePortfolio(parseInt(id), userId);
        response_1.ApiResponse.success(res, data, "Portfolio duplicated successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.duplicatePortfolio = duplicatePortfolio;
