import { Account } from '@application/entities/Account';
import { AccountRepository } from '@infra/database/drizzle/repositories/auth/AccountRepository';
import { Injectable } from '@kernel/decorators/Injectable';
import { AuthGateway } from 'src/infra/gateways/AuthGateway';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly authRepo: AccountRepository,

  ) { }

  async execute({
    name,
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const { externalId } = await this.authGateway.signUp({
      email,
      password,
    });

    const account = new Account({ email, name, externalId });
    await this.authRepo.create(account);

    const {
      accessToken,
      refreshToken,
    } = await this.authGateway.signIn({ email, password });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }

}
