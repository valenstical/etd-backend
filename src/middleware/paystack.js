import requestPromise from 'request-promise';
import { Response } from '../helpers/utils';
import { STATUS } from '../helpers/constants';

const displayError = (response) => {
  Response.send(
    response,
    STATUS.FORBIDDEN,
    null,
    'We could not verify your payment. Please try again or contact us for assistance.',
    false,
  );
};

export default class Paystack {
  static async verifyPayment(request, response, next) {
    const { ref } = request.body;
    const options = {
      uri: `https://api.paystack.co/transaction/verify/${ref}`,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      json: true,
    };
    requestPromise(options).then(
      (result) => {
        const {
          data: {
            status, reference, amount, plan
          },
        } = result;
        if (status !== 'success') {
          return displayError(response);
        }
        response.locals.payment = { reference, amount, plan };
        next();
      },
      error => displayError(response),
    );
  }
}
