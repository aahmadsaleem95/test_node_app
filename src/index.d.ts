// export {};
// declare global {
//   namespace Express {
//     export interface Request {
//       userData?: any;
//     }
//   }
// }

import { Express } from "express-serve-static-core";
interface TokenData {
  uuid: any;
  id: any;
}
declare global {
  namespace Express {
    export interface TRequest extends Request {
      userData: TokenData;
    }
  }
}

export { TRequest };

// declare module "express-serve-static-core" {
//   interface Request {
//     userData: TokenData;
//   }
// }
