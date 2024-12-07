import usersRoutes from "./users.js";
import chatsRoutes from "./chats.js";

const constructorMethod = (app) => {
  app.use("/user", usersRoutes);
  app.use("/chat", chatsRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not Found" });
  });
};

export default constructorMethod;
