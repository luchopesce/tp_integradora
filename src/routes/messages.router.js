import { Router } from "express";
import {MessageManager} from "../dao/index.js";

const router = Router();
const messageManager = new MessageManager();



export default router
