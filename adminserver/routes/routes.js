import organizationRoutes from "./organizationRoutes.js";
import stateRoutes from "./state.routes.js";
import uploadRoutes from "./upload.routes.js";
import BlogRoutes from "./blog.routes.js";
import eventRoutes from "./event.routes.js";
import affairRoutes from "./currentAffair.routes.js";
import FAQRoutes from "./faq.routes.js";
import questionRoutes from "./question.routes.js";
import reportRoutes from "./report.routes.js";
import sourceRoutes from "./source.routes.js";
import notificationRoutes from "./notification.routes.js";
import gscRoutes from "./gscRoutes.js";
import indexingRoutes from "./indexing.routes.js";
import airoutes from "./openai.routes.js";
import authRoutes from "./auth.routes.js";
import userLogsRoutes from "./userLogs.routes.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";
import quickResultRoute from "./Quiclresult.routes.js";
const route = (app) => {
  app.use(
    "/api/v1/organizations",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    organizationRoutes
  );
  app.use(
    "/api/v1/states",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    stateRoutes
  );
  app.use(
    "/api/v1/upload",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    uploadRoutes
  );
  app.use("/api/v1i2/blog", BlogRoutes);
  app.use(
    "/api/v1i2/event",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    eventRoutes
  );
  app.use(
    "/api/v1i2/affair",

    affairRoutes
  );
  app.use(
    "/api/v1i2/faq",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    FAQRoutes
  );
  app.use(
    "/api/v1i2/question",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    questionRoutes
  ); //not being used in frontend
  app.use(
    "/api/v1i2/reports",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    reportRoutes
  );
  app.use(
    "/api/v1/convert",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    airoutes
  );
  app.use(
    "/api/sources",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    sourceRoutes
  );
  app.use(
    "/api/notifications",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    notificationRoutes
  );
  app.use(
    "/api/gsc",
    verifyToken,
    authorizeRoles("admin", "data entry"),
    gscRoutes
  );
  app.use("/api/index", verifyToken, authorizeRoles("admin"), indexingRoutes);

  app.use("/api/auth", authRoutes);
  app.use("/api/logs", userLogsRoutes);
  app.use("/api/result-admitcard", quickResultRoute);
};

export default route;
