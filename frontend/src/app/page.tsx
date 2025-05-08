import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">echo-chamber</h1>
      <p className="text-lg text-gray-600 text-center">
        単語から、あなたの内面を映像で。
      </p>
    </main>
  );
}
