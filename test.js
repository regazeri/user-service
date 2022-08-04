// /* eslint-disable no-restricted-syntax */
// // /* eslint-disable no-restricted-syntax */
// // // // for publish options
// // // interface Publish {
// // //   expiration?: string | number;
// // //   userId?: string;
// // //   CC?: string | string[];

// import { required } from "joi";

// // //   mandatory?: boolean;
// // //   persistent?: boolean;
// // //   deliveryMode?: boolean | number;
// // //   BCC?: string | string[];

// // //   contentType?: string;
// // //   contentEncoding?: string;
// // //   headers?: any;
// // //   priority?: number;
// // //   correlationId?: string;
// // //   replyTo?: string;
// // //   messageId?: string;
// // //   timestamp?: number;
// // //   type?: string;
// // //   appId?: string;
// // // }
// // // // for exchange options
// // // interface AssertExchange {
// // //   durable?: boolean;
// // //   internal?: boolean;
// // //   autoDelete?: boolean;
// // //   alternateExchange?: string;
// // //   arguments?: any;
// // // }
// // import axios from 'axios';
// // const waitMillisecondsFor = (millSeconds: number) =>
// //   new Promise(resolve => setTimeout(resolve, millSeconds));

// // const retryPromiseWithDelay = async (
// //   promise: any,
// //   maxTries = 2,
// //   delayTime = 3000,
// // ): Promise<any> => {
// //   try {
// //     return promise();
// //   } catch (error) {
// //     if (maxTries === 1) {
// //       return Promise.reject(error);
// //     }
// //     console.log("set");

// //     await waitMillisecondsFor(delayTime);
// //     return retryPromiseWithDelay(promise, maxTries - 1, delayTime);
// //   }
// // };

// // // // eslint-disable-next-line no-return-await
// // const piko = async () => {
// //   try {
// //     const p = await axios.get('https://jsonplaceholder.typicode.com/usr');
// //     console.log(p);
// //   } catch (error) {
// //     console.log("set");
// //   }
// // };
// // void retryPromiseWithDelay(piko(), 3);

// // // const wait = interval => new Promise(resolve => setTimeout(resolve, interval));
// // // async function retryPromise(fn, retriesLeft = 3, interval = 1000) {
// // //   try {
// // //     return await fn();
// // //   } catch (error) {
// // //     await wait(interval);
// // //     if (retriesLeft === 1) {
// // //       throw new Error(error);
// // //     }
// // //     console.log('retriesLeft: ', retriesLeft);

// // //     // eslint-disable-next-line no-return-await
// // //     return await retryPromise(fn, --retriesLeft, interval);
// // //   };
// // // }
// // // retryPromise(piko(), 5, 1000);
// import { createHash } from 'crypto';
// function generateRandomNumber(length: number): number {
//   const min = Math.pow(32, length - 1);
//   const max = Math.pow(32, length) - 1;
//   return Math.trunc(min + Math.random() * (max - min));
// }

// function generateStringConfirmCode(): string {
//   const randomNumber = generateRandomNumber(10);

//   return createHash('sha1').update(randomNumber.toString()).digest('hex');
// }
// console.log(generateStringConfirmCode());
const  BigNumber=required('bignumber.js');

const test = (value) => new BigNumber(value);
const result = test(1e6);
console.log(result);
