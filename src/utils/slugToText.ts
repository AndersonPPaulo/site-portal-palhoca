export default function SlugToText(text: string): string {
  return text.toLowerCase().split("-").join(" ");
}
