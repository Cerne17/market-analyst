import {
  Activity,
  BriefcaseBusiness,
  CircleDollarSign,
  Crosshair,
  Layers3,
  Sprout,
  UsersRound,
} from "lucide-react";

export const journey = [
  {
    number: 1,
    name: "Dor",
    question: "Existe um problema caro e frequente?",
    description:
      "Comece pelo último episódio. Entenda a frequência, o custo e o que a pessoa já faz para resolver o problema.",
    icon: Activity,
    output: "Uma dor concreta, com custo e frequência.",
  },
  {
    number: 2,
    name: "Cliente",
    question: "Quem sente a dor e quem paga?",
    description:
      "Defina critérios verificáveis para reconhecer o cliente. Separe quem usa, quem decide e quem pode vetar a compra.",
    icon: UsersRound,
    output: "Um perfil de cliente que você consegue encontrar.",
  },
  {
    number: 3,
    name: "Tamanho",
    question: "Quantos são e quanto pagam?",
    description:
      "Construa o mercado de baixo para cima: número de clientes e receita por conta. Para desafios corporativos, estime o valor do problema.",
    icon: Crosshair,
    output: "Um mercado dimensionado, com fontes e prazo.",
  },
  {
    number: 4,
    name: "Alternativas",
    question: "O que usam hoje? Por que trocariam?",
    description:
      "Compare soluções existentes, planilhas e o hábito de não fazer nada. A troca precisa valer o esforço para o cliente.",
    icon: Layers3,
    output: "Uma comparação honesta e um posicionamento claro.",
  },
  {
    number: 5,
    name: "Modelo e preço",
    question: "Como cobrar pelo valor entregue?",
    description:
      "Conecte preço, custo para servir e valor percebido. Registre as evidências que sustentam cada escolha.",
    icon: BriefcaseBusiness,
    output: "Uma hipótese de preço com justificativa.",
  },
  {
    number: 6,
    name: "Economia da unidade",
    question: "Cada cliente dá lucro?",
    description:
      "Relacione receita, margem, aquisição e retenção. No Sprint, esses números começam como hipóteses explícitas.",
    icon: CircleDollarSign,
    output: "Uma visão de LTV, CAC e tempo de retorno.",
  },
  {
    number: 7,
    name: "Tração / PMF",
    question: "As pessoas ficam e sentiriam falta?",
    description:
      "Procure compromissos concretos de tempo, reputação ou dinheiro. No Venture, acompanhe a retenção e o teste dos 40%.",
    icon: Sprout,
    output: "Evidências de demanda e próximos testes.",
  },
] as const;
