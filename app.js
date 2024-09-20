import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import passport from "passport";
import { authenticateUser } from "./controllers/userController.js";
import session from "express-session";
import incomeRoutes from "./routes/incomeRoutes.js";
import incomeTagsRoutes from "./routes/incomeTagsRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import expenseTagsRoutes from "./routes/expenseTagsRoutes.js";
import env from "dotenv";
env.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.set("views", "./views");

app.use(passport.initialize());
app.use(passport.session());

authenticateUser();

app.use("/", userRoutes);
app.use("/income", incomeRoutes);
app.use("/incometags", incomeTagsRoutes);
app.use("/expense", expenseRoutes);
app.use("/expensetags", expenseTagsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
