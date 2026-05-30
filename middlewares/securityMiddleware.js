import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);