import * as Types from '../types';

import gql from 'graphql-tag';
import { UserAttributesFragmentDoc } from '../fragments/userAttributes.api';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;

export const UserUpdatesDocument = gql`
    subscription userUpdates($userId: ID!) {
  userUpdates(userId: $userId) {
    user {
      ...userAttributes
    }
  }
}
    ${UserAttributesFragmentDoc}`;
export function useUserUpdatesSubscription(variables: Types.UserUpdatesSubscriptionVariables | VueCompositionApi.Ref<Types.UserUpdatesSubscriptionVariables> | ReactiveFunction<Types.UserUpdatesSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<Types.UserUpdatesSubscription, Types.UserUpdatesSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<Types.UserUpdatesSubscription, Types.UserUpdatesSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<Types.UserUpdatesSubscription, Types.UserUpdatesSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<Types.UserUpdatesSubscription, Types.UserUpdatesSubscriptionVariables>(UserUpdatesDocument, variables, options);
}
export type UserUpdatesSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<Types.UserUpdatesSubscription, Types.UserUpdatesSubscriptionVariables>;