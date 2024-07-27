import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, ResponseDto } from 'src/common/dto';
import { User, UserDocument } from 'src/common/schemas';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  async getUserByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username: username }).lean();
    if (!user)
      throw new HttpException('username or password is wrong.', 404);

    return user;
  }

  async getUserById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).lean();
    if (!user)
      throw new HttpException('user id is wrong.', 404);

    return user;
  }

  async authorizeUser(username: string): Promise<ResponseDto> {
    const user = await this.userModel.findOne({ username: username });
    if (!user)
      throw new HttpException('username is wrong.', 404);

    user.isAdmin = true;
    await user.save();

    return { status: 200, message: 'Permission Granted.' };
  }

  async createUser(data: CreateUserDto): Promise<ResponseDto> {
    const existingUser = await this.userModel.findOne({
      username: data.username,
    });
    if (existingUser)
      throw new HttpException('User already Exists.', 404);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new this.userModel({
      username: data.username,
      password: hashedPassword,
      personalColor: data.personalColor,
      isAdmin: false
    });

    await user.save();

    return { status: 200, message: 'User saved.' };
  }
}
