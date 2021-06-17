import config from 'config';

export const dbLogMessage = (server: Record<string, any>) => `\n
	    \tApplication listening on ${config.get('app.apiHost')}\n
    	\tEnvironment => ${config.util.getEnv('NODE_ENV')} ${server}\n
	    \tDate: ${new Date()}`;

export const dbLogError = (err: Record<string, any>) => `\n
	    \tThere was an un catch error: \n
    	\t==============================\n
	    \t${err}`;
