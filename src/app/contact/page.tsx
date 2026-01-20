"use client";

export default function Contact() {
  const email = "contact@example.com"; // remplace par ton email

  return (

      <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold mb-10">
            Contact
          </h1>
          <p className="mb-4">
            Pour nous contacter, cliquez sur le lien ci-dessous :
          </p>
          <a
            href={`mailto:${email}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Envoyer un email
          </a>
        </div>
      </main>

  );
}
