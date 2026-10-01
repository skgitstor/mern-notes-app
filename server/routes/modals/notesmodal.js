import mongoose from 'mongoose'
const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' model se relation link karta hai
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    }
}, { timestamps: true }); // created_at aur updated_at apne aap add ho jayenge
const Note = mongoose.model('Note', noteSchema);
export default Note;