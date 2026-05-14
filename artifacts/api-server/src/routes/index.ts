import { Router, type IRouter } from "express";
import healthRouter from "./health";
import filesRouter from "./files";
import activityRouter from "./activity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(filesRouter);
router.use(activityRouter);

export default router;
