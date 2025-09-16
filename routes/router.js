import express from 'express';
import { getSignInView, getSignUpView, signUpPost, getUpgradeView, postUpgradeView, getPostMessageView,postPostmessageView} from '../controllers/controller.js';
const router = express.Router();

router.get('/', getSignInView);

router.get('/sign-up-page', getSignUpView);
router.post('/sign-up', signUpPost);

router.get('/upgrade', getUpgradeView);
router.post('/upgrade', postUpgradeView);

router.get('/post-message', getPostMessageView);
router.post('/post-message', postPostmessageView);


export default router;