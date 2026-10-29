// =====================================================
// data.js — Static data: workouts, achievements, quotes
// =====================================================

// ---- WORKOUT DEFINITIONS ----
const WORKOUTS = [
  {
    id: 'treino-rapido',
    title: 'Treino Rápido',
    subtitle: '5 minutos',
    duration: 5,
    durationSeconds: 300,
    difficulty: 'Rápido',
    color: '#ff2d75',
    emoji: '⚡',
    restSeconds: 15,
    exercises: [
      {
        name: 'Marcha Estacionária',
        seconds: 40,
        instructions: 'Levante os joelhos alternadamente, como se estivesse caminhando no lugar. Mantenha o ritmo constante.',
        lowImpactInstructions: 'Faça movimentos menores dos joelhos, mantendo os pés próximos ao chão.'
      },
      {
        name: 'Agachamento',
        seconds: 40,
        instructions: 'Pés na largura dos ombros, desça como se fosse sentar em uma cadeira. Mantenha o peito erguido.',
        lowImpactInstructions: 'Faça meio agachamento, descendo apenas até onde se sentir confortável.'
      },
      {
        name: 'Polichinelo Baixo Impacto',
        seconds: 40,
        instructions: 'Abra as pernas alternadamente enquanto levanta os braços. Sem pular, apenas deslize os pés.',
        lowImpactInstructions: 'Mantenha sempre um pé no chão. Movimentos controlados e lentos.'
      },
      {
        name: 'Prancha',
        seconds: 30,
        instructions: 'Apoie nos antebraços e pontas dos pés. Corpo reto como uma tábua. Contraia o abdômen.',
        lowImpactInstructions: 'Apoie nos joelhos em vez das pontas dos pés.'
      },
      {
        name: 'Respiração Final',
        seconds: 30,
        instructions: 'Inspire pelo nariz por 4 segundos, segure 2 segundos, expire pela boca por 6 segundos.',
        lowImpactInstructions: 'Sente-se confortavelmente e respire profundamente.'
      }
    ]
  },
  {
    id: 'treino-basico',
    title: 'Treino Básico',
    subtitle: '10 minutos',
    duration: 10,
    durationSeconds: 600,
    difficulty: 'Básico',
    color: '#f472b6',
    emoji: '🌱',
    restSeconds: 20,
    exercises: [
      {
        name: 'Aquecimento — Marcha',
        seconds: 60,
        instructions: 'Marche no lugar levantando os joelhos acima da cintura. Vá aumentando o ritmo gradualmente.',
        lowImpactInstructions: 'Levante os joelhos com movimentos suaves e controlados.'
      },
      {
        name: 'Agachamento',
        seconds: 45,
        instructions: 'Pés na largura dos ombros, desça lentamente (3 segundos) e suba em 1 segundo. Faça 10 repetições.',
        lowImpactInstructions: 'Use uma cadeira como apoio. Desça até tocá-la levemente e suba.'
      },
      {
        name: 'Flexão de Braços Adaptada',
        seconds: 40,
        instructions: 'Apoie as mãos na parede ou em uma superfície elevada. Mantenha o corpo reto. 8 repetições.',
        lowImpactInstructions: 'Apoie nos joelhos no chão se preferir. Mantenha o alinhamento da coluna.'
      },
      {
        name: 'Elevação de Quadril',
        seconds: 45,
        instructions: 'Deite de costas, joelhos dobrados, pés no chão. Eleve o quadril até alinhar com os joelhos. 12 repetições.',
        lowImpactInstructions: 'Mesmo exercício. Mova o quadril devagar, segurando 2 segundos no topo.'
      },
      {
        name: 'Prancha',
        seconds: 30,
        instructions: 'Apoie nos antebraços e pontas dos pés. Corpo reto. Contraia o abdômen e os glúteos.',
        lowImpactInstructions: 'Apoie nos joelhos. Mantenha o corpo alinhado do joelho à cabeça.'
      },
      {
        name: 'Alongamento Final',
        seconds: 60,
        instructions: 'Estique os braços para cima, incline o pescoço de lado, estique as costas. Respire fundo.',
        lowImpactInstructions: 'Faça os mesmos movimentos sentado em uma cadeira.'
      }
    ]
  },
  {
    id: 'treino-completo',
    title: 'Treino Completo',
    subtitle: '20 minutos',
    duration: 20,
    durationSeconds: 1200,
    difficulty: 'Completo',
    color: '#e879f9',
    emoji: '💪',
    restSeconds: 25,
    exercises: [
      {
        name: 'Aquecimento — Marcha Dinâmica',
        seconds: 90,
        instructions: 'Marche no lugar acelerando gradualmente. Adicione rotação de braços e torção de tronco.',
        lowImpactInstructions: 'Marche devagar sem levantar muito os joelhos. Foque na respiração.'
      },
      {
        name: 'Agachamento com Pulso',
        seconds: 50,
        instructions: 'Faça um agachamento normal. Ao subir, eleve os calcanhares por 1 segundo. 12 repetições.',
        lowImpactInstructions: 'Faça o agachamento simples sem o pulso. Use apoio se necessário.'
      },
      {
        name: 'Afundo Alternado',
        seconds: 50,
        instructions: 'Dê um passo à frente e desça o joelho traseiro quase ao chão. Alterne as pernas. 10 repetições cada.',
        lowImpactInstructions: 'Faça apenas meio afundo, descendo pouco. Use apoio de parede.'
      },
      {
        name: 'Flexão de Braços',
        seconds: 45,
        instructions: 'Apoie nas mãos e pontas dos pés, corpo reto. Desça até o peito quase tocar o chão. 8-10 repetições.',
        lowImpactInstructions: 'Apoie nos joelhos. Mantenha o corpo reto do joelho à cabeça.'
      },
      {
        name: 'Abdominais',
        seconds: 50,
        instructions: 'Deite de costas, joelhos dobrados, mãos atrás da cabeça. Eleve os ombros do chão. 15 repetições.',
        lowImpactInstructions: 'Eleve apenas os ombros, movimentos pequenos e controlados. 10 repetições.'
      },
      {
        name: 'Prancha Lateral Alternada',
        seconds: 40,
        instructions: 'Apoie em um antebraço e a lateral do pé. Mantenha o corpo reto. 20 segundos de cada lado.',
        lowImpactInstructions: 'Apoie no joelho inferior em vez do pé.'
      },
      {
        name: 'Mountain Climber Adaptado',
        seconds: 50,
        instructions: 'Posição de flexão. Traga um joelho ao peito alternadamente, devagar. 10 repetições cada perna.',
        lowImpactInstructions: 'Faça em pé inclinado na parede, trazendo o joelho à frente lentamente.'
      },
      {
        name: 'Alongamento Completo',
        seconds: 90,
        instructions: 'Estique isquiotibiais, quadríceps, ombros e pescoço. 15 segundos em cada posição. Respire fundo.',
        lowImpactInstructions: 'Faça todos os alongamentos sentado ou apoiado na parede.'
      }
    ]
  },
  {
    id: 'treino-intenso',
    title: 'Treino Intenso',
    subtitle: '30 minutos',
    duration: 30,
    durationSeconds: 1800,
    difficulty: 'Intenso',
    color: '#fb7185',
    emoji: '🔥',
    restSeconds: 20,
    exercises: [
      {
        name: 'Aquecimento HIIT',
        seconds: 120,
        instructions: 'Alterne 20 segundos de marcha rápida com 10 segundos de agachamento. Repita 4 vezes.',
        lowImpactInstructions: 'Marche no lugar em ritmo moderado por 2 minutos. Sem agachamentos.'
      },
      {
        name: 'Agachamento com Salto',
        seconds: 45,
        instructions: 'Faça um agachamento e ao subir dê um pequeno salto. Aterrisse suavemente. 10 repetições.',
        lowImpactInstructions: 'Agachamento normal com subida rápida mas sem salto. 12 repetições.'
      },
      {
        name: 'Flexão com Palmada',
        seconds: 45,
        instructions: 'Faça uma flexão e ao subir bata palmas rapidamente. 6-8 repetições.',
        lowImpactInstructions: 'Flexão adaptada no joelho. Faça 10 repetições controladas.'
      },
      {
        name: 'Burpee Adaptado',
        seconds: 45,
        instructions: 'Agache, apoie as mãos no chão, estique as pernas, volte, levante e estique os braços. 8 repetições.',
        lowImpactInstructions: 'Faça sem salto: agache, apoie as mãos, caminhe os pés para trás, volte devagar. 6 repetições.'
      },
      {
        name: 'Afundo com Salto',
        seconds: 50,
        instructions: 'Faça um afundo e troque as pernas no ar. Aterrisse com a outra perna na frente. 8 repetições cada.',
        lowImpactInstructions: 'Afundo normal alternado, sem salto. Use apoio se necessário.'
      },
      {
        name: 'Mountain Climber Rápido',
        seconds: 45,
        instructions: 'Posição de flexão. Alterne os joelhos ao peito rapidamente por 40 segundos.',
        lowImpactInstructions: 'Ritmo lento e controlado. 10 repetições de cada perna.'
      },
      {
        name: 'Prancha com Toque no Ombro',
        seconds: 45,
        instructions: 'Posição de prancha alta. Toque o ombro oposto alternadamente. Mantenha o quadril estável.',
        lowImpactInstructions: 'Prancha no joelho. Toque os ombros devagar.'
      },
      {
        name: 'HIIT Final — Polichinelos',
        seconds: 60,
        instructions: '30 segundos de polichinelos rápidos + 30 segundos de marcha estacionária. Dê tudo!',
        lowImpactInstructions: 'Marche no lugar por 60 segundos em ritmo confortável.'
      },
      {
        name: 'Abdominais Bicicleta',
        seconds: 50,
        instructions: 'Deite, mãos atrás da cabeça, alterne cotovelo ao joelho oposto. 15 repetições de cada lado.',
        lowImpactInstructions: 'Movimentos lentos e controlados. 10 repetições de cada lado.'
      },
      {
        name: 'Descanso e Respiração',
        seconds: 120,
        instructions: 'Respire fundo. Você foi incrível! Inspire 4 seg, segure 4, expire 6. Repita 10 vezes.',
        lowImpactInstructions: 'Sente-se e respire calmamente. Parabéns pelo esforço!'
      }
    ]
  }
];

// ---- ACHIEVEMENT DEFINITIONS ----
const ACHIEVEMENTS_DEFINITIONS = [
  {
    id: 'first_workout',
    name: 'O Primeiro Passo',
    description: 'Conclua seu primeiro treino.',
    icon: '🌟',
    check: (state, streak) => state.workoutLogs.length >= 1
  },
  {
    id: 'streak_3',
    name: 'Criando o Hábito',
    description: '3 dias consecutivos de treino.',
    icon: '🌿',
    check: (state, streak) => (streak.record >= 3 || streak.current >= 3)
  },
  {
    id: 'streak_7',
    name: 'Uma Semana de Disciplina',
    description: '7 dias consecutivos de treino.',
    icon: '🔥',
    check: (state, streak) => (streak.record >= 7 || streak.current >= 7)
  },
  {
    id: 'streak_14',
    name: 'Consistência',
    description: '14 dias consecutivos de treino.',
    icon: '💎',
    check: (state, streak) => (streak.record >= 14 || streak.current >= 14)
  },
  {
    id: 'streak_30',
    name: 'Imparável',
    description: '30 dias consecutivos de treino.',
    icon: '⚡',
    check: (state, streak) => (streak.record >= 30 || streak.current >= 30)
  },
  {
    id: 'streak_60',
    name: 'Mentalidade de Aço',
    description: '60 dias consecutivos de treino.',
    icon: '🦾',
    check: (state, streak) => (streak.record >= 60 || streak.current >= 60)
  },
  {
    id: 'streak_100',
    name: 'Lenda da Disciplina',
    description: '100 dias consecutivos de treino.',
    icon: '🏆',
    check: (state, streak) => (streak.record >= 100 || streak.current >= 100)
  },
  {
    id: 'quick_crusher',
    name: 'Velocidade Relâmpago',
    description: 'Conclua o Treino Rápido.',
    icon: '⚡',
    check: (state) => state.workoutLogs.some(l => l.workoutId === 'treino-rapido')
  },
  {
    id: 'night_warrior',
    name: 'Guerreiro da Noite',
    description: 'Conclua um treino após as 20h.',
    icon: '🌙',
    check: (state) => state.workoutLogs.some(l => {
      const h = new Date(l.completedAt).getHours();
      return h >= 20;
    })
  },
  {
    id: 'early_bird',
    name: 'Pássaro Madrugador',
    description: 'Conclua um treino antes das 8h.',
    icon: '🌅',
    check: (state) => state.workoutLogs.some(l => {
      const h = new Date(l.completedAt).getHours();
      return h < 8;
    })
  },
  {
    id: 'intense_master',
    name: 'Mestre da Intensidade',
    description: 'Conclua o Treino Intenso.',
    icon: '💥',
    check: (state) => state.workoutLogs.some(l => l.workoutId === 'treino-intenso')
  },
  {
    id: 'century_minutes',
    name: 'Centenário',
    description: 'Acumule 100 minutos de treino.',
    icon: '⏱️',
    check: (state) => {
      const total = state.workoutLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
      return total >= 100;
    }
  }
];

// ---- MOTIVATIONAL QUOTES ----
const QUOTES = {
  antipreguica: [
    "Você não precisa estar motivado. Precisa começar.",
    "Cinco minutos são melhores que zero.",
    "A preguiça dura alguns minutos. O orgulho de ter treinado dura muito mais.",
    "Não negocie com a preguiça.",
    "Levante. Vista a roupa de treino. Comece.",
    "A única forma de vencer a preguiça é ignorá-la.",
    "Você vai arrepender mais de não ter treinado do que de ter treinado.",
    "Seu corpo pode. É a sua mente que precisa de convencimento.",
    "Comece mal, mas comece. O progresso vem depois.",
    "A desculpa perfeita não existe. O treino perfeito também não. Comece assim mesmo.",
    "Ninguém nunca se arrependeu de ter feito um treino.",
    "A preguiça é temporária. Os resultados são permanentes.",
    "Não espere sentir vontade. A vontade vem após começar.",
    "Deite depois do treino. A cama vai estar lá quando você terminar."
  ],
  urgente: [
    "⚠️ Sua ofensiva está em risco! Faça agora — mesmo que seja 5 minutos.",
    "Hoje é o dia de provar que você é mais forte que as suas desculpas.",
    "Não deixe que um dia de preguiça apague dias de esforço.",
    "Este é o momento. Não existe melhor hora do que agora.",
    "Você chegou até aqui. Não vai parar hoje, vai?",
    "Um treino rápido agora vale mais que um longo amanhã.",
    "A ofensiva está esperando por você. Não a decepcione.",
    "Cada dia sem treino é um passo para trás. Não dê esse passo hoje."
  ],
  lembrete_hoje: [
    "Você ainda não treinou hoje. E aí?",
    "O treino de hoje está te esperando.",
    "Enquanto você pensa em desistir, alguém está construindo a disciplina que você quer ter.",
    "Seu único concorrente é a pessoa que você era ontem.",
    "Você não precisa de um treino perfeito. Precisa cumprir o combinado.",
    "A disciplina é fazer mesmo quando a vontade não aparece.",
    "Não quebre a promessa que fez a si mesmo.",
    "Imagine como você vai se sentir daqui a 30 dias se continuar.",
    "O treino de hoje é um voto a favor da pessoa que você quer se tornar.",
    "Cada treino é um tijolo. Construa o muro um tijolo por vez.",
    "Você sobreviveu a todos os dias difíceis até hoje. Esse também passa."
  ],
  concluido: [
    "Você fez! Isso é o que separa quem evolui de quem fica parado.",
    "Missão cumprida. Orgulhe-se disso.",
    "Hoje você ganhou. Amanhã, você vai ganhar de novo.",
    "Enquanto a maioria estava descansando, você estava evoluindo.",
    "Mais um dia de disciplina na conta. Continue.",
    "O treino foi feito. Agora é hora de recuperar e repetir amanhã.",
    "Seu eu do futuro está agradecendo por isso agora.",
    "Isso não foi sorte. Foi escolha. Parabéns pela escolha certa.",
    "Você treinou. Agora aprecie o sentimento de ter vencido a preguiça.",
    "Treino concluído. Mais forte do que ontem."
  ],
  recomeco: [
    "Sequências se quebram. O que importa é a nova que começa hoje.",
    "Não desista: hoje é o dia 1 de uma nova jornada.",
    "Todo campeão já recomeçou do zero pelo menos uma vez.",
    "Caiu? Levanta. Simples assim.",
    "Uma pausa não é uma derrota. Desistir sim.",
    "A melhor hora para recomeçar foi ontem. A segunda melhor hora é agora.",
    "Começar de novo é mais corajoso do que nunca ter parado.",
    "Não olhe para trás. A nova sequência começa agora."
  ],
  sequencia_longa: [
    "Você está provando todos os dias que disciplina não é um talento — é uma escolha.",
    "Dias assim constroem pessoas extraordinárias.",
    "Olha quem não desistiu. Orgulho puro.",
    "Sua consistência é inspiração para alguém. Continue.",
    "Isso é o que separa os que chegam lá dos que apenas sonham.",
    "Você não está mais procurando motivação. Você virou a motivação.",
    "Parabéns por não ter desistido quando foi difícil.",
    "Sua ofensiva é a prova de que você se respeita."
  ],
  manha: [
    "Bom dia! Quem treina de manhã tem o resto do dia de bônus.",
    "Comece o dia como quer terminá-lo: em movimento.",
    "A manhã pertence a quem acorda com intenção.",
    "Treine antes que o dia te convença de que não dá."
  ],
  noite: [
    "A noite ainda é sua. Use-a bem.",
    "Terminar o dia com um treino é terminar do jeito certo.",
    "Durma com o orgulho de quem cumpriu o que prometeu.",
    "A noite recompensa quem foi consistente durante o dia."
  ]
};
