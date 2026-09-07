import { ENV } from '../../configs/env.config';

/** Logger tối giản – chỉ in DEBUG khi DEBUG_LOG=true để không làm nhiễu output CI. */
export const logger = {
  debug(message: string, ...args: unknown[]): void {
    if (ENV.debugLog) console.log(`[DEBUG] ${message}`, ...args);
  },
  info(message: string, ...args: unknown[]): void {
    console.log(`[INFO] ${message}`, ...args);
  },
};
