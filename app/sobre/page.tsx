import Image from "next/image"

export default function Sobre() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image src="/images/1751647533_9cc7b4a154af3f78533665e36b695936.webp" alt="Muito mais que uma loja" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Sobre a Nossa Loja</h1>
        </div>
      </div>

      {/* Missão e Visão */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Missão e Visão</h2>
          <div className="w-full">
            <div className="prose max-w-none">
              <p className="mb-4">
                A nossa missão é dar aos verdadeiros adeptos de futebol a oportunidade de expressarem a sua paixão através de camisolas e sneakers de alta qualidade a preços acessíveis. Acreditamos que todos os adeptos merecem envergar as cores do seu clube com orgulho, sem precisarem de gastar uma fortuna.
              </p>
              <p className="mb-4">
                Trabalhamos diariamente para oferecer uma seleção variada de camisolas e sneakers — desde os maiores clubes europeus, às seleções nacionais, sneakers exclusivos e até modelos personalizados. O nosso compromisso com a qualidade e autenticidade distingue-nos no mercado.
              </p>
              <p>
                A nossa visão é tornar-nos uma referência em camisolas e sneakers em Portugal, expandindo continuamente a nossa oferta e mantendo sempre o compromisso com preços justos e um serviço ao cliente de excelência.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outras seções podem ser adicionadas aqui */}
    </div>
  )
}
