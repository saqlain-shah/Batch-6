import Booking from "../Models/booking.model.js";
import Room from "../Models/room.model.js";

// Create a new booking bookings
export const createBooking = async (req, res, next) => {
    try {
        const { hotelId, roomId } = req.params;
        const { name, contact, fromDate, toDate } = req.body;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                status: false,
                message: `Room with ID ${roomId} not found`,
            });
        }

        const existingBookings = await Booking.find({
            hotelId,
            roomId,
            $or: [
                {
                    fromDate: { $gte: fromDate, $lt: toDate },
                    toDate: { $gt: fromDate, $lte: toDate },
                },
                {
                    fromDate: { $lte: fromDate },
                    toDate: { $gte: toDate },
                },
            ],
        });


        if (existingBookings.length > 0) {
            return res.status(200).json({
                status: false,
                message: `Room is not available for the selected dates`,
            });
        }

        const newBooking = new Booking({
            hotelId,
            roomId,
            name,
            contact,
            fromDate,
            toDate,
        });
        const newUnavailableDates = [...room.unavailableDates, { fromDate: fromDate, toDate: toDate }]
        await Room.findByIdAndUpdate(
            roomId,
            { $set: { unavailableDates: newUnavailableDates } },
            { new: true }
        );
        await newBooking.save();

        res.status(201).json({
            status: true,
            message: `Booking created successfully`,
            data: newBooking,
        });
    } catch (err) {
        next(err);
    }
};

// Get a list of all bookings
export const bookingList = async (req, res, next) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

// Check out a customer by deleting their booking
export const checkOut = async (req, res, next) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id);
        try {
            if (booking) {
                const { roomId, fromDate, toDate } = booking
                
                await Room.findByIdAndUpdate(
                    roomId,
                    { '$pull': { unavailableDates: { fromDate: fromDate, toDate: toDate } } }
                 
                );

            }
            else {
                return res.status(404).json({
                    status: false,
                    message: `Booking with ID ${id} not found`,
                });
            }
        } catch (err) {
            return res.status(500).send(err.message)
        }
        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: `Customer has been checked out`,
        });
    } catch (err) {
        next(err);
    }
};