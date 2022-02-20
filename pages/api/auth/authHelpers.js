import GoogleProvider from 'next-auth/providers/google';

const googleParams = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: 'consent',
      access_type: 'offline',
      response_type: 'code',
    },
  },
};

export const jwtParams = {
  encription: true,
};

export const redirectFunction = async (url) => {
  if (url === '/profile') {
    return Promise.resolve('/');
  }
  return Promise.resolve('/');
};

export const sessionFunction = async (sessionParamList) => {
  const { session, token } = sessionParamList;
  session.accessToken = token?.accessToken;
  return session;
};

export const jwtFunction = async (jwtParamList) => {
  const { token, account, isNewUser, profile } = jwtParamList;
  if (account) {
    token.accessToken = account?.access_token;
    token.isNewUser = isNewUser;
    token.emailVerified = profile?.email_verified;
  }
  return token;
};

export const providers = [
  // Configure one or more authentication providers
  GoogleProvider(googleParams),
  // ...add more providers here
];
