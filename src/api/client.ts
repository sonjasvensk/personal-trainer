import type { Customer, Training, TrainingWithCustomer } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }
  return response.json()
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_BASE_URL}/customers`)
  const data = await handleResponse<{ _embedded: { customers: Customer[] } }>(response)
  return data._embedded?.customers || []
}

export async function fetchCustomerById(id: number): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`)
  return handleResponse<Customer>(response)
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  return handleResponse<Customer>(response)
}

export async function updateCustomer(id: number, customer: Omit<Customer, 'id'>): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  return handleResponse<Customer>(response)
}

export async function deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete customer: ${response.status} - ${error}`)
  }
}

export async function fetchTrainings(): Promise<Training[]> {
  const response = await fetch(`${API_BASE_URL}/trainings`)
  const data = await handleResponse<{ _embedded: { trainings: Training[] } }>(response)
  return data._embedded?.trainings || []
}

export async function fetchTrainingsWithCustomers(): Promise<TrainingWithCustomer[]> {
  const response = await fetch(`${API_BASE_URL}/gettrainings`)
  return handleResponse<TrainingWithCustomer[]>(response)
}

export async function createTraining(
  training: Omit<Training, 'id'>,
  customerId: number
): Promise<Training> {
  const payload = {
    ...training,
    customer: `${API_BASE_URL}/customers/${customerId}`,
  }
  const response = await fetch(`${API_BASE_URL}/trainings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Training>(response)
}

export async function updateTraining(
  id: number,
  training: Omit<Training, 'id'>,
  customerId: number
): Promise<Training> {
  const payload = {
    ...training,
    customer: `${API_BASE_URL}/customers/${customerId}`,
  }
  const response = await fetch(`${API_BASE_URL}/trainings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Training>(response)
}

export async function deleteTraining(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/trainings/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete training: ${response.status} - ${error}`)
  }
}

export async function resetDatabase(): Promise<void> {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/reset`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error(`Failed to reset database: ${response.status}`)
  }
}
