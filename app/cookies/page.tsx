import LegalPage from "../components/LegalPage";

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Transparência digital"
      title="Política de Cookies"
      intro="Esta página explica o uso de cookies, armazenamento local e tecnologias semelhantes no site da campanha."
    >
      <p><strong>Última atualização: 15 de agosto de 2026.</strong></p>

      <h2>1. O que são cookies</h2>
      <p>Cookies são pequenos arquivos ou identificadores armazenados no navegador para lembrar preferências, manter funcionalidades e ajudar na segurança. Tecnologias semelhantes podem incluir armazenamento local, tags e registros técnicos do servidor.</p>

      <h2>2. Como o site funciona hoje</h2>
      <p>Na versão atual, o site não utiliza cookies próprios de publicidade, remarketing, analytics ou perfilamento comportamental. Não usamos cookies para criar segmentos de eleitoras e eleitores, fazer microdirecionamento político ou vender informações.</p>
      <p>Alguns recursos técnicos da hospedagem, do navegador, do WhatsApp e do widget oficial VLibras podem usar identificadores ou armazenamentos próprios para funcionamento, segurança e entrega do serviço. Esses recursos são regidos também pelas políticas de cada fornecedor.</p>

      <h2>3. Categorias possíveis</h2>
      <ul>
        <li><strong>Necessários:</strong> recursos essenciais para carregar páginas, proteger o serviço, manter a sessão e evitar abuso.</li>
        <li><strong>Funcionais:</strong> recursos que lembram preferências ou ajudam a executar acessibilidade, como a inicialização do VLibras.</li>
        <li><strong>Análise e publicidade:</strong> não estão ativados nesta versão. Se forem adicionados, esta página será atualizada e serão apresentados controles adequados antes da ativação, quando exigido.</li>
      </ul>

      <h2>4. Como controlar</h2>
      <p>A pessoa pode bloquear ou apagar cookies nas configurações do navegador. O bloqueio de recursos necessários pode afetar o funcionamento de algumas partes do site. Ao abrir o WhatsApp ou outro serviço externo, também é preciso consultar os controles e políticas daquele serviço.</p>

      <h2>5. Mudanças futuras</h2>
      <p>Se a campanha passar a usar métricas, formulários persistentes, anúncios, integrações de CRM ou qualquer cookie não necessário, esta política será revisada antes da nova finalidade entrar em funcionamento.</p>

      <h2>6. Contato</h2>
      <p>Para dúvidas sobre cookies e tecnologias semelhantes, escreva para <a href="mailto:psdbpaestadual@gmail.com">psdbpaestadual@gmail.com</a>.</p>
    </LegalPage>
  );
}
