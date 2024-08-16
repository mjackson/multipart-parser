import { parseMultipartRequest } from '@mjackson/multipart-parser';

import { MultipartMessage } from '../messages.js';

export async function parse(message: MultipartMessage): Promise<number> {
  let request = {
    headers: new Headers({
      'Content-Type': `multipart/form-data; boundary=${message.boundary}`,
    }),
    body: new ReadableStream({
      start(controller) {
        for (let chunk of message.generateChunks()) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    }),
  } as unknown as Request;

  let start = performance.now();

  for await (let _ of parseMultipartRequest(request)) {
    // Do nothing
  }

  return performance.now() - start;
}
