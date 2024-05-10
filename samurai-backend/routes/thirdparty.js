const express = require("express");
const router = express.Router();
const Controller = require("../controllers/thirdpartyactivities");
const middleware = require("../middlewars/authentcation")

//get all third party companies
router.get('/allthirdparties', Controller.getAllThirdPartyContractors);
//post [create new third party] 
router.post('/thirdparty', Controller.addThirdPartyContractor);

//post [create new manager user]
router.post('/addnewmanager', Controller.Registration);
//get all third party company name and id
router.get('/allcompany', Controller.getAllThirdPartyCompanyNames);






module.exports = router;