const express = require('express');

const {  getTickets, getTicket, createTicket, updateTicket, getAdminTickets} = require('../data/ticket');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();
router.get('/admin', getAdminTickets);
router.get('/', getTickets);
router.get('/:id',getTicket);
router.post('/', createTicket);
router.put('/:id', updateTicket);

//admin routes
//router.get('/admin/:id',getAdminTicket);
//router.put('/admin/:id', updateAdminTicket);
module.exports = router;
