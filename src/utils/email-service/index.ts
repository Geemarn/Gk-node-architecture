import config from 'config';
import sgMail from '@sendgrid/mail/index';
import mailgun from 'mailgun-js';
import Q from 'q';

type T = Record<string, any> | Array<Record<string, any>>;
/**
 * The AppSms class
 */
class EmailService {
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
  static async useSendGrid(options: T) {
    try {
      if (!options.recipients || (!options.templateId && !options.html)) {
        throw new Error('Email options validation error');
      }
      sgMail.setApiKey(`${config.get('email.sendgrid.apiKey')}`);
      sgMail.setSubstitutionWrappers('{{', '}}');
      if (!Array.isArray(options)) {
        const message = {
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
        return sgMail.send(message);
      } else {
        const messages = [];
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          const message = {
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
          messages.push(sgMail.send(message));
        }
        return Q.all(messages);
      }
    } catch (e) {
      console.log('email error : ', e);
      throw e;
    }
  }
}

export default EmailService;
