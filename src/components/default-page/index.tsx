export default function DefaultPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="px-2 w-full max-w-[1440px] mx-auto overflow-y-hidden">{children}</div>;
}
