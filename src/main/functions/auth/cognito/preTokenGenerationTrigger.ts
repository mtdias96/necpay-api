import { PreTokenGenerationV2TriggerEvent } from 'aws-lambda';

export async function handler(event: PreTokenGenerationV2TriggerEvent) {
  event.response = {
    claimsAndScopeOverrideDetails: {
      accessTokenGeneration: {
        claimsToAddOrOverride: {
          storeId: event.request.userAttributes['custom:storeId'],
          internalId: event.request.userAttributes['custom:internalId'],
        },
      },
    },
  };

  return event;
}
