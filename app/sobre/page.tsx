import Image from "next/image"

export default function Sobre() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image src="/images/1751647533_9cc7b4a154af3f78533665e36b695936.webp" alt="Much more than a store" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">About Our Store</h1>
        </div>
      </div>

      {/* Missão e Visão */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Mission and Vision</h2>
          <div className="w-full">
            <div className="prose max-w-none">
              <p className="mb-4">
                Our mission is to give true football fans the opportunity to express their passion through high-quality jerseys and sneakers at affordable prices. We believe that all fans deserve to wear their club's colors with pride, without having to spend a fortune.
              </p>
              <p className="mb-4">
                We work daily to offer a varied selection of jerseys and sneakers — from the biggest European clubs, to national teams, exclusive sneakers and even customized models. Our commitment to quality and authenticity sets us apart in the market.
              </p>
              <p>
                Our vision is to become a reference in jerseys and sneakers in Europe, continuously expanding our offer and always maintaining our commitment to fair prices and excellent customer service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outras seções podem ser adicionadas aqui */}
    </div>
  )
}
