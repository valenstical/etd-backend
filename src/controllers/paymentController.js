import Random from 'random-int';
import moment from 'moment';
import pdfcrowd from 'pdfcrowd';
import Handlebars from 'handlebars';

import { Response, readFile } from '../helpers/utils';
import { STATUS, STATES } from '../helpers/constants';
import models from '../database/models';
import Mailer from '../helpers/sendMail';

const { Member, Payment } = models;

class PaymentController {
  /**
   * Generates a paymentID and sends paystack data to user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async requestPayment(request, response) {
    const {
      authValue: { id },
    } = response.locals;
    const member = await Member.getMember('id', id);
    const { paymentType } = request.query;
    return Response.send(
      response,
      STATUS.OK,
      {
        ref: Random(100000000, 999999999),
        key: process.env.PAYSTACK_PUBLIC_KEY,
        email: member.email,
        plan: process.env[paymentType],
      },
      'Payment details initiated',
      true,
    );
  }

  /**
   * Process successful payment
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async processPayment(request, response) {
    const {
      authValue: { id },
      payment: { reference, amount, plan },
    } = response.locals;
    try {
      await Payment.create({
        id: reference,
        amount,
        plan,
        memberId: id,
      });
      Response.send(response, STATUS.OK, null, 'Payment successful', true);
      PaymentController.deliverValue(plan, { reference, id });
    } catch (error) {
      return Response.send(
        response,
        STATUS.FORBIDDEN,
        null,
        'There was a problem processing your payment. Please contact us for assistance.',
        false,
      );
    }
  }

  static deliverValue(paymentType, data) {
    switch (paymentType) {
      case process.env.plan_membership_fee:
        return PaymentController.processMembershipSubscription(data);
      default:
    }
  }

  static createPDF(html, reference, member) {
    const client = new pdfcrowd.HtmlToPdfClient(
      process.env.PDFCROWD_USERNAME,
      process.env.PDFCROWD_KEY,
    );
    try {
      client.setPageSize('A4');
      client.setOrientation('portrait');
      client.setScaleFactor(67);
      client.setNoMargins(true);
    } catch (error) {
      // TODO
    }
    const path = `${process.env.BASE_DIR}/views/pdfs/${reference}.pdf`;
    client.convertStringToFile(html, path, (err) => {
      PaymentController.mailCertificate(path, member);
    });
  }

  static mailCertificate(path, member) {
    Mailer.send({
      to: member.email,
      template: 'welcome',
      subject: 'Welcome to APSON',
      attachments: [
        {
          filename: 'certificate.pdf',
          path,
        },
      ],
      context: {
        name: member.name,
      },
    });
  }

  static async processMembershipSubscription({ reference, id }) {
    try {
      const expiresAt = moment().add(1, 'years');

      await Member.update({ expiresAt }, { where: { id } });
      const member = await Member.getMember('id', id);

      const file = await readFile('views/certificate.html');
      const compiled = Handlebars.compile(file);
      const html = compiled({
        name: member.name,
        date: moment().format('MMMM Do, YYYY'),
        id,
        reference,
        state: STATES[member.state],
        expiresAt: moment(expiresAt, 'YYYY-MM-DD').format('MMMM Do, YYYY'),
      });
      PaymentController.createPDF(html, reference, member);
    } catch (error) {
      // TODO
    }
  }
}
export default PaymentController;
