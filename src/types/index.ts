export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface FileData {
  content: string
  name: string
  type: string
} 