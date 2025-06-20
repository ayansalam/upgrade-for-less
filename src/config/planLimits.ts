export const PLAN_LIMITS = {
  Free: 5,
  Starter: 45,
  Pro: Infinity,
  LTD: Infinity,
};

export type Plan = keyof typeof PLAN_LIMITS;