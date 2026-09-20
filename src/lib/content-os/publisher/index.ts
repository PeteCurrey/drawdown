// src/lib/content-os/publisher/index.ts
import { SocialPublisher } from "./types";
import { OneSocialAdapter } from "./onesocial-adapter";

export * from "./types";
export * from "./onesocial-adapter";

let defaultPublisher: SocialPublisher | null = null;

export function getSocialPublisher(): SocialPublisher {
  if (!defaultPublisher) {
    defaultPublisher = new OneSocialAdapter();
  }
  return defaultPublisher;
}
