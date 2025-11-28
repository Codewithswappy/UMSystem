import Fee from '../models/Fee.js';

// @desc    Get fees for logged in student
// @route   GET /api/fees/myfees
// @access  Private (Student)
export const getMyFees = async (req, res) => {
    try {
        const fees = await Fee.find({ student: req.user.studentId }).sort({ dueDate: 1 });
        res.status(200).json({
            success: true,
            data: fees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create a fee (Admin)
// @route   POST /api/fees
// @access  Private (Admin)
export const createFee = async (req, res) => {
    try {
        const { studentId, title, description, amount, dueDate, type } = req.body;

        const fee = await Fee.create({
            student: studentId,
            title,
            description,
            amount,
            dueDate,
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            data: fee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Pay a fee
// @route   PUT /api/fees/:id/pay
// @access  Private (Student)
export const payFee = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        // Verify ownership
        if (fee.student.toString() !== req.user.studentId.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to pay this fee'
            });
        }

        if (fee.status === 'Paid') {
            return res.status(400).json({
                success: false,
                message: 'Fee is already paid'
            });
        }

        fee.status = 'Paid';
        fee.paymentDate = Date.now();
        fee.paymentMethod = req.body.paymentMethod || 'Credit Card';
        fee.transactionId = `TXN-${Date.now()}`;

        await fee.save();

        res.status(200).json({
            success: true,
            data: fee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all fees (Admin)
// @route   GET /api/fees
// @access  Private (Admin)
export const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find({})
            .populate('student', 'name email studentId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: fees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
