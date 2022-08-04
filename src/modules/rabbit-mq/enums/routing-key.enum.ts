export enum RoutingKeyEnum {
  REGISTER_USER_ROUTING_KEY = 'user.email.created',
  UPDATE_EMAIL_ROUTING_KEY = 'user.email.updated',
  FORGET_PASSWORD_EMAIL_ROUTING_KEY = 'user.email.forgotPassword',
  USER_SIGNIN_ROUTING_KEY = 'user.auth.signIn',
  USER_DELETE_ROUTING_KEY = 'user.auth.deleted',
  USER_UPDATE_ROUTING_KEY = 'user.auth.updated',
}
