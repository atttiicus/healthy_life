export interface AdminInfo {
  id: number
  account: string
  avatar?: string
  level: number
  token: string
}

export interface User {
  uid: number
  account: string
  user_name: string
  email?: string
  age?: number
  sex?: string
  height?: string
  weight?: string
  user_tag?: string
  created_at: string
  updated_at: string
}

export interface Article {
  aid: number
  title: string
  content: string
  author: string
  type: number
  image: string
  created_at: string
  updated_at: string
}

export interface Stats {
  userCount: number
  articleCount: number
  dataCount: number
}
