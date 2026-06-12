
import { useAuthStore } from "@/features/auth/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | string[] | undefined | null>;
  body?: unknown;
}

export async function apiClient<T>(
  endpoint: string,
  { params, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const token = useAuthStore.getState().token;

  const isFormData = customConfig.body instanceof FormData;

  const headers: HeadersInit = isFormData ? {} : {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | null = null;
  if (customConfig.body) {
    if (isFormData) {
      body = customConfig.body as FormData;
    } else {
      body = JSON.stringify(customConfig.body);
    }
  }

  const config: RequestInit = {
    method: customConfig.method || "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    body,
  };

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}
