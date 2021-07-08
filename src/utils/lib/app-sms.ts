import { Twilio } from 'twilio';
import { TWILIO_SENDER_NAME, TWILIO_USE_SENDER_NAME_FOR } from '../constant';

type T = Record<string, any>;

/**
 * The AppSms class
 */
export class AppSms {
  /**
   * @param {Object} options of the message
   * @return {String} mobileNo
   */
  static async sendTwilioSms(options: T | Array<T>) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
      const authToken = process.env.TWILIO_AUTH_TOKEN as string;
      if (!Array.isArray(options)) {
        const { body, to } = options;
        const client = new Twilio(accountSid, authToken);
        const recipient = AppSms.formatNumber(to);
        let sender = process.env.TWILIO_SENDER_NUMBER;
        for (let i = 0; i < TWILIO_USE_SENDER_NAME_FOR.length; i++) {
          if (
            recipient.substring(0, TWILIO_USE_SENDER_NAME_FOR[i].length) ===
            TWILIO_USE_SENDER_NAME_FOR[i]
          ) {
            sender = TWILIO_SENDER_NAME || '';
            break;
          }
        }
        return await client.messages.create({
          body,
          to: recipient,
          from: sender,
        });
      } else {
        const client = new Twilio(accountSid, authToken);
        const messages = [];
        for (let i = 0; i < options.length; i++) {
          const { body, to } = options[i];
          const recipient = AppSms.formatNumber(to);
          let sender = process.env.TWILIO_SENDER_NUMBER;
          for (let i = 0; i < TWILIO_USE_SENDER_NAME_FOR.length; i++) {
            if (
              recipient.substring(0, TWILIO_USE_SENDER_NAME_FOR[i].length) ===
              TWILIO_USE_SENDER_NAME_FOR[i]
            ) {
              sender = TWILIO_SENDER_NAME || '';
              break;
            }
          }
          messages.push(
            client.messages.create({
              body,
              to: recipient,
              from: sender,
            })
          );
        }
        return await Promise.all(messages);
      }
    } catch (e) {
      console.log('twilio error >>>>>>>>', e);
    }
  }

  /**
   * @param {String} number The request object
   * @return {String} mobileNo
   */
  static formatNumber = (number: number) => {
    let mobileNo = number.toString().trim();
    if (mobileNo.substring(0, 1) === '0' && mobileNo.length === 11) {
      mobileNo = `+234${mobileNo.substring(1)}`;
    } else if (mobileNo.substring(0, 1) !== '+') {
      mobileNo = `+${mobileNo}`;
    }
    return mobileNo;
  };
}
