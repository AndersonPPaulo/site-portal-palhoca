export default function SlugToText(text: string): string {
  console.log("text", text);
  return text.toLowerCase().split("-").join(" ");
}
