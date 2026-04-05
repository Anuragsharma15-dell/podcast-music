import mongoose, { Schema, Document } from 'mongoose';

export interface IMusic extends Document {
  title: string;
  inputText: string;
  inputUrl?: string;
  tone: string;
  voice: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  wubbleProjectId?: string;
  wubbleRequestId?: string;
  audioUrl?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  wubbleFinalRequestId: string
}

const MusicSchema = new Schema<IMusic>(
  {
    title: { type: String, required: true },
    inputText: { type: String, required: true },
    inputUrl: { type: String },
    tone: { type: String, default: 'neutral' },
    voice: { type: String, default: 'narrator' },
    status: {
      type: String,
      enum: ['pending', 'generating', 'completed', 'failed'],
      default: 'pending',
    },
    wubbleProjectId: { type: String },
    wubbleRequestId: { type: String },
    audioUrl: { type: String },
    duration: { type: Number },
    wubbleFinalRequestId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMusic>('Music', MusicSchema);
