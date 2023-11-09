import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthToken, InputSignIn, InputSignUp } from './auth.interface';
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
    });
  }

  async signin(input: InputSignIn): Promise<AuthToken> {
    console.log(input);

    const user = await this.UserModel.findOne({
      email: input.email,
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

    await user.save();

    const token = this.jwt.sign({ id: user.id });

    return {
      accesToken: token,
    };
  }
}
