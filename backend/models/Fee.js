import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true
});

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;
