import {addNewUserToDB} from '../db/queries.js';
import bcrypt from 'bcryptjs';

async function getSignInView (req, res) {

    res.render("index", { title: "Sign in", user: req.user });
  
}

async function getSignUpView(req, res) {
  res.render('sign-up-page', {title: 'Sign up'});
}

async function signUpPost(req, res, next) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const {firstName, lastName, email} = req.body;
  await addNewUserToDB(firstName, lastName,email, hashedPassword);
  // res.redirect('/');
}

// app.post("/sign-up", async (req, res, next) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [req.body.username, hashedPassword]);
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

export {
  getSignInView,
  getSignUpView,
  signUpPost,


}