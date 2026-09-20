// src/lib/content-os/publisher/index.ts
import { SocialPublisher } from "./types.ts";
import { OneSocialAdapter } from "./onesocial-adapter.ts";

export * from "./types.ts";
export * from "./onesocial-adapter.ts";

let defaultPublisher: SocialPublisher | null = null;

export function getSocialPublisher(): SocialPublisher {
  if (!defaultPublisher) {
    defaultPublisher = new OneSocialAdapter();
  }
  return defaultPublisher;
}
