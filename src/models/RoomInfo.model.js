import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const RoomInfoSchema = new Schema(
    {
        room: { type: String, require: true, unique: true },
        isLive: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        userCount: { type: Number, default: 300 },
        teacherName: {
            type: String,
            required: [true, 'Teacher Name is required'],
        },
        heading: { type: String, required: [true, 'Heading  is required'] },
        videoUrl: { type: String, required: [true, 'Video URL is required'] },
        logoUrl: {
            type: String,
            default:
                'https://media.bitclass.live/image/upload/v1643685201/Logos/LogoSmallForDarkBG_ij9awp.svg',
        },
        isHartVisibile: { type: Boolean, default: true },
        isShareVisibile: { type: Boolean, default: true },
        isSoundingVisibile: { type: Boolean, default: true },
        shareLinks: {
            type: [String],
            default: ['https://media.bitclass.live'],
        },
    },
    { timestamps: true }
);

const Room = model('Room', RoomInfoSchema);

export default Room;
