import mongoose from 'mongoose';

const BookEntrySchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    title: { type: String, required: true },
    authors: [{ type: String }],
    thumbnail: String,
    rating: Number,
    description: String,
    previewLink: String,
    // Deprecated in favor of status; kept for backward compatibility
    isRead: { type: Boolean, default: false },
    status: { type: String, enum: ['read', 'toBeRead'], default: 'toBeRead' }
  },
  { _id: false }
);

const FriendRequestSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profilePic: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [FriendRequestSchema],
    library: [BookEntrySchema]
  },
  { timestamps: true }
);

// Indexes are provided via unique constraints above; avoid duplicate index definitions

export const User = mongoose.model('User', UserSchema);
export const BookEntry = BookEntrySchema;

