import mongoose from 'mongoose';
import { validateUrl } from '../constants/validation';

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId,
  likes: [mongoose.Types.ObjectId],
  createdAt: Date,
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  link: {
    type: String,
    validate: {
      validator: (url: string) => validateUrl.test(url),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле "link" должно быть заполнено'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });
export default mongoose.model<ICard>('card', cardSchema);
