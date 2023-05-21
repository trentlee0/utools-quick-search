export function encodeToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('loadend', () => resolve(reader.result as string))
    reader.addEventListener('error', reject)
  })
}
