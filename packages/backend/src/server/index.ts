import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { renderTrpcPanel } from "trpc-ui";
import { AppRouter, createContext, initAppRouter } from "./routers";
import config from "config";

const port = Number(config.get("http.port")) ?? 9000;

function initResumeHttpServer() {
  const app = express();
  const appRouter: AppRouter = initAppRouter();

  const httpHandler = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  });
  app.use("/trpc", httpHandler);
  app.use("/panel", (_req, res) => {
    res.send(
      renderTrpcPanel(appRouter, {
        url: "http://localhost:9000/trpc",
        meta: {
          title: "Resume",
          description:
            "This is the trpc panel for the resume backend application. Feel free to explore the available procedures.",
        },
      })
    );
  });
  return app;
}

const app = initResumeHttpServer();
app.listen(port, () => {
  console.log(`Server listening on Port ${port}`);
});
