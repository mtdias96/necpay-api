import { InvalidRefreshToken } from '@application/errors/application/InvalidRefreshToken';
import { AdminDeleteUserCommand, ConfirmForgotPasswordCommand, ForgotPasswordCommand, GetTokensFromRefreshTokenCommand, InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@infra/clients/cognitoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { createHmac } from 'node:crypto';

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) { }

  async signIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.appConfig.auth.cognito.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    const accessToken = AuthenticationResult?.AccessToken;
    const refreshToken = AuthenticationResult?.RefreshToken;

    if (!accessToken || !refreshToken) {
      throw new Error(`Cannot authenticate user ${email}`);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp({
    email,
    password,
    storeId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash(email),
      UserAttributes: [
        {
          Name: 'custom:storeId',
          Value: storeId,
        },
      ],
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot signup user: ${email}`);
    }

    return {
      externalId,
    };
  }

  async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const command = new GetTokensFromRefreshTokenCommand({
        ClientId: this.appConfig.auth.cognito.clientId,
        RefreshToken: refreshToken,
        ClientSecret: this.appConfig.auth.cognito.clientSecret,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
        throw new Error('Cannot refresh token');
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };

    } catch {
      throw new InvalidRefreshToken();
    }
  }

  async forgotPassword({ email }: AuthGateway.ForgotPasswordParams): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async confirmForgotPassword({ code, email, password }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      ConfirmationCode: code,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async deleteUser({ externalId }: AuthGateway.DeleteUserParams) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.appConfig.auth.cognito.poolId,
      Username: externalId,
    });

    await cognitoClient.send(command);
  }

  private getSecretHash(email: string): string {
    const { clientId, clientSecret } = this.appConfig.auth.cognito;
    return createHmac('SHA256', clientSecret)
      .update(`${email}${clientId}`)
      .digest('base64');
  }
}
export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    storeId: string
  }

  export type SignUpResult = {
    externalId: string
  }

  export type SignInParams = {
    email: string;
    password: string;
  }

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  }

  export type RefreshTokenParams = {
    refreshToken: string;
  }

  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  }

  export type ForgotPasswordParams = {
    email: string;
  }

  export type ConfirmForgotPasswordParams = {
    code: string;
    email: string;
    password: string
  }

  export type DeleteUserParams = {
    externalId: string
  }

}
