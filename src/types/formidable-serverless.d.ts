// types/formidable-serverless.d.ts
declare module 'formidable-serverless' {
  import { IncomingMessage } from 'http';
  import { EventEmitter } from 'events';

  interface Fields {
    [key: string]: any;
  }

  interface File {
    size: number;
    path: string;
    name: string | null;
    type: string | null;
    lastModifiedDate?: Date;
    filepath: string;
    mimetype?: string;
    [key: string]: any;
  }

  interface Files {
    [key: string]: File[] | File;
  }

  interface FormidableOptions {
    multiples?: boolean;
    [key: string]: any;
  }

  class IncomingForm extends EventEmitter {
    constructor(options?: FormidableOptions);
    parse(
      req: IncomingMessage,
      callback: (err: any, fields: Fields, files: Files) => void
    ): void;
  }

  export default function (options?: FormidableOptions): IncomingForm;
}
