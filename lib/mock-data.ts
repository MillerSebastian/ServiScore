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

export interface Store {
  id: string
  name: string
  image: string
  rating: number
  reviewCount: number
  description: string
  category: string
  photos: string[]
  comments: Comment[]
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

export const MOCK_STORES: Store[] = [
  {
    id: "st1",
    name: "Sweet Delights Bakery",
    image: "/bustling-bakery.png",
    rating: 4.7,
    reviewCount: 128,
    description: "Artisanal pastries and custom cakes for every occasion.",
    category: "Food",
    photos: ["/cake1.jpg", "/cake2.jpg"],
    comments: [
      {
        id: "c1",
        userId: "u2",
        userName: "Sarah Smith",
        userAvatar: "/diverse-group-avatars.png",
        text: "The croissants are to die for! Highly recommend.",
        date: "2023-10-15",
        replies: [
          {
            id: "c1-r1",
            userId: "u1",
            userName: "Alex Johnson",
            userAvatar: "/diverse-group-avatars.png",
            text: "Totally agree, Sarah!",
            date: "2023-10-16",
          },
        ],
      },
    ],
  },
  {
    id: "st2",
    name: "Green Thumb Nursery",
    image: "/lush-secret-garden.png",
    rating: 4.5,
    reviewCount: 85,
    description: "Your local source for indoor plants and gardening supplies.",
    category: "Garden",
    photos: ["/flower1.jpg"],
    comments: [],
  },
  {
    id: "st3",
    name: "Morning Brew Cafe",
    image: "/steaming-coffee-cup.png",
    rating: 4.9,
    reviewCount: 210,
    description: "Best coffee in town with a cozy atmosphere.",
    category: "Cafe",
    photos: [],
    comments: [],
  },
]

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
