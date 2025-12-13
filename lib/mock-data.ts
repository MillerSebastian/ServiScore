export interface User {
  id: string
  name: string
  avatar: string
  phone: string
  rating: number
  completedServices: number
  publishedServices: string[]
  role: "user" | "admin"
}

export type Applicant = User

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  text: string
  date: string
  replies?: Comment[]
}

export interface Service {
  id: string
  title: string
  description: string
  creatorId: string
  creatorName: string
  creatorAvatar: string
  price: number
  location: string
  status: "Open" | "In Progress" | "Completed"
  applicants: string[] // User IDs
  date: string
  category: string
}

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "/diverse-group-avatars.png",
    phone: "+1 234 567 890",
    rating: 4.8,
    completedServices: 12,
    publishedServices: ["s1"],
    role: "user",
  },
  {
    id: "u2",
    name: "Sarah Smith",
    avatar: "/diverse-group-avatars.png",
    phone: "+1 987 654 321",
    rating: 4.9,
    completedServices: 8,
    publishedServices: ["s2"],
    role: "user",
  },
]

// Stores removed — app focuses on services and users.

export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    title: "Dog Walking for Weekend",
    description: "Need someone to walk my two golden retrievers this Saturday morning.",
    creatorId: "u1",
    creatorName: "Alex Johnson",
    creatorAvatar: "/diverse-group-avatars.png",
    price: 25,
    location: "Downtown Park",
    status: "Open",
    applicants: ["u2"],
    date: "2023-11-20",
    category: "Pet Care",
  },
  {
    id: "s2",
    title: "Assemble IKEA Furniture",
    description: "Help needed assembling a Pax wardrobe system. Tools provided.",
    creatorId: "u2",
    creatorName: "Sarah Smith",
    creatorAvatar: "/diverse-group-avatars.png",
    price: 50,
    location: "Westside Apartments",
    status: "Open",
    applicants: [],
    date: "2023-11-22",
    category: "Handyman",
  },
]
