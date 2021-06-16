import config from 'config';

export const dbLogMessage = (server: Record<string, any>) => `\n
	    \tApplication listening on ${config.get('app.apiHost')}\n
    	\tEnvironment => ${config.util.getEnv('NODE_ENV')} ${server}\n
	    \tDate: ${new Date()}`;
