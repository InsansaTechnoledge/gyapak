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
import { authorizeRoles } from "../middleware/auth.middleware.js";

const route = (app) => {
  app.use(
    "/api/v1/organizations",
    authorizeRoles("admin", "data entry"),
    organizationRoutes
  );
  app.use("/api/v1/states", authorizeRoles("admin", "data entry"), stateRoutes);
  app.use(
    "/api/v1/upload",
    authorizeRoles("admin", "data entry"),
    uploadRoutes
  );
  app.use("/api/v1i2/blog", authorizeRoles("admin", "data entry"), BlogRoutes);
  app.use(
    "/api/v1i2/event",
    authorizeRoles("admin", "data entry"),
    eventRoutes
  );
  app.use(
    "/api/v1i2/affair",
    authorizeRoles("admin", "data entry"),
    affairRoutes
  );
  app.use("/api/v1i2/faq", authorizeRoles("admin", "data entry"), FAQRoutes);
  app.use(
    "/api/v1i2/question",
    authorizeRoles("admin", "data entry"),
    questionRoutes
  ); //not being used in frontend
  app.use(
    "/api/v1i2/reports",
    authorizeRoles("admin", "data entry"),
    reportRoutes
  );
  app.use("/api/v1/convert", authorizeRoles("admin", "data entry"), airoutes);
  app.use("/api/sources", authorizeRoles("admin", "data entry"), sourceRoutes);
  app.use(
    "/api/notifications",
    authorizeRoles("admin", "data entry"),
    notificationRoutes
  );
  app.use("/api/gsc", authorizeRoles("admin", "data entry"), gscRoutes);
  app.use("/api/index", authorizeRoles("admin"), indexingRoutes);

  app.use("/api/auth", authRoutes);
  app.use("/api/logs", userLogsRoutes);
};

export default route;
