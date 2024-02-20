/* eslint-disable no-undef */
// Importación de funciones y métodos necesarios para realizar el pago con IziPay
import {
  getDataOrderDynamic,
  getTokenSession,
  saveMoviePay,
} from '@/app/lib/pay/izipay';
import { iziConfigFuntion } from '@/app/lib/pay/iziConfig';

// Función handlePayment
// Descripción: Inicia el proceso de pago utilizando IziPay.
// Parámetros:
// - orderAmount: Monto de la orden a pagar.
// - orderCurrency: Moneda en la que se realiza el pago.
// - clientId: Identificador único del cliente.
// - movieId: Identificador único de la película.
export const handlePayment = async ({
  orderAmount,
  orderCurrency,
  clientId,
  movieId,
}) => {
  // Obteniendo datos dinámicos de la orden (por ejemplo, transactionId y currentTimeUnix)
  const { transactionId, currentTimeUnix } = getDataOrderDynamic();

  /* Inicio datos del comercio */
  // Se obtienen datos del comercio desde las variables de entorno
  const MERCHANT_CODE = process.env.NEXT_PUBLIC_MERCHANT_CODE;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  /* Fin datos del comercio */

  /************* Inicio datos de la transacción **************/
  // Se asignan valores a las constantes relacionadas con la transacción

  const TRANSACTION_ID = transactionId;
  const ORDER_NUMBER = transactionId;
  const ORDER_AMOUNT = Number(orderAmount); // dinámico _____________________________________
  const ORDER_CURRENCY = `${orderCurrency}`;
  const formattedAmount = ORDER_AMOUNT.toFixed(2);
  /************* Fin datos de la transacción **************/

  /************* REEMPLAZAR CON DATOS VERDADEROS**************/
  // Se asignan valores dinámicos del usuario a las constantes
  const CLIENT_ID = `${clientId}`; // dinámicos del usuario _________________________________________
  const MOVIE_ID = `${movieId}`; // dinámicos del usuario _________________________________________

  /********************************************************
     - Obteniendo el código de /autorización o token de sessión/ para inicializar el formulario de pago
     - El comercio debe llamar a su backend con sus datos para poder generar el token
     *********************************************************/
  getTokenSession(TRANSACTION_ID, {
    requestSource: 'ECOMMERCE',
    merchantCode: MERCHANT_CODE,
    orderNumber: ORDER_NUMBER,
    publicKey: PUBLIC_KEY,
    amount: formattedAmount,
  }).then((authorization) => {
    /********* Obteniendo el token de la respuesta  **********/
    const {
      response: { token = undefined, error } = {
        response: undefined,
        error: 'NODE_API',
      },
    } = authorization;

    if (token) {
      // Función de retorno de llamada para manejar la respuesta del pago
      const callbackResponsePayment = (response) => {
        /************** Transaccion exitosa CODE=00 *************/
        if (response.code == '021') {
          // Guardar información del pago y reproducir la película si es necesario
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
      // Función para cargar el formulario de pago
      const handleLoadForm = () => {
        try {
          const iziConfig = iziConfigFuntion({
            TRANSACTION_ID,
            MERCHANT_CODE,
            ORDER_NUMBER,
            ORDER_CURRENCY,
            ORDER_AMOUNT,
            currentTimeUnix,
          });
          // Crear instancia de IziPay y cargar el formulario
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

      // Llamada a la función para cargar el formulario
      handleLoadForm();
    } else if (error) {
      console.log('error-->', error);
    }
  });
};
