import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../utils/unauthorizedError';

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line max-len,no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [200, 'Минимальная длина поля "about" - 2'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (link: string) => validator.isURL(link, { protocols: ['http', 'https'] }),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user:IUser = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }
  const userValid = await bcrypt.compare(password, user.password);
  if (!userValid) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }
  return user;
});
export default mongoose.model<IUser, UserModel>('user', userSchema);
