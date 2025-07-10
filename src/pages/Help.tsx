import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Mail, Phone, Clock, FileText, Shield, CreditCard, RefreshCw } from 'lucide-react';

const Help = () => {
  const faqData = [
    {
      category: "Conta e Perfil",
      questions: [
        {
          question: "Como posso criar uma conta?",
          answer: "Podes criar uma conta clicando em 'Registar' e preenchendo os teus dados básicos. Também podes usar a tua conta Google para um registo mais rápido."
        },
        {
          question: "Como edito as minhas informações pessoais?",
          answer: "Vai ao teu perfil através do menu e clica em 'Editar Perfil'. Lá podes alterar o teu nome, foto, objetivos e preferências."
        },
        {
          question: "Esqueci-me da minha palavra-passe. O que faço?",
          answer: "Na página de login, clica em 'Esqueci a palavra-passe' e segue as instruções enviadas para o teu email."
        }
      ]
    },
    {
      category: "Calculadora de Calorias",
      questions: [
        {
          question: "Como funciona a calculadora de calorias?",
          answer: "A nossa calculadora usa dados como idade, peso, altura, sexo e nível de atividade para calcular as tuas necessidades calóricas diárias usando fórmulas científicamente validadas."
        },
        {
          question: "Os resultados são precisos?",
          answer: "Os cálculos são baseados em fórmulas reconhecidas cientificamente, mas são estimativas. Para necessidades específicas, consulta sempre um profissional de saúde."
        },
        {
          question: "Posso ajustar os meus objetivos?",
          answer: "Sim! Podes alterar os teus objetivos (ganhar peso, manter, perder) a qualquer momento no teu perfil, e os cálculos serão ajustados automaticamente."
        }
      ]
    },
    {
      category: "Planos e Gamificação",
      questions: [
        {
          question: "Como funcionam os planos?",
          answer: "Podes escolher entre planos de treino, alimentares ou tipos de dieta. Cada plano tem checkpoints diários que podes completar para ganhar pontos."
        },
        {
          question: "O que são pontos e conquistas?",
          answer: "Ganhas pontos ao completar checkpoints diários (10 pontos) e conquistas especiais (100 pontos). É uma forma divertida de te manteres motivado!"
        },
        {
          question: "Posso ter múltiplos planos ativos?",
          answer: "Sim! Podes ter vários planos ativos ao mesmo tempo, combinando treino, alimentação e tipo de dieta conforme as tuas necessidades."
        }
      ]
    },
    {
      category: "Receitas",
      questions: [
        {
          question: "Como posso aceder às receitas?",
          answer: "As receitas estão disponíveis na secção 'Receitas'. Podes filtrar por tipo, dificuldade e ingredientes."
        },
        {
          question: "Posso criar as minhas próprias receitas?",
          answer: "Sim! Com uma subscrição ativa, podes criar e partilhar as tuas receitas personalizadas com a comunidade."
        }
      ]
    },
    {
      category: "Subscrições",
      questions: [
        {
          question: "Que benefícios tem a subscrição Premium?",
          answer: "A subscrição Premium remove anúncios, dá acesso a receitas exclusivas, planos avançados e funcionalidades de criação de conteúdo."
        },
        {
          question: "Posso cancelar a minha subscrição?",
          answer: "Sim, podes cancelar a qualquer momento através das definições da conta ou contactando o nosso suporte."
        }
      ]
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
          <HelpCircle className="h-10 w-10 text-primary" />
          Centro de <span className="gradient-primary bg-clip-text text-transparent">Ajuda</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Encontra respostas para as tuas dúvidas e aprende a tirar o máximo partido do ZeroGram
        </p>
      </div>

      {/* Quick Contact */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Precisa de Ajuda Imediata?
          </CardTitle>
          <CardDescription>
            A nossa equipa está aqui para te ajudar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">suporte@zerogram.pt</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Horário</div>
                <div className="text-sm text-muted-foreground">Seg-Sex: 9h-18h</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
          <CardDescription>
            Respostas para as dúvidas mais comuns dos nossos utilizadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{category.category}</Badge>
                </div>
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={`${categoryIndex}-${faqIndex}`} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Política de Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A tua privacidade é importante para nós. Esta política explica como recolhemos, usamos e protegemos os teus dados pessoais.
            </p>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Dados que Recolhemos:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Informações de perfil (nome, email, idade, etc.)</li>
                <li>Dados de atividade na app (cálculos, receitas)</li>
                <li>Preferências e configurações</li>
              </ul>
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Como Usamos os Dados:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Personalizar a tua experiência</li>
                <li>Melhorar os nossos serviços</li>
                <li>Enviar atualizações importantes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Termos de Utilização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao usar o ZeroGram, concordas com os seguintes termos e condições.
            </p>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Uso Permitido:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Uso pessoal e não comercial</li>
                <li>Respeitar outros utilizadores</li>
                <li>Não partilhar conteúdo inadequado</li>
              </ul>
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Responsabilidades:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Manter as credenciais seguras</li>
                <li>Usar informações precisas</li>
                <li>Respeitar direitos de propriedade</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Política de Reembolso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Direito de Reembolso</h4>
              <p className="text-sm text-muted-foreground">
                Tens direito a um reembolso total se cancelares a tua subscrição nos primeiros 7 dias após a compra.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Condições:</h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Cancelamento dentro de 7 dias</li>
                  <li>Primeira subscrição apenas</li>
                  <li>Reembolso processado em 5-10 dias úteis</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Como Solicitar</h4>
              <p className="text-sm text-muted-foreground">
                Para solicitar um reembolso, contacta o nosso suporte com os detalhes da tua compra.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Informações Necessárias:</h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Email da conta</li>
                  <li>Data da compra</li>
                  <li>Motivo do cancelamento</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ainda tens dúvidas?</h3>
            <p className="text-muted-foreground">
              A nossa equipa está sempre disponível para te ajudar com qualquer questão.
            </p>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-primary">
                <Mail className="h-4 w-4" />
                <span className="font-medium">suporte@zerogram.pt</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;