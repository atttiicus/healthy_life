export const formatDatetime = (s: string) => (s ? s.slice(0, 19).replace('T', ' ') : '-')
export const formatDate = (s: string) => (s ? s.slice(0, 10) : '-')
