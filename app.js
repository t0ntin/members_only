import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './db/pool.js';
import { Strategy as LocalStrategy } from 'passport-local';
import connectPgSimple from "connect-pg-simple";
import router from './routes/router.js';
import bcrypt from 'bcryptjs';

const PgSession = connectPgSimple(session);

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
// COMMENTED OUT THIS LINE AND REPLACED IT WITH THE ONE BELOW IT.
// app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

app.use(session({
  store: new PgSession({ pool: pool }),
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day in milliseconds
}));


app.use(passport.session());


passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" }, 
    async (email, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        const user = rows[0];
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const match = await bcrypt.compare(password, user.password_hash); 
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});



app.use('/', router);

// ADDED BY CHAT GPT TO CATCH ERROR
// app.use((req, res, next) => {
//   console.log("Login messages:", req.session.messages);
//   next();
// });


app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`server running on port ${PORT}`);
});
