/* eslint-disable no-undef */
const getDataOrderDynamic = () => {
  const currentTimeUnix = Math.floor(Date.now()) * 1000;
  const transactionId = currentTimeUnix.toString().slice(0, 14);
  return {
    currentTimeUnix,
    transactionId,
  };
};

async function getTokenSession(
  transactionId,
  {
    requestSource = 'ECOMMERCE',
    merchantCode = '',
    orderNumber = '',
    publicKey = '',
    amount = '',
  },
) {
  let headers = new Headers();
  headers.append('Accept', 'application/json');

  const response = await fetch(
    'https://api.cursosya.info/api/token?transactionId=' + transactionId,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        requestSource,
        merchantCode,
        orderNumber,
        publicKey,
        amount,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

async function saveMoviePay(transactionId, clientId, movieId, amount) {
  try {
    let data = {
      clientId: clientId,
      movieId: movieId,
      transactionId: transactionId,
      amount: amount,
    };
    const response = await fetch('https://api.cursosya.info/api/client-movie', {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}

const { transactionId, currentTimeUnix } = getDataOrderDynamic();

/* Inicio datos del comercio */
const MERCHANT_CODE = '4001834';
const PUBLIC_KEY = 'VErethUtraQuxas57wuMuquprADrAHAb';
/* Fin datos del comercio */

/************* Inicio datos de la transacción **************/
const TRANSACTION_ID = transactionId;
const ORDER_NUMBER = transactionId;
const ORDER_AMOUNT = '2.99'; // dinamico _____________________________________
const ORDER_CURRENCY = 'PEN';
/************* Fin datos de la transacción **************/

/************* REEMPLAZAR CON DATOS VERDADEROS**************/
const CLIENT_ID = 6; // dinamicos del usuario _________________________________________
const MOVIE_ID = 34; // dinamicos del usuario _________________________________________

/********************************************************
   - Obteniendo el código de /autorización o token de sessión/ para inicializar el formulario de pago
   - El comercio debe llamar a su backend con sus datos para poder generar el token
   *********************************************************/
getTokenSession(TRANSACTION_ID, {
  requestSource: 'ECOMMERCE',
  merchantCode: MERCHANT_CODE,
  orderNumber: ORDER_NUMBER,
  publicKey: PUBLIC_KEY,
  amount: ORDER_AMOUNT,
}).then((authorization) => {
  /********* Obteniendo el token de la respuesta  **********/
  const {
    response: { token = undefined, error } = {
      response: undefined,
      error: 'NODE_API',
    },
  } = authorization;

  if (token) {
    const buttonPay = document.querySelector('#payWithYape');

    buttonPay.disabled = false;
    buttonPay.innerHTML = `${ORDER_CURRENCY} ${ORDER_AMOUNT} →`;

    const iziConfig = {
      config: {
        transactionId: TRANSACTION_ID,
        action: Izipay.enums.payActions.PAY,
        merchantCode: MERCHANT_CODE,
        order: {
          orderNumber: ORDER_NUMBER,
          currency: ORDER_CURRENCY,
          amount: ORDER_AMOUNT,
          processType: Izipay.enums.processType.AUTHORIZATION,
          merchantBuyerId: 'mc1768',
          dateTimeTransaction: currentTimeUnix,
          payMethod: Izipay.enums.showMethods.YAPE,
        },
        billing: {
          firstName: 'Juan',
          lastName: 'Wick',
          email: 'jwick@izipay.pe',
          phoneNumber: '989339999',
          street: 'calle el demo',
          city: 'lima',
          state: 'lima',
          country: 'PE',
          postalCode: '00001',
          document: '12345678',
          documentType: Izipay.enums.documentType.DNI,
        },
        render: {
          typeForm: Izipay.enums.typeForm.POP_UP,
          showButtonProcessForm: false,
        },
        appearance: {
          logo: 'https://cursosya.info/_next/static/media/cinergiaLogoFucsia.05377d54.svg',
        },
      },
    };

    const callbackResponsePayment = (response) => {
      //console.log(JSON.stringify(response, null, 2));

      /************** Transaccion exitosa CODE=00 *************/
      if (response.code == '021') {
        saveMoviePay(TRANSACTION_ID, CLIENT_ID, MOVIE_ID, ORDER_AMOUNT).then(
          (res) => {
            const { code } = res;
            if (code == 1) {
              console.log('PLAY MOVIE');
            }
          },
        );
      }
    };

    const handleLoadForm = () => {
      try {
        const checkout = new Izipay({ config: iziConfig?.config });

        checkout &&
          checkout.LoadForm({
            authorization: token,
            keyRSA: 'RSA',
            callbackResponse: callbackResponsePayment,
          });
      } catch (error) {
        console.log(error.message, error.Errors, error.date);
      }
    };

    /************** Botón para llamar al formulario *************/
    document
      .querySelector('#payWithYape')
      .addEventListener('click', async (event) => {
        event.preventDefault();
        handleLoadForm();
      });
  } else if (error) {
    console.log('error-->', error);
  }
});
