import {addNewUserToDB, getAllDataFromDB, updateMembershipStatus} from '../db/queries.js';


async function getSignInView (req, res) {
  const messages = await getAllDataFromDB();
  console.log('All info is: ', messages);
  console.log('req.user is: ', req.user);
  res.render("index", { title: "Sign in", user: req.user, messages });
  
}


async function getSignUpView(req, res) {
  res.render('sign-up-page', {title: 'Sign up'});
}

async function signUpPost(req, res, next) {
  try {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const {firstName, lastName, email} = req.body;
    await addNewUserToDB(firstName, lastName,email, hashedPassword);
    res.redirect('/');

  } catch (error) {
    console.error(error);
    next(error);
  }
}

function getUpgradeView(req, res) {
  res.render('upgrade', {title: "Upgrade"})
}

async function postUpgradeView(req, res) {
  const answer = Number(req.body.upgradeAnswer);
  console.log(answer);
  // const status = req.user.membership_status;
  const id = req.user.id;
  if (answer === 21) {

    await updateMembershipStatus(id);
    
  }
  res.redirect('/');
  
}

export {
  getSignInView,
  getSignUpView,
  signUpPost,
  getUpgradeView,
  postUpgradeView,



}