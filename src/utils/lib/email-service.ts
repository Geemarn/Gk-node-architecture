import config from 'config';
import sgMail from '@sendgrid/mail/index';
import mailgun from 'mailgun-js';
import { MailDataRequired } from '@sendgrid/mail/src/mail';

type T = Record<string, any>;
/**
 * The AppSms class
 */
export class EmailService {
  /**
   * @function
   * @param {object} options the options object
   * @return {function} the email send function
   */

  static async sendEmail(options: T) {
    if (config.get('app.environment') === 'test') {
      return;
    }
    if (config.get('email.mailOption') === 'mailgun') {
      return EmailService.useMailgun(options);
    }
    return EmailService.useSendGrid(options);
  }

  /**
   * @function
   * @param {object} options the options object
   * @return {function} the email send function
   */
  static async useSendGrid(options: Array<T> | T) {
    try {
      if (
        !Array.isArray(options) &&
        (!options.recipients || (!options?.templateId && !options.html))
      ) {
        throw new Error('Email options validation error');
      }
      sgMail.setApiKey(`${config.get('email.sendgrid.apiKey')}`);
      sgMail.setSubstitutionWrappers('{{', '}}');
      if (!Array.isArray(options)) {
        const message: T | MailDataRequired = {
          to: options.recipients,
          from: options.from || config.get('email.from'),
          subject: options.subject || config.get('app.appName'),
        };
        if (options.html) {
          message['html'] = options.html;
        } else {
          message['templateId'] = options.templateId;
        }
        if (options.substitutions) {
          message.dynamic_template_data = Object.assign(
            {},
            options.substitutions,
            {
              appName: config.get('app.appName'),
            }
          );
        }
        //@ts-ignore
        return sgMail.send(message);
      } else {
        const messages: Array<T> = [];
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          const message: T = {
            to: option.recipients,
            from: option.from || config.get('email.from'),
            subject: option.subject || config.get('app.appName'),
            templateId: option.templateId,
          };
          if (option.substitutions) {
            message.dynamic_template_data = Object.assign(
              {},
              option.substitutions,
              {
                appName: config.get('app.appName'),
              }
            );
          }
          //@ts-ignore
          messages.push(sgMail.send(message));
        }
        return Promise.all(messages);
      }
    } catch (e) {
      console.log('email error : ', e);
      throw e;
    }
  }
  /**
   * @param {Object} options
   * @return {Promise<*>}
   */
  static async useMailgun(options: T) {
    try {
      const mg = mailgun({
        apiKey: config.get('email.mailgun.apiKey'),
        domain: config.get('email.mailgun.domain'),
      });
      if (!Array.isArray(options)) {
        const data = {
          from: options.from || config.get('email.from'),
          to: options.recipients[0],
          subject: options.subject || config.get('app.appName'),
          template: options.templateId,
          ['t:text']: 'yes',
          ['h:X-Mailgun-Variables']: JSON.stringify(
            Object.assign({}, options.substitutions, {
              appName: config.get('app.appName'),
            })
          ),
        };
        return mg.messages().send(data);
      } else {
        const messages: Array<T> = [];
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          const data = {
            from: option.from || config.get('email.from'),
            to: option.recipients[0],
            subject: option.subject || config.get('app.appName'),
            template: option.templateId,
            ['t:text']: 'yes',
            ['h:X-Mailgun-Variables']: JSON.stringify(
              Object.assign({}, option.substitutions, {
                appName: config.get('app.appName'),
              })
            ),
          };
          messages.push(mg.messages().send(data));
        }
        return Promise.all(messages);
      }
    } catch (e) {
      console.log('email error : ', e);
      throw e;
    }
  }
}
