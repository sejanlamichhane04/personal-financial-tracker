import type {
  AuthSession,
  Bill,
  BillPayload,
  Goal,
  GoalPayload,
  Summary,
  Transaction,
  TransactionPayload,
} from "@/lib/finance";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

interface ApiErrorPayload {
  error?: string;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const getErrorMessage = (code?: string, fallbackStatus?: number) => {
  switch (code) {
    case "missing":
      return "Please fill in all required fields.";
    case "user_exists":
      return "An account with this email already exists.";
    case "invalid":
      return "Invalid email or password.";
    case "invalid_token":
    case "no_auth":
      return "Your session expired. Please sign in again.";
    case "not_found":
      return "We couldn't find that record anymore.";
    default:
      return fallbackStatus ? `Request failed with status ${fallbackStatus}.` : "Request failed.";
  }
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, token, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    cache: "no-store",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let code: string | undefined;

    try {
      const payload = (await response.json()) as ApiErrorPayload;
      code = payload.error;
    } catch {
      code = undefined;
    }

    throw new ApiError(getErrorMessage(code, response.status), response.status, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const register = (username: string, password: string) =>
  apiRequest<AuthSession>("/auth/register", {
    method: "POST",
    body: { username, password },
  });

export const login = (username: string, password: string) =>
  apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: { username, password },
  });

export const fetchTransactions = (token: string) =>
  apiRequest<Transaction[]>("/api/transactions", { token });

export const createTransaction = (token: string, payload: TransactionPayload) =>
  apiRequest<Transaction>("/api/transactions", {
    method: "POST",
    token,
    body: payload,
  });

export const fetchBills = (token: string) => apiRequest<Bill[]>("/api/bills", { token });

export const createBill = (token: string, payload: BillPayload) =>
  apiRequest<Bill>("/api/bills", {
    method: "POST",
    token,
    body: payload,
  });

export const updateBill = (token: string, billId: string, payload: Partial<BillPayload>) =>
  apiRequest<Bill>(`/api/bills/${billId}`, {
    method: "PATCH",
    token,
    body: payload,
  });

export const deleteBill = (token: string, billId: string) =>
  apiRequest<void>(`/api/bills/${billId}`, {
    method: "DELETE",
    token,
  });

export const fetchGoals = (token: string) => apiRequest<Goal[]>("/api/goals", { token });

export const createGoal = (token: string, payload: GoalPayload) =>
  apiRequest<Goal>("/api/goals", {
    method: "POST",
    token,
    body: payload,
  });

export const updateGoal = (token: string, goalId: string, payload: Partial<GoalPayload>) =>
  apiRequest<Goal>(`/api/goals/${goalId}`, {
    method: "PATCH",
    token,
    body: payload,
  });

export const fetchSummary = (token: string) =>
  apiRequest<Summary>("/api/reports/summary", { token });
