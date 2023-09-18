export function formateDate(dateString: string): string {
    return new Date(dateString).toLocaleString(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
}