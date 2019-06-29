import mailer from 'nodemailer';
import Handlebars from 'handlebars';
import { readFile } from './utils';

class Mailer {
  static async send({
    to, subject, template, context, attachments
  }) {
    const smtp = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    const content = {
      from: process.env.EMAIL_ADDRESS,
      replyTo: process.env.EMAIL_ADDRESS,
      to,
      subject,
      attachments,
    };
    try {
      const file = await readFile(`views/${template}.html`);
      const transport = mailer.createTransport(smtp);
      const compiled = Handlebars.compile(file);
      content.html = compiled(context);
      transport.sendMail(content, (err, info) => {});
    } catch (error) {
      // TODO
    }
  }
}

export default Mailer;
