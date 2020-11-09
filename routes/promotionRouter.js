const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res, next) => {
    res.end('Will send all the promotion to you!');
  })
  .post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
  })
  .delete((req, res, next) => {
    res.end('Deleting all promotion');
  });

promotionRouter.route('/:promoId')
  .get((req, res, next) => {
    res.end('Will send the promotion!' + req.params.promoId + 'to you !');
  })
  .post((req, res, next) => {
    res.end('post operation is not supported on /promotion/' + req.params.promoId);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('we will update the promotion ' + req.params.promoId);
  })
  .delete((req, res, next) => {
    res.end('Deleting the promotion' + req.params.promoId);
  });

module.exports = promotionRouter;