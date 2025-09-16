import {addNewUserToDB, getAllDataFromDB, updateMembershipStatus, postMessageToDB, deleteMessageFromDB} from '../db/queries.js';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import passport from 'passport';

const validateUser = [
  body('email').trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long"),
]

 async function getSignInView (req, res) {
  const messages = await getAllDataFromDB();
  // console.log('All info is: ', messages);
  // console.log('req.user is: ', req.user);
  res.render("index", { title: "Sign in", user: req.user, messages });
 }
  
 const postSignInView = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("index", { 
        title: "Sign in", 
        user: null, 
        oldInput: req.body, 
        errors: errors.array(), 
        messages: [] 
      });
    }

    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).render("index", {
          title: "Sign in",
          user: null,
          oldInput: req.body,
          errors: [{ msg: info?.message || "Invalid credentials" }],
          messages: []
        });
      }

      req.logIn(user, async (err) => {
        if (err) return next(err);

        const messages = await getAllDataFromDB();
        res.render("index", { 
          title: "Sign in", 
          user: req.user, 
          oldInput: {}, 
          errors: [], 
          messages 
        });
      });
    })(req, res, next);
  }
];

async function deleteMessage(req, res) {
  await deleteMessageFromDB(req.body.id);
  res.redirect('/');
  
}

function getLogOut (req, res, next) {
      req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
}

async function getSignUpView(req, res) {
  res.render('sign-up-page', {title: 'Sign up'});
}

async function signUpPost(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const {firstName, lastName, email} = req.body;
    await addNewUserToDB(firstName, lastName, email, hashedPassword);
    res.redirect('/');

  } catch (error) {
    console.error(error);
    next(error);
  }
}

function getUpgradeView(req, res) {
  res.render('upgrade', {title: "Upgrade", answer: null})
}

async function postUpgradeView(req, res) {
  const answer = Number(req.body.upgradeAnswer);
  console.log(answer);
  // const status = req.user.membership_status;
  const id = req.user.id;
  if (answer === 21) {
    await updateMembershipStatus(id);
    res.redirect('/');
  } else {

    res.render('upgrade', {title: 'Upgrade', answer});
  }
  
}

function getPostMessageView(req, res) {
  res.render('post-message', {title: "Post your message"})
}

async function postPostmessageView(req, res) {
  console.log(req.body.messageTitle);
  await postMessageToDB(req.body.messageTitle, req.body.messageContent, req.user.id);
  res.redirect('/');
}

export {
  getSignInView,
  postSignInView,
  deleteMessage,
  getSignUpView,
  signUpPost,
  getUpgradeView,
  postUpgradeView,
  getPostMessageView,
  postPostmessageView,
  getLogOut,

}