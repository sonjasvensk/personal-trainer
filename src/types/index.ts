export interface Customer {
  id?: number
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress: string
  postcode: string
  city: string
  _links?: {
    self: { href: string }
    customer?: { href: string }
    trainings?: { href: string }
  }
}

export interface Training {
  id?: number
  date: string
  duration: number
  activity: string
  customer?: Customer
  _links?: {
    self: { href: string }
    training: { href: string }
    customer: { href: string }
  }
}

export interface TrainingWithCustomer extends Training {
  customer: Customer
}

export interface ApiResponse<T> {
  _embedded?: {
    [key: string]: T[]
  }
}
