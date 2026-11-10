import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  FileCheck2,
  GitBranch,
  HeartHandshake,
  Info,
  LockKeyhole,
  MessageSquareText,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sources } from "@/data/demo";
import {
  Breadcrumbs,
  PageShell,
  SectionHeading,
  SourcePill,
} from "@/components/datademocracia/ui";

const questions = [
  {
    q: "O que significa um dado ausente?",
    a: "Significa que a informação não foi localizada ou não está disponível naquele recorte. Ausência de registro não é resultado zero e não prova que algo não aconteceu.",
  },
  {
    q: "Como os registros são revisados?",
    a: "Cada registro passa por conferência de fonte, escopo, data e contexto. Classificações sensíveis devem preservar a evidência original, registrar limitações e permitir correção pública.",
  },
  {
    q: "Como contestar uma informação?",
    a: "Cada registro sensível deve permitir o envio de fonte e justificativa. A contribuição entra em revisão, preserva a versão anterior e não altera automaticamente o conteúdo publicado.",
  },
];

export default function Methodology() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const [correctionSent, setCorrectionSent] = useState(false);
  return (
    <PageShell
      eyebrow="Transparência"
      title="A fonte vem antes da opinião"
      description="O DataDemocracia explica de onde vem cada informação, como ela foi tratada e onde ainda existem limites."
      actions={
        <Button variant="outline" asChild>
          <a
            href="https://github.com/tarlisodoria/DataDemocracia/commits/main"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitBranch size={16} /> Ver changelog
          </a>
        </Button>
      }
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Metodologia" }]}
      />
      <section className="method-hero">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={14} /> Princípios públicos
          </span>
          <h2>
            Se não dá para abrir a fonte, não dá para chamar de evidência.
          </h2>
          <p>
            A plataforma separa registro factual, interpretação documentada,
            avaliação e previsão. Cada camada tem um nível diferente de certeza
            e deve ser lida como tal.
          </p>
        </div>
        <div className="method-principles">
          <div>
            <strong>01</strong>
            <span>Fonte original</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Data e escopo</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Regra explícita</span>
          </div>
          <div>
            <strong>04</strong>
            <span>Correção pública</span>
          </div>
        </div>
      </section>
      <section className="evidence-chain">
        <SectionHeading
          eyebrow="Como um registro nasce"
          title="Da fonte ao que você vê"
          description="O caminho completo fica visível para que o usuário possa conferir, contestar e entender."
        />
        <div className="chain-row">
          <div>
            <span className="chain-icon">
              <Database size={19} />
            </span>
            <strong>Fonte original</strong>
            <small>TSE, Câmara, Senado, tribunais e portais oficiais.</small>
          </div>
          <ArrowRight size={18} />
          <div>
            <span className="chain-icon">
              <FileCheck2 size={19} />
            </span>
            <strong>Documento</strong>
            <small>PDF, API, registro ou publicação preservada.</small>
          </div>
          <ArrowRight size={18} />
          <div>
            <span className="chain-icon">
              <Code2 size={19} />
            </span>
            <strong>Dado normalizado</strong>
            <small>IDs, datas, entidades e versões organizadas.</small>
          </div>
          <ArrowRight size={18} />
          <div>
            <span className="chain-icon">
              <Sparkles size={19} />
            </span>
            <strong>Leitura explicada</strong>
            <small>Resumo, contexto e status com revisão.</small>
          </div>
        </div>
      </section>
      <section className="sources-method" id="fontes">
        <SectionHeading
          eyebrow="Fontes"
          title="Quem sustenta os dados"
          description="A Câmara dos Deputados já está conectada e é coletada todo mês. As demais fontes entram nas próximas etapas."
        />
        <div className="source-method-grid">
          {sources.map(source => (
            <div className="source-method-card" key={source.short}>
              <div className={`source-method-mark ${source.color}`}>
                {source.short.slice(0, 1)}
              </div>
              <div>
                <h3>{source.name}</h3>
                <p>{source.detail}</p>
                <SourcePill source={source.status} />
              </div>
              {source.status === "Conectada" && <CheckCircle2 size={17} />}
            </div>
          ))}
        </div>
      </section>
      <section className="method-layers">
        <SectionHeading
          eyebrow="Quatro camadas"
          title="Nem toda leitura tem o mesmo peso"
        />
        <div className="layers-grid">
          <div>
            <span>01</span>
            <h3>Registro factual</h3>
            <p>O que um órgão ou documento publicou.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Interpretação</h3>
            <p>Como o sistema estruturou e contextualizou o registro.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Avaliação</h3>
            <p>Indicadores e status produzidos por regra pública.</p>
          </div>
          <div>
            <span>04</span>
            <h3>Previsão</h3>
            <p>Estimativas separadas, com premissas e incerteza.</p>
          </div>
        </div>
      </section>
      <section className="correction-section" id="correcoes">
        <div className="correction-copy">
          <span className="eyebrow">
            <RefreshCw size={14} /> Correções
          </span>
          <h2>Errar com transparência também é parte do método.</h2>
          <p>
            Uma contestação não apaga automaticamente o registro. Ela cria uma
            revisão, preserva o histórico e registra a decisão final.
          </p>
          <Link href="/monitoramento" className="button button-secondary">
            Sugerir uma correção <ArrowRight size={15} />
          </Link>
        </div>
        <div className="correction-steps">
          <div>
            <span>1</span>
            <div>
              <strong>Envie a fonte</strong>
              <small>URL, documento e trecho relevante.</small>
            </div>
          </div>
          <div>
            <span>2</span>
            <div>
              <strong>Revisamos</strong>
              <small>Conferência de formato, contexto e conflito.</small>
            </div>
          </div>
          <div>
            <span>3</span>
            <div>
              <strong>Atualizamos o histórico</strong>
              <small>Versão anterior e nova decisão ficam registradas.</small>
            </div>
          </div>
        </div>
      </section>
      <section className="correction-form-section">
        <div>
          <span className="eyebrow">
            <MessageSquareText size={14} /> Contribua com uma revisão
          </span>
          <h2>Tem uma fonte que ainda não está aqui?</h2>
          <p>
            Envie o endereço e explique o trecho. Nesta versão, a contribuição
            fica como solicitação demonstrativa de revisão.
          </p>
        </div>
        {correctionSent ? (
          <div className="correction-success">
            <CheckCircle2 size={20} />
            <div>
              <strong>Solicitação registrada.</strong>
              <p>
                Ela está aguardando revisão e não altera automaticamente o
                conteúdo publicado.
              </p>
            </div>
          </div>
        ) : (
          <form
            className="correction-form"
            onSubmit={event => {
              event.preventDefault();
              setCorrectionSent(true);
            }}
          >
            <label>
              Link ou identificação da fonte
              <input required placeholder="https://... ou órgão / documento" />
            </label>
            <label>
              Trecho e motivo da correção
              <textarea
                required
                rows={3}
                placeholder="Conte o que deve ser conferido e em qual registro."
              />
            </label>
            <div className="correction-form-row">
              <label>
                Conflito de interesse
                <select defaultValue="Não identifiquei">
                  <option>Não identifiquei</option>
                  <option>Tenho vínculo com a fonte</option>
                  <option>Prefiro informar na revisão</option>
                </select>
              </label>
              <Button type="submit">
                <RefreshCw size={15} /> Enviar para revisão
              </Button>
            </div>
          </form>
        )}
      </section>
      <section className="faq-section">
        <SectionHeading
          eyebrow="Perguntas frequentes"
          title="Como ler a plataforma"
        />
        {questions.map((item, index) => (
          <div
            className={`faq-item ${openQuestion === index ? "open" : ""}`}
            key={item.q}
          >
            <button
              onClick={() =>
                setOpenQuestion(openQuestion === index ? null : index)
              }
            >
              <span>{item.q}</span>
              <ChevronDown size={17} />
            </button>
            {openQuestion === index && <p>{item.a}</p>}
          </div>
        ))}
      </section>
      <section className="independence-card">
        <div className="independence-icon">
          <LockKeyhole size={20} />
        </div>
        <div>
          <span className="eyebrow">Independência</span>
          <h2>Nenhum candidato compra tratamento favorável.</h2>
          <p>
            O DataDemocracia deve permanecer útil para quem não doa, não apoia e
            não concorda com os resultados apresentados. Critérios, fontes e
            limitações são públicos.
          </p>
        </div>
        <Link href="/" className="text-link">
          Voltar ao início <ArrowRight size={15} />
        </Link>
      </section>
    </PageShell>
  );
}
