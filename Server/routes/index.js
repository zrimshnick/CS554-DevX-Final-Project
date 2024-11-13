import usersRoutes from "./users.js";

const constructorMethod = (app) => {
  app.use("/user", usersRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not Found" });
  });
};

export default constructorMethod;
