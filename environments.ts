import * as Updates from 'expo-updates';

type ENVType = 'dev' | 'prod';

type ENVObj = {
  name: ENVType;
  apiUrl: string;
}

type ENVMap = {
  [key in ENVType]: ENVObj;
}

const localhost = 'http://192.168.0.104:3000';

const ENV: ENVMap = {
  dev: {
    name: 'dev',
    apiUrl: localhost,
  },
  prod: {
    name: 'prod',
    apiUrl: 'http://sweet-notes-app.herokuapp.com',
  }
}

export function getEnvVars(env = Updates.channel): ENVObj {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'prod') {
    return ENV.prod
  }

  return ENV.prod;
}