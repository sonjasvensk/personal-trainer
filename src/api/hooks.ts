import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Customer, Training } from '../types'
import {
  createCustomer,
  createTraining,
  deleteCustomer,
  deleteTraining,
  fetchCustomers,
  fetchTrainings,
  fetchTrainingsWithCustomers,
  updateCustomer,
  updateTraining,
} from './client'

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (customer: Omit<Customer, 'id'>) => createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, customer }: { id: number; customer: Omit<Customer, 'id'> }) =>
      updateCustomer(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      queryClient.invalidateQueries({ queryKey: ['trainingsWithCustomers'] })
    },
  })
}

export function useTrainings() {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: fetchTrainings,
  })
}

export function useTrainingsWithCustomers() {
  return useQuery({
    queryKey: ['trainingsWithCustomers'],
    queryFn: fetchTrainingsWithCustomers,
  })
}

export function useCreateTraining() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ training, customerId }: { training: Omit<Training, 'id'>; customerId: number }) =>
      createTraining(training, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      queryClient.invalidateQueries({ queryKey: ['trainingsWithCustomers'] })
    },
  })
}

export function useUpdateTraining() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      training,
      customerId,
    }: {
      id: number
      training: Omit<Training, 'id'>
      customerId: number
    }) => updateTraining(id, training, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      queryClient.invalidateQueries({ queryKey: ['trainingsWithCustomers'] })
    },
  })
}

export function useDeleteTraining() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTraining(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      queryClient.invalidateQueries({ queryKey: ['trainingsWithCustomers'] })
    },
  })
}
