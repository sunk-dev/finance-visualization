export const metadata = {
  title: 'Financial Data Visualization',
  description: 'AI-powered financial analysis service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
