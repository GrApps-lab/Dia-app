import React, { useState, useMemo, useEffect } from "react";
import { Wallet, ChefHat, Lightbulb, TrendingUp, PiggyBank, ShoppingCart, PartyPopper, Sparkles, Loader2 } from "lucide-react";

// ---------- Armazenamento local ----------
// Fora do Claude, usamos localStorage do navegador (cada visitante guarda os
// próprios dados no aparelho dele — não sincroniza entre dispositivos).
async function storageGet(key) {
  const v = localStorage.getItem(key);
  if (v === null) throw new Error("not found");
  return { key, value: v };
}
async function storageSet(key, value) {
  localStorage.setItem(key, value);
  return { key, value };
}

// ---------- Design tokens ----------
const COLORS = {
  paper: "#EDE6D3",
  paperDark: "#E2D9C0",
  ink: "#1F2A3C",
  inkSoft: "#4B5568",
  ochre: "#C4882A",
  ochreDark: "#A66F1E",
  teal: "#2B5A55",
  brick: "#AE4438",
  line: "#C9BE9F",
};

const TIPS = [
  { id: 1, cat: "Casa", text: "Coloque uma toalha úmida dobrada no fundo da geladeira: absorve odores e dura semanas." },
  { id: 2, cat: "Tempo", text: "Regra dos 2 minutos: se uma tarefa leva menos de 2 min, faça agora em vez de anotar pra depois." },
  { id: 3, cat: "Dinheiro", text: "Antes de comprar algo não essencial, espere 24h. A vontade some na maioria das vezes." },
  { id: 4, cat: "Saúde", text: "Encha uma garrafa de água grande de manhã — é mais fácil acompanhar quanto você já bebeu no dia." },
  { id: 5, cat: "Casa", text: "Bola de papel alumínio na secadora reduz estática e amassados, sem precisar de amaciante." },
  { id: 6, cat: "Tempo", text: "Separe a roupa do dia seguinte à noite. Economiza uns 10 minutos de manhã, todo dia." },
  { id: 7, cat: "Cozinha", text: "Guarde ervas frescas como flores: em um copo com água na geladeira, duram o dobro do tempo." },
  { id: 8, cat: "Dinheiro", text: "Separe uma conta só pra gastos fixos (aluguel, contas). O que sobrar na outra é livre pra usar sem culpa." },
  { id: 9, cat: "Casa", text: "Café moído usado seca e vira um ótimo absorvedor de cheiro dentro do tênis." },
  { id: 10, cat: "Sono", text: "Evite tela 30 min antes de dormir — mesmo sem perceber, a luz azul atrasa o sono." },
  { id: 11, cat: "Trabalho", text: "Antes de abrir e-mail ou redes sociais, faça a tarefa mais importante do dia. O resto pode esperar 1h." },
  { id: 12, cat: "Cozinha", text: "Limão cortado dura mais se guardado com o corte virado pra baixo num pratinho." },
  { id: 13, cat: "Saúde", text: "Levante e alongue por 2 minutos a cada 1h de tela. O corpo agradece mais que qualquer suplemento." },
  { id: 14, cat: "Casa", text: "Vinagre branco em spray resolve a maioria da limpeza da cozinha, é mais barato e sem cheiro forte." },
  { id: 15, cat: "Dinheiro", text: "Assinaturas que você não lembra de usar há 1 mês? Cancele. É dinheiro saindo no automático." },
  { id: 16, cat: "Tempo", text: "Prepare o café da manhã na noite anterior (overnight oats, frutas cortadas) e ganhe tempo real de manhã." },
  { id: 17, cat: "Trabalho", text: "Agrupe tarefas parecidas (ligações, e-mails) num bloco só em vez de intercalar — evita perder o foco toda hora." },
  { id: 18, cat: "Cozinha", text: "Congele bananas maduras demais: viram base pronta pra vitamina ou bolo depois." },
  { id: 19, cat: "Dinheiro", text: "Faça uma lista antes de ir ao mercado com fome: reduz compra por impulso em até 30%." },
  { id: 20, cat: "Casa", text: "Escova de dentes velha é ótima pra limpar frestas de teclado, torneira e rodapé." },
  { id: 21, cat: "Saúde", text: "Respire fundo 4 segundos, segure 4, solte em 6 — acalma o sistema nervoso em menos de 1 minuto." },
];

const RECIPES = [
  { id: 1, name: "Omelete de forno com legumes", time: "20 min", ingredients: ["ovo", "queijo", "tomate", "cebola", "espinafre"], steps: "Bata os ovos, misture os legumes picados e o queijo, leve ao forno em uma forma untada por 15 min a 200°C." },
  { id: 2, name: "Macarrão alho e óleo com frango", time: "25 min", ingredients: ["macarrão", "alho", "azeite", "frango", "salsinha"], steps: "Cozinhe o macarrão. Doure o alho no azeite, adicione o frango desfiado, misture ao macarrão e finalize com salsinha." },
  { id: 3, name: "Sopa rápida de lentilha", time: "30 min", ingredients: ["lentilha", "cenoura", "cebola", "alho", "caldo"], steps: "Refogue cebola e alho, adicione lentilha, cenoura em cubos e caldo. Cozinhe 20 min em fogo médio." },
  { id: 4, name: "Wrap de atum", time: "10 min", ingredients: ["atum", "tortilha", "alface", "tomate", "maionese"], steps: "Misture o atum com maionese, monte na tortilha com alface e tomate, enrole e sirva." },
  { id: 5, name: "Arroz de forno com legumes", time: "35 min", ingredients: ["arroz", "cenoura", "ervilha", "queijo", "cebola"], steps: "Misture arroz cozido com legumes e metade do queijo, cubra com o restante e gratine no forno por 15 min." },
  { id: 6, name: "Panqueca de banana e aveia", time: "15 min", ingredients: ["banana", "ovo", "aveia", "canela"], steps: "Amasse a banana, misture com ovo, aveia e canela. Frite pequenas porções em frigideira antiaderente até dourar dos dois lados." },
  { id: 7, name: "Frango xadrez simplificado", time: "25 min", ingredients: ["frango", "pimentão", "cebola", "molho de soja", "alho"], steps: "Corte o frango em cubos e doure com alho. Adicione pimentão e cebola em tiras, refogue e finalize com molho de soja." },
  { id: 8, name: "Salada morna de grão-de-bico", time: "15 min", ingredients: ["grão-de-bico", "tomate", "cebola roxa", "azeite", "limão"], steps: "Misture grão-de-bico cozido com tomate e cebola picados, tempere com azeite, limão e sal." },
  { id: 9, name: "Risoto rápido de queijo", time: "30 min", ingredients: ["arroz arbóreo", "queijo", "cebola", "caldo", "manteiga"], steps: "Refogue a cebola na manteiga, adicione o arroz e vá acrescentando caldo aos poucos, mexendo até cremar. Finalize com queijo." },
  { id: 10, name: "Tapioca recheada", time: "10 min", ingredients: ["goma de tapioca", "queijo", "presunto", "orégano"], steps: "Espalhe a goma numa frigideira quente, deixe firmar, adicione o recheio, dobre ao meio e sirva." },
  { id: 11, name: "Ovos mexidos com legumes", time: "10 min", ingredients: ["ovo", "tomate", "cebola", "azeite"], steps: "Refogue cebola e tomate picados no azeite, adicione os ovos batidos e mexa em fogo baixo até cozinhar." },
  { id: 12, name: "Feijão rápido na pressão", time: "25 min", ingredients: ["feijão", "alho", "cebola", "louro"], steps: "Refogue alho e cebola, adicione o feijão já de molho e água, cozinhe na panela de pressão por 15 min com a folha de louro." },
  { id: 13, name: "Escondidinho de frango rápido", time: "30 min", ingredients: ["frango", "batata", "queijo", "cebola"], steps: "Faça um purê de batata, misture o frango desfiado refogado com cebola numa camada, cubra com purê e queijo, gratine no forno." },
  { id: 14, name: "Salada de macarrão fria", time: "20 min", ingredients: ["macarrão", "milho", "tomate", "atum", "maionese"], steps: "Cozinhe o macarrão, esfrie, misture com milho, tomate picado, atum e maionese. Sirva gelado." },
  { id: 15, name: "Panqueca americana simples", time: "15 min", ingredients: ["farinha", "ovo", "leite", "fermento", "açúcar"], steps: "Misture todos os ingredientes até formar massa homogênea, frite porções pequenas em frigideira antiaderente até bolhar e virar." },
];

const TABS = [
  { key: "financas", label: "Finanças", icon: Wallet, color: COLORS.teal },
  { key: "receitas", label: "Receitas", icon: ChefHat, color: COLORS.ochreDark },
  { key: "dicas", label: "Dicas", icon: Lightbulb, color: COLORS.brick },
];

function currency(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------- Finanças ----------
const CATEGORIES = [
  { key: "guardar", label: "Guardar", sub: "poupança / reserva", icon: PiggyBank, color: COLORS.teal },
  { key: "investir", label: "Investir", sub: "fazer o dinheiro render", icon: TrendingUp, color: COLORS.ochreDark },
  { key: "mercado", label: "Mercado", sub: "compras do mês", icon: ShoppingCart, color: COLORS.ink },
  { key: "lazer", label: "Lazer", sub: "sem culpa, já tá no plano", icon: PartyPopper, color: COLORS.brick },
];

function calcularPercentuais(saldoNum) {
  if (saldoNum <= 1500) return { guardar: 10, investir: 5, mercado: 35, lazer: 8 };
  if (saldoNum <= 3000) return { guardar: 15, investir: 10, mercado: 30, lazer: 12 };
  if (saldoNum <= 6000) return { guardar: 20, investir: 15, mercado: 25, lazer: 15 };
  return { guardar: 25, investir: 20, mercado: 20, lazer: 15 };
}

function FinancasTab() {
  const [saldo, setSaldo] = useState("3000");
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await storageGet("saldo_mensal");
        if (r && r.value) setSaldo(r.value);
      } catch (e) {
        // sem valor salvo ainda, mantém o padrão
      }
      setCarregado(true);
    })();
  }, []);

  useEffect(() => {
    if (!carregado) return;
    storageSet("saldo_mensal", saldo).catch(() => {});
  }, [saldo, carregado]);

  const saldoNum = parseFloat(saldo.replace(",", ".")) || 0;
  const pcts = useMemo(() => calcularPercentuais(saldoNum), [saldoNum]);
  const totalPct = Object.values(pcts).reduce((a, b) => a + b, 0);
  const sobraPct = Math.max(0, 100 - totalPct);
  const sobraValor = (saldoNum * sobraPct) / 100;

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <label
          style={{
            display: "block",
            fontSize: 12,
            color: COLORS.inkSoft,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Quanto você tem esse mês?
        </label>
        <input
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          placeholder="0"
          style={{
            ...inputStyle,
            width: "100%",
            fontSize: 26,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            color: COLORS.ink,
            padding: "12px 14px",
          }}
        />
      </div>

      <p
        style={{
          fontSize: 14,
          color: COLORS.ink,
          background: "#FBF8EF",
          border: `1px solid ${COLORS.line}`,
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 16,
          lineHeight: 1.6,
        }}
      >
        Com <b>{currency(saldoNum)}</b>, o plano calculado é: <b>{pcts.guardar}%</b> pra guardar,{" "}
        <b>{pcts.investir}%</b> pra investir, <b>{pcts.mercado}%</b> pro mercado e{" "}
        <b>{pcts.lazer}%</b> pro lazer.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const valor = (saldoNum * (pcts[c.key] || 0)) / 100;
          return (
            <div
              key={c.key}
              style={{
                background: COLORS.paperDark,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: c.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color={COLORS.paper} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft }}>{c.sub}</div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: c.color,
                  marginBottom: 4,
                }}
              >
                {currency(valor)}
              </div>

              <div style={{ fontSize: 12, color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
                {pcts[c.key]}% do mês · calculado pelo app
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderRadius: 10,
          background: totalPct > 100 ? "#F3E2DE" : COLORS.paperDark,
          border: `1px solid ${totalPct > 100 ? COLORS.brick : COLORS.line}`,
        }}
      >
        <span style={{ fontSize: 13, color: COLORS.inkSoft }}>
          {totalPct > 100 ? "Suas fatias somam mais que o saldo total" : "Sobra livre (contas fixas, imprevistos...)"}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            color: totalPct > 100 ? COLORS.brick : COLORS.ink,
          }}
        >
          {totalPct > 100 ? `${totalPct - 100}% a mais` : `${currency(sobraValor)} (${sobraPct}%)`}
        </span>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${COLORS.line}`,
  background: "#FBF8EF",
  color: COLORS.ink,
  fontSize: 14,
  outline: "none",
  flex: "1 1 140px",
  minWidth: 100,
};

function btnStyle(bg) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 16px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color: "#FBF8EF",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  };
}

// ---------- Receitas ----------
function ReceitasTab() {
  const [query, setQuery] = useState("");
  const [iaInput, setIaInput] = useState("");
  const [iaResultado, setIaResultado] = useState(null);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaErro, setIaErro] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return RECIPES;
    const q = query.toLowerCase();
    return RECIPES.filter((r) => r.ingredients.some((i) => i.includes(q)) || r.name.toLowerCase().includes(q));
  }, [query]);

  async function buscarComIA() {
    if (!iaInput.trim()) return;
    setIaLoading(true);
    setIaErro(null);
    setIaResultado(null);
    try {
      // Chama nossa função serverless (api/buscar-receita.js), que guarda a
      // chave da IA em segredo no servidor em vez de expor no navegador.
      const response = await fetch("/api/buscar-receita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientes: iaInput }),
      });
      const parsed = await response.json();
      if (!response.ok || parsed.error) throw new Error(parsed.error || "Falha na busca");
      setIaResultado(parsed);
    } catch (e) {
      setIaErro("Não consegui buscar agora. Tenta de novo em instantes.");
    } finally {
      setIaLoading(false);
    }
  }

  return (
    <div>
      <input
        placeholder="O que você tem na geladeira? (ex: ovo, frango, alho...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ ...inputStyle, width: "100%", marginBottom: 14 }}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
          padding: "12px 14px",
          background: "#FBF8EF",
          border: `1px dashed ${COLORS.line}`,
          borderRadius: 10,
        }}
      >
        <Sparkles size={16} color={COLORS.ochreDark} style={{ flexShrink: 0 }} />
        <input
          placeholder="Não achou nada? Busque na internet com IA (ex: abobrinha, ovo)"
          value={iaInput}
          onChange={(e) => setIaInput(e.target.value)}
          style={{ ...inputStyle, background: "#fff" }}
        />
        <button onClick={buscarComIA} disabled={iaLoading} style={btnStyle(COLORS.ochreDark)}>
          {iaLoading ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
          {iaLoading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {iaErro && <p style={{ color: COLORS.brick, fontSize: 13, marginBottom: 16 }}>{iaErro}</p>}

      {iaResultado && (
        <div
          style={{
            background: "#FBF3E9",
            border: `1px solid ${COLORS.ochreDark}`,
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Sparkles size={13} color={COLORS.ochreDark} />
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: COLORS.ochreDark,
                fontWeight: 700,
              }}
            >
              Encontrado na internet
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: COLORS.ink, fontWeight: 700 }}>{iaResultado.name}</h3>
            <span style={{ fontSize: 12, color: COLORS.ochreDark, fontFamily: "'IBM Plex Mono', monospace" }}>
              {iaResultado.time}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {(iaResultado.ingredients || []).map((i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "#fff",
                  border: `1px solid ${COLORS.line}`,
                  color: COLORS.inkSoft,
                }}
              >
                {i}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0, lineHeight: 1.5 }}>{iaResultado.steps}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {filtered.map((r) => (
          <div
            key={r.id}
            style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: COLORS.ink, fontWeight: 700 }}>{r.name}</h3>
              <span style={{ fontSize: 12, color: COLORS.ochreDark, fontFamily: "'IBM Plex Mono', monospace" }}>
                {r.time}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {r.ingredients.map((i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: "#FBF8EF",
                    border: `1px solid ${COLORS.line}`,
                    color: COLORS.inkSoft,
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0, lineHeight: 1.5 }}>{r.steps}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: COLORS.inkSoft, fontStyle: "italic" }}>Nenhuma receita encontrada com esses ingredientes.</p>
        )}
      </div>
    </div>
  );
}

// ---------- Dicas ----------
function DicasTab() {
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const featured = TIPS[tipIndex];
  const rest = TIPS.filter((t) => t.id !== featured.id);

  return (
    <div>
      <div style={{ background: COLORS.brick, borderRadius: 12, padding: "20px 22px", marginBottom: 22, position: "relative" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F0D9C9" }}>
          Dica do dia · {featured.cat}
        </span>
        <p style={{ fontSize: 17, color: "#FBF3E9", margin: "8px 0 0", fontWeight: 500, lineHeight: 1.5 }}>
          {featured.text}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rest.map((t) => (
          <div
            key={t.id}
            style={{ display: "flex", gap: 12, padding: "12px 14px", background: COLORS.paperDark, borderRadius: 8, border: `1px solid ${COLORS.line}` }}
          >
            <span
              style={{ fontSize: 11, fontWeight: 700, color: COLORS.ochreDark, minWidth: 60, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              {t.cat}
            </span>
            <span style={{ fontSize: 13.5, color: COLORS.ink, lineHeight: 1.5 }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Capa ----------
const PIX_KEY = "renancasa9z@gmail.com";

function Capa({ onEntrar }) {
  const [etapa, setEtapa] = useState("intro"); // intro | pagamento
  const [copiado, setCopiado] = useState(false);

  const features = [
    { icon: Wallet, color: COLORS.teal, title: "Finanças", desc: "diga seu saldo e veja quanto guardar, investir e gastar" },
    { icon: ChefHat, color: COLORS.ochreDark, title: "Receitas", desc: "pelos ingredientes que você tem em casa, ou buscando na internet" },
    { icon: Lightbulb, color: COLORS.brick, title: "Dicas", desc: "truques rápidos pra casa, tempo, dinheiro e saúde" },
  ];

  function copiarChave() {
    try {
      navigator.clipboard.writeText(PIX_KEY);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      // clipboard indisponível, usuário copia manualmente
    }
  }

  if (etapa === "pagamento") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.ink,
          fontFamily: "'Inter', system-ui, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "32px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ background: COLORS.paper, borderRadius: 14, padding: 22 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, color: COLORS.ink, fontFamily: "'Lora', Georgia, serif" }}>
              Pagar com Pix
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>
              Pague <b>R$ 9,90</b> na chave abaixo. Depois é só confirmar que o Pix caiu pra liberar seu acesso.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                background: "#FBF8EF",
                border: `1px solid ${COLORS.line}`,
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, color: COLORS.ink, wordBreak: "break-all" }}>
                {PIX_KEY}
              </span>
              <button onClick={copiarChave} style={{ ...btnStyle(COLORS.ochreDark), padding: "6px 10px", fontSize: 12, flexShrink: 0 }}>
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>

            <button
              onClick={onEntrar}
              style={{ ...btnStyle(COLORS.ink), width: "100%", justifyContent: "center", padding: "12px 16px", fontSize: 15, marginBottom: 10 }}
            >
              Já fiz o Pix, liberar acesso
            </button>
            <button
              onClick={() => setEtapa("intro")}
              style={{ width: "100%", background: "none", border: "none", color: COLORS.inkSoft, fontSize: 12.5, cursor: "pointer", padding: 4 }}
            >
              Voltar
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#9CA6B5" }}>
            Confirmação manual por enquanto — o acesso libera assim que você confirmar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.ink,
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div
          style={{ width: 56, height: 56, borderRadius: 14, background: COLORS.ochre, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}
        >
          <Wallet size={28} color={COLORS.ink} />
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 34, color: COLORS.paper, fontFamily: "'Lora', Georgia, serif", fontWeight: 700 }}>
          Dia a Dia
        </h1>
        <p style={{ margin: "0 0 32px", color: "#B9C0CC", fontSize: 14.5, lineHeight: 1.6 }}>
          O caderno digital que organiza seu dinheiro, sua cozinha e seus truques do dia a dia — num só lugar.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, textAlign: "left" }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 12, background: "#28344A", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={17} color={COLORS.paper} />
                </div>
                <div>
                  <div style={{ color: COLORS.paper, fontWeight: 700, fontSize: 14 }}>{f.title}</div>
                  <div style={{ color: "#9CA6B5", fontSize: 12.5 }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: COLORS.paper, borderRadius: 14, padding: "20px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: COLORS.ink, fontFamily: "'IBM Plex Mono', monospace" }}>R$ 9,90</span>
            <span style={{ fontSize: 13, color: COLORS.inkSoft }}>/mês</span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: COLORS.inkSoft }}>ou R$ 89/ano (equivale a 2 meses grátis)</p>
          <button
            onClick={() => setEtapa("pagamento")}
            style={{ ...btnStyle(COLORS.ink), width: "100%", justifyContent: "center", padding: "12px 16px", fontSize: 15 }}
          >
            Pagar com Pix e começar
          </button>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: COLORS.inkSoft, opacity: 0.8 }}>Cancele quando quiser, sem burocracia.</p>
        </div>
      </div>
    </div>
  );
}

// ---------- App shell ----------
export default function DiaADiaApp() {
  const [tela, setTela] = useState("carregando"); // carregando | capa | app
  const [active, setActive] = useState("financas");
  const ActiveIcon = TABS.find((t) => t.key === active).icon;

  useEffect(() => {
    (async () => {
      try {
        const r = await storageGet("acesso");
        setTela(r && r.value === "liberado" ? "app" : "capa");
      } catch (e) {
        setTela("capa");
      }
    })();
  }, []);

  async function liberarAcesso() {
    try {
      await storageSet("acesso", "liberado");
    } catch (e) {
      // segue mesmo se não conseguir salvar
    }
    setTela("app");
  }

  if (tela === "carregando") {
    return <div style={{ minHeight: "100vh", background: COLORS.ink }} />;
  }

  if (tela === "capa") {
    return <Capa onEntrar={liberarAcesso} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.paper, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", justifyContent: "center", padding: "32px 16px" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
      <div style={{ width: "100%", maxWidth: 760 }}>
        <header style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ActiveIcon size={18} color={COLORS.paper} />
            </div>
            <h1 style={{ margin: 0, fontSize: 26, color: COLORS.ink, fontFamily: "'Lora', Georgia, serif", fontWeight: 700 }}>Dia a Dia</h1>
          </div>
          <p style={{ margin: 0, color: COLORS.inkSoft, fontSize: 13.5, paddingLeft: 44 }}>
            Seu caderno de organização: dinheiro, comida e truques rápidos, num só lugar.
          </p>
        </header>

        <div style={{ display: "flex", gap: 4, marginBottom: 0 }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "10px 10px 0 0",
                  background: isActive ? COLORS.paperDark : "transparent",
                  color: isActive ? COLORS.ink : COLORS.inkSoft,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13.5,
                  cursor: "pointer",
                  borderBottom: isActive ? `2px solid ${t.color}` : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        <main style={{ background: COLORS.paperDark, borderRadius: "0 10px 10px 10px", padding: 22, border: `1px solid ${COLORS.line}`, borderTop: "none" }}>
          {active === "financas" && <FinancasTab />}
          {active === "receitas" && <ReceitasTab />}
          {active === "dicas" && <DicasTab />}
        </main>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 11.5, color: COLORS.inkSoft, opacity: 0.7 }}>
          Dia a Dia · seus dados ficam salvos neste navegador
        </p>
      </div>
    </div>
  );
}
