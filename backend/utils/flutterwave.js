const axios = require('axios');

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const getFlutterwaveTransactionId = (payload = {}) => {
  const nested = payload.data || {};
  return (
    payload.transaction_id ||
    payload.id ||
    nested.transaction_id ||
    nested.id ||
    null
  );
};

const parseBookIdFromTxRef = (txRef) => {
  const match = String(txRef || '').match(/^\d+-(.+)$/);
  return match ? match[1] : null;
};

const isSuccessfulFlutterwaveCharge = (payload = {}) => {
  const data = payload.data || payload;
  const topStatus = String(payload.status || '').toLowerCase();
  const chargeStatus = String(data.status || '').toLowerCase();
  const successfulCharge = ['successful', 'success', 'completed'].includes(chargeStatus);
  const successfulEnvelope = ['success', 'successful'].includes(topStatus) || !payload.status;

  return successfulCharge && successfulEnvelope;
};

const verifyFlutterwaveTransaction = async (transactionId) => {
  const response = await axios.get(
    `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
      }
    }
  );

  return response.data;
};

module.exports = {
  toAmount,
  getFlutterwaveTransactionId,
  parseBookIdFromTxRef,
  isSuccessfulFlutterwaveCharge,
  verifyFlutterwaveTransaction
};
