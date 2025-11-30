import type { ActivityExecution, ActivityMetrics } from "./types/clinical";

export const hasScoreMetrics = (
  metrics?: ActivityMetrics,
): metrics is ActivityMetrics & { correctAnswers: number; totalQuestions: number } =>
  typeof metrics?.correctAnswers === "number" &&
  typeof metrics.totalQuestions === "number" &&
  metrics.totalQuestions > 0;

export const hasResponseTime = (
  metrics?: ActivityMetrics,
): metrics is ActivityMetrics & { averageResponseTime: number } =>
  typeof metrics?.averageResponseTime === "number";

export const hasScoreMetricsExecution = (
  execution: ActivityExecution,
): execution is ActivityExecution & {
  metricsJson: ActivityMetrics & { correctAnswers: number; totalQuestions: number };
} => hasScoreMetrics(execution.metricsJson);

export const hasResponseTimeExecution = (
  execution: ActivityExecution,
): execution is ActivityExecution & {
  metricsJson: ActivityMetrics & { averageResponseTime: number };
} => hasResponseTime(execution.metricsJson);
