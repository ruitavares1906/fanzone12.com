import { formatDistanceToNow } from "date-fns"
import { pt } from "date-fns/locale"

export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: pt,
    })
  } catch (error) {
    return "data desconhecida"
  }
}
