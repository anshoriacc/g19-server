const express = require('express');
const router = express.Router();

const { bannerController } = require('../controllers');

const { verifyJWT } = require('../middlewares');

router.get('/', verifyJWT, bannerController.getList);
router.post('/', verifyJWT, bannerController.create);
router.patch('/:id', verifyJWT, bannerController.update);
router.delete('/:id', verifyJWT, bannerController.remove);

module.exports = router;
