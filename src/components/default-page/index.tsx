export default function DefaultPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full max-w-[1440px] mx-auto">{children}</div>;
}
