import { Router, type IRouter } from "express";
import healthRouter from "./health";
import filesRouter from "./files";
import activityRouter from "./activity";
import foldersRouter from "./folders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(filesRouter);
router.use(activityRouter);
router.use(foldersRouter);

export default router;
