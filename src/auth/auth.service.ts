import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AuthToken,
  InputForgotPass,
  InputSignIn,
  InputSignUp,
} from './auth.interface';
import { User } from 'src/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async session(userId: string) {
    return this.UserModel.findOne({
      _id: userId,
      status: 'active',
    });
  }

  async signin(input: InputSignIn): Promise<AuthToken> {
    console.log(input);

    const user = await this.UserModel.findOne({
      email: input.email,
      status: 'active',
    });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    const token = this.jwt.sign({ id: user.id });
    return { accesToken: token };
  }

  async signup(input: InputSignUp): Promise<AuthToken> {
    let user = await this.UserModel.findOne({
      email: input.email,
    });

    if (user) {
      throw new BadRequestException('email taken');
    }

    user = new this.UserModel();
    user.name = input.name;
    user.surname = input.surname;
    user.email = input.email;
    user.password = hashSync(input.password, 10);
    user.status = 'active';

    await user.save();

    const token = this.jwt.sign({ id: user.id });

    return {
      accesToken: token,
    };
  }

  async forgotPassword(input: InputForgotPass): Promise<void> {
    let user = await this.UserModel.findOne({
      email: input.email,
    });

    if (!user) {
      throw new BadRequestException('wrong email');
    }

    user.password = hashSync(input.newPassword, 10);

    await user.save();

    console.log('updated password user' + user);
  }

  async deactivateUser(userId: string): Promise<void> {
    const userToUpdate = await this.UserModel.findById(userId);
    console.log(userToUpdate);

    if (!userToUpdate) {
      throw new BadRequestException('User not found');
    }

    userToUpdate.status = 'deactivated';

    await userToUpdate.save();
    console.log(userToUpdate);
  }
}
