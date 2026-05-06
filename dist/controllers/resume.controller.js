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
exports.setPrimaryResume = exports.deleteResume = exports.uploadResume = exports.getResumes = void 0;
const resumeService = __importStar(require("../services/resume.service"));
const response_1 = require("../utils/response");
const getResumes = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await resumeService.getResumes(userId);
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getResumes = getResumes;
const uploadResume = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await resumeService.uploadResume(userId, req.body);
        response_1.ApiResponse.success(res, data, "Resume uploaded successfully", 201);
    }
    catch (error) {
        next(error);
    }
};
exports.uploadResume = uploadResume;
const deleteResume = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        await resumeService.deleteResume(parseInt(id), userId);
        response_1.ApiResponse.success(res, null, "Resume deleted successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.deleteResume = deleteResume;
const setPrimaryResume = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const data = await resumeService.setPrimaryResume(parseInt(id), userId);
        response_1.ApiResponse.success(res, data, "Primary resume set successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.setPrimaryResume = setPrimaryResume;
