/**
 * In-Flight Concurrency Lock
 * Prevents overlapping executions of the same job within the worker runtime.
 * Automatically releases if execution exceeds maxLockDurationMs.
 */
class JobLockManager {
  private activeLocks: Map<string, { acquiredAt: number; maxDurationMs: number }> = new Map();

  /**
   * Attempts to acquire an execution lock for a job.
   * Returns true if lock acquired, false if job is currently in-flight.
   */
  public acquire(jobId: string, maxDurationMs: number = 300_000): boolean {
    const now = Date.now();
    const existing = this.activeLocks.get(jobId);

    if (existing) {
      if (now - existing.acquiredAt < existing.maxDurationMs) {
        // Still actively running within lease
        return false;
      }
      // Expired lock — stale from prior crash/timeout
      console.warn(`[LockManager] Expired stale lock for ${jobId} acquired ${now - existing.acquiredAt}ms ago`);
      this.activeLocks.delete(jobId);
    }

    this.activeLocks.set(jobId, { acquiredAt: now, maxDurationMs });
    return true;
  }

  /**
   * Releases the execution lock for a job.
   */
  public release(jobId: string): void {
    this.activeLocks.delete(jobId);
  }

  /**
   * Checks if a job currently holds an active lock.
   */
  public isLocked(jobId: string): boolean {
    const existing = this.activeLocks.get(jobId);
    if (!existing) return false;
    if (Date.now() - existing.acquiredAt >= existing.maxDurationMs) {
      this.activeLocks.delete(jobId);
      return false;
    }
    return true;
  }

  /**
   * For testing: clear all locks
   */
  public reset(): void {
    this.activeLocks.clear();
  }
}

export const lockManager = new JobLockManager();
