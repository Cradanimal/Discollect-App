const userControl = require('../user/userController');
const listingControl = require('../listing/listingController');
const discollectorRatingControl = require('../discollector_rating/discollectorRatingController');
const collectorRatingControl = require('../collector_rating/collectorRatingController');
const passport = require('passport');


module.exports = function(app, express) {
  const router = express.Router();

  router.get('/getUserInfo', userControl.getUserInfo);
  router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), userControl.login);
  router.post('/signup', userControl.signup);
  router.get('/logout', userControl.logout);
  router.put('/update', listingControl.update);
  router.put('/userProfile', userControl.userProfile);

  // router.get('/listing', listingControl.getListing);
  router.put('/getFilteredListings', listingControl.getFilteredListings);
  router.get('/getAllListings', listingControl.getAllListings);
  router.post('/createNewListing', listingControl.createNewListing);
  router.get('/getUsersListings', listingControl.getUsersListings);
  router.put('/closeListing', listingControl.closeListing);
  router.delete('/removeListing', listingControl.removeListing);
  router.get('/getUserHistory', listingControl.getUserHistory);


  return router;
};


// USE IF YOU WANT TO PROTECT A ROUTE
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();
//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }