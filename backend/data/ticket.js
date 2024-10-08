const Ticket = require("../models/Ticket");

const getAdminTickets = async (req, res, next) => {
    console.log('User type ',req.userData.userType);
    try {
        if (req.userData.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const tickets = await Ticket.find();
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ success: false, message: 'No tickets found' });
        }

        res.json({ success: true, tickets: tickets.map(ticket => ticket.toObject({ getters: true })) });
    } catch (err) {
        console.error('Error fetching tickets:', err);
        const error = new Error('Could not fetch tickets');
        return next(error);
    }
}


const getTickets=async(req,res,next)=>{
    let tickets;
    try{
         tickets=await Ticket.find({userId:req.userData.userId});
    }catch(err){
        const error= new Error("Could not fetch tickets");
         return next(error);
    }
     if (!tickets) {
        throw new NotFoundError('Could not find any data.');
     }
    res.json({ success:true, tickets: tickets.map(ticket => ticket.toObject({ getters: true })) });
}

const getTicket=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch Ticket");
        return next(error);
     }
    let ticket;
    try{
         ticket=await Ticket.findOne({_id:req.params.id});
    }catch(error){
         return next(error);
    }
     if (!ticket) {
        throw new NotFoundError('Could not fetch Ticket');
     }
    res.json({ success:true, ticket: ticket.toObject({ getters: true }) });
}

const updateTicket=async(req,res,next)=>{
console.log("from update ticket");
const ticketId=req.params.id;
//const created_by=req.userData.userId;
const {message}=req.body;
console.log("message ",ticketId, message);
   try{
            const ticket = await Ticket.findByIdAndUpdate(
              ticketId,
              {
                $push: {
                  message: message // Push the new message object to the message array
                },
                $set: { updatedAt: Date.now() } // Update the updatedAt field with the current time
              },
              { new: true, useFindAndModify: false } // Return the updated document
            );
        console.log("new ticket ",ticket);
        res.status(201).json({success:true, message:'ticket updated', ticket:ticket});
    }
    catch(error){
        console.log(error.message);
        return next(error);
    }
}

const createTicket=async(req,res,next)=>{
    console.log("in add ticket");
        const {subject,message}=req.body;
        const userId=req.userData.userId;
        console.log(subject, message);

            try{
                const newTicket=new Ticket({
                    userId:userId,
                    subject:subject,
                    message:[message],
                    status:'Open',
                    createdAt:Date.now(),
                    updatedAt:Date.now()
                 });
                await newTicket.save();
                console.log("Ticket created");
                res.json({success:true, ticket:newTicket});
            }
            catch(error){
                console.log("error creating ticket:", error);
                res.json({success:false, ticket:null});
            }
    }


exports.getTickets=getTickets;
exports.getTicket=getTicket;
exports.createTicket=createTicket;
exports.updateTicket=updateTicket;
exports.getAdminTickets=getAdminTickets;
