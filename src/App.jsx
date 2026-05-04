import React, { useState, useEffect, useRef, useCallback } from "react";

// ── ICONS (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ d, size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d={d} />
  </svg>
);
const SearchIcon = (p) => <Icon {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const MapPinIcon = (p) => <Icon {...p} d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />;
const CalIcon = (p) => <Icon {...p} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />;
const SendIcon = (p) => <Icon {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />;
const BotIcon = (p) => <Icon {...p} d="M12 8V4H8M4 8a4 4 0 0 0 0 8h1v3l3-3h6l3 3v-3h1a4 4 0 0 0 0-8H4zM9 12h.01M15 12h.01" />;
const XIcon = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />;
const PlusIcon = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const EditIcon = (p) => <Icon {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const TrashIcon = (p) => <Icon {...p} d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />;
const UploadIcon = (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const MegaphoneIcon = (p) => <Icon {...p} d="M3 11l19-9-9 19-2-8-8-2z" />;
const HomeIcon = (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10" />;
const UsersIcon = (p) => <Icon {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const PhoneIcon = (p) => <Icon {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4 19.79 19.79 0 0 1 1.61 4.82 2 2 0 0 1 3.6 2.64h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.3a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18l.19-.08z" />;
const ShieldIcon = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const InstagramIcon = (p) => <Icon {...p} d="M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM17.5 6.5h.01" />;
const CheckIcon = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
const AlertIcon = (p) => <Icon {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
const ImageIcon = (p) => <Icon {...p} d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" />;
const MessageIcon = (p) => <Icon {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;

// ── LANGUAGE SYSTEM ──────────────────────────────────────────────────────────
const { createContext, useContext } = React;

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ht', label: 'Kreyòl', flag: '🇭🇹' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'so', label: 'Soomaali', flag: '🇸🇴' },
];

const UI = {
  en: { home:'Home',gallery:'Gallery',report:'Report',legal:'Legal Guide',contact:'Contact',adminLogin:'Admin Login',admin:'ADMIN',signOut:'Sign out',heroTitle:'First steps to finding your',heroTitleEm:'loved one.',heroSub:'In moments of uncertainty, we provide a structured, empathetic path forward. Every second counts.',reportBtn:'Report Missing Person',galleryBtn:'View Gallery',noWait:'You do NOT need to wait 24 hours to report a missing person.',noWaitSub:'If someone is missing or in danger, contact law enforcement immediately.',reportCase:'Report a Case',reportDesc:'Submit a missing person report directly to our network.',browseCases:'Browse Cases',browseDesc:'View active missing persons and share vital information.',tipLine:'Tip Line',tipDesc:'470-294-2438 — Anonymous tips welcome, 24/7.',followUs:'Follow Us',followDesc:'@pleaselookforme on Instagram for latest alerts.',legalGuide:'Legal Guide',legalDesc:'State laws, scripts & your rights when reporting.',galleryTitle:'Digital Vigil for the',galleryTitleEm:'Missing',gallerySub:'Browse active cases, share information, or report a sighting. Together, we bring them home.',searchPlaceholder:'Search by name or location...',allCases:'All Cases',contactTitle:'Contact Us',contactSub:"We're here to help. Reach out through any of the channels below.",broadcastTitle:'Broadcast a Missing Person',broadcastSub:'Fill out the form to add this case to the public gallery.',backHome:'← Back to Home',addManage:'Add / Manage Cases',broadcasting:'Broadcasting...',adminAccess:'Admin Access Required',caseSubmitted:'Case Submitted',redirecting:'Redirecting to gallery...',email:'Email',instagram:'Instagram' },
  es: { home:'Inicio',gallery:'Galería',report:'Reportar',legal:'Guía Legal',contact:'Contacto',adminLogin:'Admin',admin:'ADMIN',signOut:'Salir',heroTitle:'Primeros pasos para encontrar a tu',heroTitleEm:'ser querido.',heroSub:'En momentos de incertidumbre, ofrecemos un camino estructurado. Cada segundo cuenta.',reportBtn:'Reportar Persona Desaparecida',galleryBtn:'Ver Galería',noWait:'NO necesitas esperar 24 horas para reportar.',noWaitSub:'Si alguien está en peligro, contacta a las autoridades de inmediato.',reportCase:'Reportar un Caso',reportDesc:'Envía un reporte a nuestra red.',browseCases:'Ver Casos',browseDesc:'Mira casos activos y comparte información.',tipLine:'Línea de Información',tipDesc:'470-294-2438 — Avisos anónimos, 24/7.',followUs:'Síguenos',followDesc:'@pleaselookforme en Instagram.',legalGuide:'Guía Legal',legalDesc:'Leyes estatales, guiones y tus derechos.',galleryTitle:'Vigilia Digital por los',galleryTitleEm:'Desaparecidos',gallerySub:'Busca casos, comparte información o reporta un avistamiento.',searchPlaceholder:'Buscar por nombre o ubicación...',allCases:'Todos los Casos',contactTitle:'Contáctenos',contactSub:'Estamos aquí para ayudar.',broadcastTitle:'Difundir Desaparecido',broadcastSub:'Complete el formulario para agregar este caso.',backHome:'← Volver',addManage:'Agregar / Gestionar',broadcasting:'Enviando...',adminAccess:'Acceso Admin Requerido',caseSubmitted:'Caso Enviado',redirecting:'Redirigiendo...',email:'Correo',instagram:'Instagram' },
  fr: { home:'Accueil',gallery:'Galerie',report:'Signaler',legal:'Guide Légal',contact:'Contact',adminLogin:'Admin',admin:'ADMIN',signOut:'Déconnexion',heroTitle:'Premiers pas pour retrouver votre',heroTitleEm:'proche.',heroSub:"Dans les moments d'incertitude, nous offrons un chemin structuré. Chaque seconde compte.",reportBtn:'Signaler une Disparition',galleryBtn:'Voir la Galerie',noWait:"Vous n'avez PAS besoin d'attendre 24 heures.",noWaitSub:"Si quelqu'un est en danger, contactez les forces de l'ordre immédiatement.",reportCase:'Signaler un Cas',reportDesc:'Soumettez un rapport à notre réseau.',browseCases:'Voir les Cas',browseDesc:'Consultez les cas actifs et partagez des informations.',tipLine:"Ligne d'Information",tipDesc:'470-294-2438 — Signalements anonymes, 24h/24.',followUs:'Suivez-nous',followDesc:'@pleaselookforme sur Instagram.',legalGuide:'Guide Légal',legalDesc:'Lois, scripts et vos droits.',galleryTitle:'Veillée Numérique pour les',galleryTitleEm:'Disparus',gallerySub:'Parcourez les cas actifs ou signalez une observation.',searchPlaceholder:'Rechercher par nom ou lieu...',allCases:'Tous les Cas',contactTitle:'Contactez-nous',contactSub:'Nous sommes là pour vous aider.',broadcastTitle:'Diffuser une Disparition',broadcastSub:'Remplissez le formulaire pour ajouter ce cas.',backHome:"← Retour",addManage:'Ajouter / Gérer',broadcasting:'Envoi...',adminAccess:'Accès Admin Requis',caseSubmitted:'Cas Soumis',redirecting:'Redirection...',email:'Email',instagram:'Instagram' },
  ht: { home:'Akey',gallery:'Galri',report:'Rapòte',legal:'Gid Legal',contact:'Kontak',adminLogin:'Admin',admin:'ADMIN',signOut:'Soti',heroTitle:'Premye etap pou jwenn',heroTitleEm:'moun ou renmen an.',heroSub:'Nan moman ensètitid, nou bay yon chemen klè. Chak segond konte.',reportBtn:'Rapòte Moun Disparèt',galleryBtn:'Wè Galri a',noWait:'Ou PA bezwen tann 24 èdtan pou rapòte.',noWaitSub:'Si yon moun an danje, kontakte lapolis touswit.',reportCase:'Rapòte yon Ka',reportDesc:'Soumèt yon rapò bay rezo nou an.',browseCases:'Wè Ka yo',browseDesc:'Gade ka aktif yo epi pataje enfòmasyon.',tipLine:'Liny Enfòmasyon',tipDesc:'470-294-2438 — Enfòmasyon anonim, 24/7.',followUs:'Swiv Nou',followDesc:'@pleaselookforme sou Instagram.',legalGuide:'Gid Legal',legalDesc:'Lwa eta, skript ak dwa w.',galleryTitle:'Vèy Dijital pou',galleryTitleEm:'Moun Disparèt yo',gallerySub:'Gade ka aktif yo oswa rapòte yon obsèvasyon.',searchPlaceholder:'Chèche pa non oswa kote...',allCases:'Tout Ka yo',contactTitle:'Kontakte Nou',contactSub:'Nou la pou ede w.',broadcastTitle:'Difize Moun Disparèt',broadcastSub:'Ranpli fòm nan pou ajoute ka sa.',backHome:'← Retounen',addManage:'Ajoute / Jere',broadcasting:'Ap voye...',adminAccess:'Aksè Admin Nesesè',caseSubmitted:'Ka Soumèt',redirecting:'Ap redirije...',email:'Imèl',instagram:'Instagram' },
  pt: { home:'Início',gallery:'Galeria',report:'Reportar',legal:'Guia Legal',contact:'Contato',adminLogin:'Admin',admin:'ADMIN',signOut:'Sair',heroTitle:'Primeiros passos para encontrar seu',heroTitleEm:'ente querido.',heroSub:'Em momentos de incerteza, oferecemos um caminho estruturado. Cada segundo conta.',reportBtn:'Reportar Desaparecido',galleryBtn:'Ver Galeria',noWait:'Você NÃO precisa esperar 24 horas para reportar.',noWaitSub:'Se alguém estiver em perigo, contate as autoridades imediatamente.',reportCase:'Reportar um Caso',reportDesc:'Envie um relatório à nossa rede.',browseCases:'Ver Casos',browseDesc:'Veja casos ativos e compartilhe informações.',tipLine:'Linha de Informação',tipDesc:'470-294-2438 — Denúncias anônimas, 24h.',followUs:'Siga-nos',followDesc:'@pleaselookforme no Instagram.',legalGuide:'Guia Legal',legalDesc:'Leis estaduais, scripts e seus direitos.',galleryTitle:'Vigília Digital pelos',galleryTitleEm:'Desaparecidos',gallerySub:'Veja casos ativos ou reporte um avistamento.',searchPlaceholder:'Buscar por nome ou local...',allCases:'Todos os Casos',contactTitle:'Entre em Contato',contactSub:'Estamos aqui para ajudar.',broadcastTitle:'Divulgar Desaparecido',broadcastSub:'Preencha o formulário para adicionar este caso.',backHome:'← Voltar',addManage:'Adicionar / Gerenciar',broadcasting:'Enviando...',adminAccess:'Acesso Admin Necessário',caseSubmitted:'Caso Enviado',redirecting:'Redirecionando...',email:'Email',instagram:'Instagram' },
  zh: { home:'首页',gallery:'图库',report:'举报',legal:'法律指南',contact:'联系我们',adminLogin:'管理员',admin:'管理员',signOut:'退出',heroTitle:'寻找您',heroTitleEm:'亲人的第一步。',heroSub:'在不确定的时刻，我们提供有条理的前进路径。每一秒都很重要。',reportBtn:'举报失踪人员',galleryBtn:'查看图库',noWait:'举报失踪人员无需等待24小时。',noWaitSub:'如有人失踪或处于危险中，请立即联系执法部门。',reportCase:'举报案例',reportDesc:'向我们的网络提交失踪人员报告。',browseCases:'浏览案例',browseDesc:'查看活跃案例并分享信息。',tipLine:'举报热线',tipDesc:'470-294-2438 — 接受匿名举报，24小时。',followUs:'关注我们',followDesc:'Instagram @pleaselookforme。',legalGuide:'法律指南',legalDesc:'州法律、脚本及您的报告权利。',galleryTitle:'失踪人员',galleryTitleEm:'数字守望',gallerySub:'浏览活跃案例，或举报目击情况。',searchPlaceholder:'按姓名或地点搜索...',allCases:'所有案例',contactTitle:'联系我们',contactSub:'我们随时为您提供帮助。',broadcastTitle:'发布失踪人员信息',broadcastSub:'填写表格将此案例添加到图库。',backHome:'← 返回首页',addManage:'添加/管理案例',broadcasting:'发布中...',adminAccess:'需要管理员权限',caseSubmitted:'案例已提交',redirecting:'正在跳转...',email:'电子邮件',instagram:'Instagram' },
  ar: { home:'الرئيسية',gallery:'المعرض',report:'إبلاغ',legal:'الدليل القانوني',contact:'اتصل بنا',adminLogin:'مدير',admin:'مدير',signOut:'خروج',heroTitle:'الخطوات الأولى للعثور على',heroTitleEm:'أحبائك.',heroSub:'في أوقات عدم اليقين، نوفر مساراً منظماً. كل ثانية تهم.',reportBtn:'الإبلاغ عن مفقود',galleryBtn:'عرض المعرض',noWait:'لا تحتاج إلى الانتظار 24 ساعة للإبلاغ عن مفقود.',noWaitSub:'إذا كان شخص ما في خطر، اتصل بالسلطات فوراً.',reportCase:'الإبلاغ عن حالة',reportDesc:'أرسل تقرير مفقود إلى شبكتنا.',browseCases:'تصفح الحالات',browseDesc:'شاهد الحالات النشطة وشارك المعلومات.',tipLine:'خط المعلومات',tipDesc:'470-294-2438 — بلاغات مجهولة 24/7.',followUs:'تابعنا',followDesc:'@pleaselookforme على إنستغرام.',legalGuide:'الدليل القانوني',legalDesc:'قوانين الولاية والنصوص وحقوقك.',galleryTitle:'سهر رقمي على',galleryTitleEm:'المفقودين',gallerySub:'تصفح الحالات النشطة أو أبلغ عن مشاهدة.',searchPlaceholder:'بحث بالاسم أو المكان...',allCases:'جميع الحالات',contactTitle:'اتصل بنا',contactSub:'نحن هنا للمساعدة.',broadcastTitle:'نشر معلومات مفقود',broadcastSub:'أكمل النموذج لإضافة هذه الحالة.',backHome:'← العودة',addManage:'إضافة / إدارة',broadcasting:'جارٍ الإرسال...',adminAccess:'صلاحية المدير مطلوبة',caseSubmitted:'تم تقديم الحالة',redirecting:'جارٍ التحويل...',email:'البريد الإلكتروني',instagram:'إنستغرام' },
  so: { home:'Bogga Hore',gallery:'Sawirrada',report:'Soo Gudbi',legal:'Hagaha Sharciga',contact:'Nala Xiriir',adminLogin:'Maamulaha',admin:'MAAMUL',signOut:'Ka Bax',heroTitle:'Tallaabadii ugu horreysa ee helitaanka',heroTitleEm:'qofka aad jeceshahay.',heroSub:'Xiliyada aan la hubin, waxaan bixinaa jid habaysan. Daqiiqad kasta way muhiim tahay.',reportBtn:'Soo Gudbi Qof La Waayey',galleryBtn:'Arag Sawirrada',noWait:'MA u baahna inaad sugto 24 saacadood.',noWaitSub:'Haddii qof halis ku jiro, la xiriir booliska isla markiiba.',reportCase:'Soo Gudbi Xaaladda',reportDesc:'Soo gudbi warbixin shabakadayada.',browseCases:'Arag Xaaladaha',browseDesc:'Arag xaaladaha firfircoon oo wadaag macluumaadka.',tipLine:'Khadka Macluumaadka',tipDesc:'470-294-2438 — Macluumaad qarsoodi, 24/7.',followUs:'Na Raac',followDesc:'@pleaselookforme Instagram-ka.',legalGuide:'Hagaha Sharciga',legalDesc:'Sharciyada gobolka iyo xuquuqahaaga.',galleryTitle:'Ilaalinta Dhijitaalka ah ee',galleryTitleEm:'Dadka La Waayey',gallerySub:'Baadh xaaladaha ama soo gudbi aragti.',searchPlaceholder:'Raadi magaca ama meesha...',allCases:'Dhammaan Xaaladaha',contactTitle:'Nala Xiriir',contactSub:'Waxaan halkan u joogaa inaan kaalmeyno.',broadcastTitle:'Faafi Qof La Waayey',broadcastSub:'Buuxi foomka si aad u ku darto xaaladdan.',backHome:'← Ku Noqo',addManage:'Kudar / Maamul',broadcasting:'Waa la dirayo...',adminAccess:'Oggolaanshaha Maamulaha Waa Lagama Maarmaan',caseSubmitted:'Xaaladda Waa La Diray',redirecting:'Waa la wareejinayaa...',email:'Iimayl',instagram:'Instagram' },
};

const LangContext = React.createContext({ lang: 'en', t: (k) => k });
const useLang = () => React.useContext(LangContext);

function LanguageSwitcher({ lang, setLang }) {
  const [open, setOpen] = React.useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: '#f0ebff', border: '1px solid #c4b5fd', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#4f1c9e' }}>
        <span style={{ fontSize: 15 }}>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 2000, minWidth: 160, overflow: 'hidden' }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: lang === l.code ? '#f0ebff' : '#fff', color: lang === l.code ? '#4f1c9e' : '#374151', fontSize: 13, fontWeight: lang === l.code ? 700 : 500, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 16 }}>{l.flag}</span>
              {l.label}
              {lang === l.code && <span style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: 12 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const ADMIN_EMAILS = ["pleaselookformeatl@gmail.com", "reesegannon05@gmail.com"];

const SAMPLE_CASES = [
  { id: "s1", name: "Relisha Rudd", age: 18, gender: "Female", description: "Missing since age 8. Last seen at a shelter in Washington D.C. Brown eyes, black hair. This is a spotlight case.", lastSeenDate: "March 1, 2014", lastSeenLocation: "Washington, D.C.", photoUrl: "https://www.fbi.gov/wanted/kidnap/relisha-tenay-rudd/@@images/image", status: "active", missingSince: "10+ YEARS", isStatic: true },
  { id: "s2", name: "Sebastian Rogers", age: 15, gender: "Male", description: "5'5\", 120 lbs. Light brown hair, glasses. Autistic. Last seen wearing black sweatpants and sweatshirt.", lastSeenDate: "Feb 26, 2024", lastSeenLocation: "Hendersonville, TN", photoUrl: "https://api.missingkids.org/photographs/NCMC1495914c1.jpg", status: "amber", missingSince: "1 YEAR+", isStatic: true },
  { id: "s3", name: "Arianna Fitts", age: 10, gender: "Female", description: "Missing since age 2. Brown hair, brown eyes. Last seen with mother.", lastSeenDate: "April 1, 2016", lastSeenLocation: "San Francisco, CA", photoUrl: "https://api.missingkids.org/photographs/NCMC1266042c1.jpg", status: "active", missingSince: "8+ YEARS", isStatic: true },
  { id: "s4", name: "Summer Wells", age: 8, gender: "Female", description: "Blonde hair, blue eyes. Last seen outside her home in Rogersville.", lastSeenDate: "June 15, 2021", lastSeenLocation: "Rogersville, TN", photoUrl: "https://api.missingkids.org/photographs/NCMC1422778c1.jpg", status: "active", missingSince: "3+ YEARS", isStatic: true },
  { id: "s5", name: "Asha Degree", age: 33, gender: "Female", description: "Missing since age 9. Left her house in the middle of the night during a storm.", lastSeenDate: "Feb 14, 2000", lastSeenLocation: "Shelby, NC", photoUrl: "https://www.fbi.gov/wanted/kidnap/asha-jaquilla-degree/@@images/image", status: "active", missingSince: "24+ YEARS", isStatic: true },
];

const STATUS_CONFIG = {
  amber: { label: "Amber Alert", bg: "bg-amber-500", text: "text-amber-900" },
  silver: { label: "Silver Alert", bg: "bg-slate-400", text: "text-slate-900" },
  active: { label: "Active Search", bg: "bg-purple-700", text: "text-white" },
  critical: { label: "Critical", bg: "bg-red-600", text: "text-white" },
};

// ── CHATBOT (Claude-powered) ─────────────────────────────────────────────────
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "I'm your Missing Person Report Guide. **You do not have to wait 24 hours** to report a missing person. If someone is missing or in danger, contact law enforcement immediately.\n\nHow can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: `You are a Missing Person Report Guide for PleaseLookForMe ATL — a community organization helping families find missing loved ones. 

Key info: Tip Line 470-294-2438 | Email pleaselookformeatl@gmail.com | Instagram @pleaselookforme

Rules:
- NEVER tell users to wait 24 hours before reporting. Always encourage immediate reporting.
- Provide compassionate, clear, calm guidance.
- Use markdown for structure (headers, bullet points).
- Keep responses concise but thorough.
- Always end with: "You do not have to wait to report a missing person. Contact law enforcement immediately if someone is in danger."
- If asked about flyers, direct them to our Flyer Tool in the navigation menu.
- Include the tip line 470-294-2438 in relevant responses.`,
          messages: [
            ...messages.filter(m => m.role !== "bot" || messages.indexOf(m) > 0).map(m => ({
              role: m.role === "bot" ? "assistant" : "user",
              content: m.text
            })),
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "I'm having a brief issue. Please call our tip line at 470-294-2438 for immediate help.";
      setMessages(prev => [...prev, { role: "bot", text }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Connection issue. For immediate help, call **470-294-2438**." }]);
    }
    setLoading(false);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h4 key={i} style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 13 }}>{line.slice(4)}</h4>;
      if (line.startsWith('## ')) return <h3 key={i} style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 14 }}>{line.slice(3)}</h3>;
      if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 16, fontSize: 13, listStyleType: 'disc', marginBottom: 2 }}>{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
      const bold = line.replace(/\*\*(.*?)\*\*/g, (_, b) => `<strong>${b}</strong>`);
      return line ? <p key={i} style={{ margin: '3px 0', fontSize: 13 }} dangerouslySetInnerHTML={{ __html: bold }} /> : <br key={i} />;
    });
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(79,28,158,0.4)', color: '#fff' }}>
        {open ? <XIcon size={22} /> : <MessageIcon size={22} />}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 1000, width: 360, height: 500, background: '#fff', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <div style={{ background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BotIcon size={20} /></div>
              <div><div style={{ fontWeight: 700, fontSize: 14 }}>Search Assistant</div><div style={{ fontSize: 10, opacity: 0.8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Powered by Claude AI</div></div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}><XIcon size={18} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role === 'user' ? '#4f1c9e' : '#f3f4f6', color: m.role === 'user' ? '#fff' : '#1f2937' }}>
                  {renderText(m.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '18px 18px 18px 4px', background: '#f3f4f6', color: '#6b7280', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0,1,2].map(n => <span key={n} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', animation: `bounce 1.2s ${n*0.2}s infinite` }} />)}
                  </div>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about reporting, resources..." style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={send} disabled={!input.trim() || loading} style={{ width: 40, height: 40, borderRadius: 12, background: '#4f1c9e', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || loading) ? 0.5 : 1 }}><SendIcon size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </>
  );
}

// ── CASE CARD ────────────────────────────────────────────────────────────────
function CaseCard({ person, isAdmin, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState(`https://images.weserv.nl/?url=${encodeURIComponent(person.photoUrl)}&w=400&h=500&fit=cover`);
  const [imgFailed, setImgFailed] = useState(false);
  const cfg = STATUS_CONFIG[person.status] || STATUS_CONFIG.active;

  return (
    <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e9e3f3', boxShadow: '0 2px 12px rgba(79,28,158,0.06)', transition: 'all 0.25s', cursor: 'default' }} className="case-card">
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#f0ebf8' }}>
        {imgFailed ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0ebf8', color: '#9ca3af' }}>
            <ImageIcon size={40} />
            <span style={{ marginTop: 8, fontSize: 12 }}>Photo unavailable</span>
          </div>
        ) : (
          <img src={imgSrc} alt={person.name} onError={() => { if (!imgFailed) { setImgSrc(`https://picsum.photos/seed/${encodeURIComponent(person.name)}/400/500`); setImgFailed(true); } }} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} className="case-img" referrerPolicy="no-referrer" />
        )}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{ background: cfg.bg.replace('bg-', ''), padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', backdropFilter: 'blur(4px)' }} className={`${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
        </div>
        {isAdmin && (
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
            <button onClick={() => onEdit(person)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f1c9e' }} title="Edit"><EditIcon size={14} /></button>
            <button onClick={() => onDelete(person)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }} title="Delete"><TrashIcon size={14} /></button>
          </div>
        )}
      </div>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 18, margin: 0, color: '#1a0a3c' }}>{person.name}</h3>
            <p style={{ margin: '3px 0 0', color: '#7c3aed', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Missing: {person.missingSince}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '8px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{person.description}</p>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 12 }}><MapPinIcon size={13} />{person.lastSeenLocation}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 12 }}><CalIcon size={13} />Last seen: {person.lastSeenDate}</div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ cases, setCases, onClose }) {
  const EMPTY_FORM = { name: '', age: '', gender: 'Female', description: '', lastSeenDate: '', lastSeenLocation: '', photoUrl: '', status: 'active', missingSince: 'JUST REPORTED' };
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState('import');
  const [imgPreview, setImgPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ncmecUrl, setNcmecUrl] = useState('');
  const [ncmecId, setNcmecId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importedPhoto, setImportedPhoto] = useState('');
  const fileRef = useRef();

  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' } };
  const lbl = { style: { fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block' } };

  const resetForm = () => { setForm(EMPTY_FORM); setImgPreview(''); setEditingId(null); setImportedPhoto(''); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImgPreview(ev.target.result); setForm(f => ({ ...f, photoUrl: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  // Extract NCMEC case number from URL or direct input
  const parseNcmecId = (input) => {
    input = input.trim();
    // Handles: full URL like https://www.missingkids.org/poster?caseNum=1234567
    const urlMatch = input.match(/caseNum[=:](\d+)/i) || input.match(/case[Nn]um[=:](\d+)/) || input.match(/NCMC(\d+)/i);
    if (urlMatch) return urlMatch[1];
    // Plain number
    if (/^\d{6,8}$/.test(input)) return input;
    return null;
  };

  const buildPhotoUrl = (caseNum) => `https://api.missingkids.org/photographs/NCMC${caseNum}c1.jpg`;
  const buildPosterUrl = (caseNum) => `https://www.missingkids.org/poster?caseNum=${caseNum}`;

  const handleNcmecImport = async () => {
    setImportError('');
    const caseNum = parseNcmecId(ncmecUrl || ncmecId);
    if (!caseNum) {
      setImportError('Could not find a valid NCMEC case number. Paste the full URL from missingkids.org or just the case number (e.g. 1495914).');
      return;
    }
    setImporting(true);
    const photoUrl = buildPhotoUrl(caseNum);
    setImportedPhoto(photoUrl);
    setForm(f => ({ ...f, photoUrl }));

    // Use Claude to auto-fill form fields from the NCMEC poster page
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          system: 'You help extract missing person case details from NCMEC (National Center for Missing & Exploited Children). When given a case number, search for it and extract the details. Respond ONLY with a JSON object — no markdown, no explanation. The JSON must have exactly these fields: name (string), age (number), gender (string: Male/Female/Unknown), description (string — physical description only, 1-2 sentences), lastSeenDate (string), lastSeenLocation (string: City, State), status (string: active/amber/silver/critical), missingSince (string: e.g. "3 YEARS" or "2 MONTHS" or "JUST REPORTED"). If a field is unknown use empty string or 0.',
          messages: [{ role: 'user', content: `Search for NCMEC missing child case number ${caseNum} on missingkids.org (URL: ${buildPosterUrl(caseNum)}) and extract the case details as JSON.` }]
        })
      });
      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setForm(f => ({
        ...f,
        name: parsed.name || f.name,
        age: parsed.age?.toString() || f.age,
        gender: parsed.gender || f.gender,
        description: parsed.description || f.description,
        lastSeenDate: parsed.lastSeenDate || f.lastSeenDate,
        lastSeenLocation: parsed.lastSeenLocation || f.lastSeenLocation,
        status: parsed.status || f.status,
        missingSince: parsed.missingSince || f.missingSince,
      }));
      setTab('manual');
    } catch (e) {
      setImportError('Could not auto-fill details. The photo URL was set — please fill in the remaining fields manually.');
      setTab('manual');
    }
    setImporting(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.lastSeenLocation) { alert('Name and last seen location are required.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    if (editingId) {
      setCases(prev => prev.map(c => c.id === editingId ? { ...c, ...form, age: parseInt(form.age) || 0 } : c));
    } else {
      setCases(prev => [{ id: `local_${Date.now()}`, ...form, age: parseInt(form.age) || 0 }, ...prev]);
    }
    resetForm();
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setTab('manage'); }, 1500);
  };

  const startEdit = (c) => {
    setForm({ name: c.name, age: c.age?.toString() || '', gender: c.gender, description: c.description, lastSeenDate: c.lastSeenDate, lastSeenLocation: c.lastSeenLocation, photoUrl: c.photoUrl, status: c.status, missingSince: c.missingSince });
    setImgPreview(c.photoUrl?.startsWith('data:') ? c.photoUrl : '');
    setEditingId(c.id);
    setTab('manual');
  };

  const deleteCase = (id) => {
    if (window.confirm('Delete this case?')) setCases(prev => prev.filter(c => c.id !== id));
  };

  const TABS = [
    { id: 'import', label: '⚡ Quick Import' },
    { id: 'manual', label: '✏️ Manual Entry' },
    { id: 'manage', label: '📋 Manage Cases' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 720, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Admin Panel</h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, opacity: 0.75 }}>Add cases from NCMEC, FBI, or manually</p>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: 3, gap: 2 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); if (t.id !== 'manage') resetForm(); }} style={{ padding: '5px 11px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#4f1c9e' : 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{t.label}</button>
              ))}
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}><XIcon size={15} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* ── QUICK IMPORT TAB ── */}
          {tab === 'import' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Step-by-step guide */}
              <div style={{ background: '#f0ebff', borderRadius: 14, padding: '16px 20px', border: '1px solid #c4b5fd' }}>
                <p style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 13, color: '#4f1c9e' }}>How to add a case from NCMEC in 3 steps:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { n: '1', text: 'Go to missingkids.org and find the case you want to add', link: 'https://www.missingkids.org/gethelpnow/search', linkLabel: 'Open NCMEC Search →' },
                    { n: '2', text: 'Copy the URL from your browser address bar (it will contain "caseNum=...") — or just copy the 7-digit case number from the poster page' },
                    { n: '3', text: 'Paste it below and click "Import & Auto-Fill" — Claude will fill in the details automatically' },
                  ].map(s => (
                    <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#7c3aed', color: '#fff', fontWeight: 800, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                      <div>
                        <span style={{ fontSize: 13, color: '#374151' }}>{s.text}</span>
                        {s.link && <a href={s.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginLeft: 8, color: '#7c3aed', fontWeight: 700, fontSize: 12 }}>{s.linkLabel}</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import box */}
              <div style={{ background: '#fafafa', borderRadius: 14, padding: 20, border: '1.5px solid #e5e7eb' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label {...lbl}>Paste NCMEC URL or Case Number</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={ncmecUrl}
                        onChange={e => setNcmecUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleNcmecImport()}
                        placeholder="e.g. https://www.missingkids.org/poster?caseNum=1495914  or just  1495914"
                        style={{ flex: 1, padding: '11px 14px', borderRadius: 11, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                      />
                      <button onClick={handleNcmecImport} disabled={importing || !ncmecUrl.trim()} style={{ padding: '11px 20px', borderRadius: 11, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 13, cursor: importing || !ncmecUrl.trim() ? 'not-allowed' : 'pointer', opacity: importing || !ncmecUrl.trim() ? 0.6 : 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {importing ? '⏳ Importing...' : '⚡ Import & Auto-Fill'}
                      </button>
                    </div>
                  </div>

                  {importError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13 }}>⚠️ {importError}</div>}

                  {importedPhoto && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 14px' }}>
                      <img src={importedPhoto} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 6, background: '#e5e7eb' }} onError={e => e.target.style.opacity = 0.3} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#166534' }}>✓ Photo loaded from NCMEC</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#16a34a' }}>Switch to Manual Entry tab to review and save</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Other sources */}
              <div>
                <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Other sources to copy case numbers from:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { name: 'NCMEC', url: 'https://www.missingkids.org/gethelpnow/search', desc: 'Search all missing children', color: '#dbeafe', accent: '#1d4ed8' },
                    { name: 'FBI Missing Persons', url: 'https://www.fbi.gov/investigate/violent-crime/missing-persons', desc: 'FBI wanted & missing', color: '#fef3c7', accent: '#92400e' },
                    { name: 'NamUs', url: 'https://namus.nij.ojp.gov/', desc: 'National missing & unidentified', color: '#f0fdf4', accent: '#166534' },
                    { name: 'Black & Missing', url: 'https://www.blackandmissinginc.com/', desc: 'BAMFI database', color: '#fdf2f8', accent: '#7e22ce' },
                  ].map(s => (
                    <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ padding: '12px 14px', borderRadius: 12, background: s.color, border: `1px solid ${s.accent}22`, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: s.accent }}>{s.name} ↗</span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{s.desc}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MANUAL ENTRY TAB ── */}
          {tab === 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {saved && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', color: '#166534', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}><CheckIcon size={16} />Case saved! Switching to manage view...</div>}
              {editingId && <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#854d0e' }}>✏️ Editing existing case. Save to update.</div>}

              {/* Photo row — shown at top for quick visual confirmation */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '14px 16px', background: '#faf5ff', borderRadius: 14, border: '1px solid #e9e3f3' }}>
                <div style={{ flexShrink: 0 }}>
                  {(form.photoUrl || imgPreview) ? (
                    <img src={imgPreview || (form.photoUrl.startsWith('data:') ? form.photoUrl : `https://images.weserv.nl/?url=${encodeURIComponent(form.photoUrl)}&w=80&h=100&fit=cover`)} style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 10, border: '2px solid #c4b5fd', background: '#e5e7eb' }} onError={e => { e.target.style.opacity = 0.3; }} />
                  ) : (
                    <div style={{ width: 64, height: 80, borderRadius: 10, border: '2px dashed #c4b5fd', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={20} style={{ color: '#a78bfa' }} /></div>
                  )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block' }}>Photo</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => fileRef.current.click()} style={{ padding: '7px 12px', borderRadius: 9, background: '#f0ebff', border: '1px solid #c4b5fd', color: '#4f1c9e', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><UploadIcon size={13} />Upload</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                  </div>
                  <input value={form.photoUrl.startsWith('data:') ? '' : form.photoUrl} onChange={e => { setForm(f => ({ ...f, photoUrl: e.target.value })); setImgPreview(''); }} placeholder="Or paste image URL (NCMEC, FBI, etc.)" style={{ padding: '7px 10px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 12, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}><label {...lbl}>Full Name *</label><input {...inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Doe" /></div>
                <div><label {...lbl}>Age</label><input {...inp} type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" /></div>
                <div><label {...lbl}>Gender</label><select {...inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option>Female</option><option>Male</option><option>Non-binary</option><option>Unknown</option></select></div>
                <div><label {...lbl}>Alert Status</label><select {...inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active Search</option><option value="amber">Amber Alert</option><option value="silver">Silver Alert</option><option value="critical">Critical</option></select></div>
                <div><label {...lbl}>Missing Since (label)</label><input {...inp} value={form.missingSince} onChange={e => setForm(f => ({ ...f, missingSince: e.target.value }))} placeholder="e.g. 2 WEEKS" /></div>
                <div><label {...lbl}>Last Seen Date</label><input {...inp} type="date" value={form.lastSeenDate} onChange={e => setForm(f => ({ ...f, lastSeenDate: e.target.value }))} /></div>
                <div style={{ gridColumn: '1/-1' }}><label {...lbl}>Last Seen Location *</label><input {...inp} value={form.lastSeenLocation} onChange={e => setForm(f => ({ ...f, lastSeenLocation: e.target.value }))} placeholder="City, State" /></div>
                <div style={{ gridColumn: '1/-1' }}><label {...lbl}>Physical Description</label><textarea {...inp} style={{ ...inp.style, resize: 'vertical', minHeight: 72 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Height, weight, hair color, last known clothing..." /></div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={resetForm} style={{ padding: '12px 18px', borderRadius: 12, background: '#f3f4f6', border: 'none', color: '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Clear</button>
                <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {saving ? '⏳ Saving...' : editingId ? '✓ Save Changes' : '+ Add to Gallery'}
                </button>
              </div>
            </div>
          )}

          {/* ── MANAGE CASES TAB ── */}
          {tab === 'manage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#374151' }}>{cases.length} total cases</p>
                <button onClick={() => setTab('import')} style={{ padding: '7px 14px', borderRadius: 9, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+ Add New Case</button>
              </div>
              {cases.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fafafa' }}>
                  <img
                    src={c.photoUrl?.startsWith('data:') ? c.photoUrl : `https://images.weserv.nl/?url=${encodeURIComponent(c.photoUrl || '')}&w=60&h=75&fit=cover`}
                    style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 7, flexShrink: 0, background: '#e5e7eb' }}
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1a0a3c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>{c.lastSeenLocation} · {c.lastSeenDate}</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, background: '#f0ebff', color: '#7c3aed', textTransform: 'uppercase', flexShrink: 0 }}>{STATUS_CONFIG[c.status]?.label || c.status}</span>
                  {c.isStatic && <span style={{ fontSize: 10, color: '#9ca3af', flexShrink: 0 }}>sample</span>}
                  <button onClick={() => startEdit(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0ebff', border: 'none', cursor: 'pointer', color: '#4f1c9e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><EditIcon size={12} /></button>
                  {!c.isStatic && <button onClick={() => deleteCase(c.id)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff1f2', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><TrashIcon size={12} /></button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── GALLERY SCREEN ───────────────────────────────────────────────────────────
function GalleryScreen({ cases, setCases, isAdmin }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdmin, setShowAdmin] = useState(false);

  const filtered = cases.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.lastSeenLocation?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      {showAdmin && <AdminPanel cases={cases} setCases={setCases} onClose={() => setShowAdmin(false)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#1a0a3c', margin: 0, lineHeight: 1.1 }}>Digital Vigil for the <em style={{ color: '#7c3aed' }}>Missing</em></h1>
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 16, maxWidth: 520 }}>Browse active cases, share information, or report a sighting. Together, we bring them home.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAdmin(true)} style={{ padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusIcon size={16} />Add / Manage Cases
          </button>
        )}
      </div>

      <div style={{ background: '#f9f5ff', borderRadius: 16, padding: '12px 16px', display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', border: '1px solid #e9e3f3' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 10, padding: '8px 14px', border: '1.5px solid #e5e7eb' }}>
          <SearchIcon size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or location..." style={{ border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', width: '100%', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all','active','amber','silver','critical'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid', borderColor: filter === f ? '#7c3aed' : '#e5e7eb', background: filter === f ? '#f0ebff' : '#fff', color: filter === f ? '#7c3aed' : '#6b7280', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
              {f === 'all' ? 'All Cases' : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {filtered.map(c => <CaseCard key={c.id} person={c} isAdmin={isAdmin} onEdit={(p) => { setShowAdmin(true); }} onDelete={(p) => { if(window.confirm(`Delete ${p.name}'s case?`)) setCases(prev => prev.filter(x => x.id !== p.id)); }} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <SearchIcon size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>No cases match your search.</p>
          </div>
        )}
      </div>

      <style>{`.case-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(79,28,158,0.15) !important; } .case-card:hover .case-img { transform: scale(1.04); }`}</style>
    </div>
  );
}

// ── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ setScreen, isAdmin }) {
  return (
    <div>
      {isAdmin && (
        <div style={{ background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', color: '#fff', padding: '12px 24px', textAlign: 'center', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ShieldIcon size={14} />Admin session active — you can add and manage cases in the Gallery
          <button onClick={() => setScreen('gallery')} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Go to Gallery</button>
        </div>
      )}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: '#f0ebff', color: '#7c3aed', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Active Support Network</span>
            <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, color: '#1a0a3c', margin: '0 0 20px' }}>First steps to finding your <em style={{ color: '#7c3aed' }}>loved one.</em></h1>
            <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, maxWidth: 460, marginBottom: 32 }}>In moments of uncertainty, we provide a structured, empathetic path forward. Every second counts — we are here to guide you through them.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setScreen('report')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,28,158,0.35)' }}><MegaphoneIcon size={18} />Report Missing Person</button>
              <button onClick={() => setScreen('gallery')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, background: '#f0ebff', border: 'none', color: '#4f1c9e', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}><UsersIcon size={18} />View Gallery</button>
            </div>
            <div style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <AlertIcon size={20} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div><p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#9a3412' }}>You do NOT need to wait 24 hours to report a missing person.</p><p style={{ margin: '4px 0 0', fontSize: 12, color: '#c2410c' }}>If someone is missing or in danger, contact law enforcement immediately.</p></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: MegaphoneIcon, title: 'Report a Case', desc: 'Submit a missing person report directly to our network.', action: 'report', color: '#f0ebff', accent: '#7c3aed' },
              { icon: UsersIcon, title: 'Browse Cases', desc: 'View active missing persons and share vital information.', action: 'gallery', color: '#fdf2f8', accent: '#a855f7' },
              { icon: PhoneIcon, title: 'Tip Line', desc: '470-294-2438 — Anonymous tips welcome, 24/7.', color: '#f0fdf4', accent: '#16a34a' },
              { icon: ShieldIcon, title: 'Legal Guide', desc: 'State laws, scripts & your rights when reporting.', action: 'legal', color: '#f0f9ff', accent: '#0284c7' },
            ].map((card, i) => (
              <div key={i} onClick={card.action ? () => setScreen(card.action) : undefined} style={{ padding: 20, borderRadius: 16, background: card.color, cursor: card.action ? 'pointer' : 'default', border: `1px solid ${card.accent}22`, transition: 'transform 0.2s' }} className="home-card">
                <card.icon size={24} style={{ color: card.accent, marginBottom: 10 }} />
                <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 14, color: '#1a0a3c' }}>{card.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`.home-card:hover { transform: translateY(-3px); }`}</style>
    </div>
  );
}

// ── REPORT SCREEN ────────────────────────────────────────────────────────────
function ReportScreen({ setScreen, setCases, isAdmin }) {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Female', description: '', lastSeenDate: '', lastSeenLocation: '', photoUrl: '', status: 'active', missingSince: 'JUST REPORTED' });
  const [imgPreview, setImgPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImgPreview(ev.target.result); setForm(f => ({ ...f, photoUrl: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.lastSeenLocation) { setError('Name and last seen location are required.'); return; }
    if (!isAdmin) { setError('You must be an authorized admin to add cases. Contact pleaselookformeatl@gmail.com to get access.'); return; }
    setSubmitting(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setCases(prev => [{ id: `case_${Date.now()}`, ...form, age: parseInt(form.age) || 0 }, ...prev]);
    setSubmitting(false);
    setDone(true);
    setTimeout(() => { setDone(false); setScreen('gallery'); }, 2500);
  };

  const inp = { style: { width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' } };
  const lbl = { style: { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' } };

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon size={28} style={{ color: '#16a34a' }} /></div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a0a3c' }}>Case Submitted</h2>
      <p style={{ color: '#6b7280', margin: 0 }}>Redirecting to gallery...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>← Back to Home</button>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1a0a3c', margin: '0 0 8px' }}>Broadcast a Missing Person</h1>
      <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 15 }}>{isAdmin ? 'Fill out the form to add this case to the public gallery.' : 'To submit a case, you must be an authorized organization admin.'}</p>

      {!isAdmin && (
        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertIcon size={18} style={{ color: '#d97706', flexShrink: 0 }} />
          <div><p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#92400e' }}>Admin Access Required</p><p style={{ margin: '4px 0 0', fontSize: 12, color: '#b45309' }}>Only authorized admins (pleaselookformeatl@gmail.com) can add cases. To report a sighting, call our tip line at <strong>470-294-2438</strong>.</p></div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><label {...lbl}>Full Name *</label><input {...inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Doe" /></div>
          <div><label {...lbl}>Age</label><input {...inp} type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" /></div>
          <div><label {...lbl}>Gender</label><select {...inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option>Female</option><option>Male</option><option>Non-binary</option><option>Other</option></select></div>
          <div><label {...lbl}>Alert Status</label><select {...inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active Search</option><option value="amber">Amber Alert</option><option value="silver">Silver Alert</option><option value="critical">Critical</option></select></div>
          <div><label {...lbl}>Last Seen Date</label><input {...inp} type="date" value={form.lastSeenDate} onChange={e => setForm(f => ({ ...f, lastSeenDate: e.target.value }))} /></div>
          <div><label {...lbl}>Missing Since (display)</label><input {...inp} value={form.missingSince} onChange={e => setForm(f => ({ ...f, missingSince: e.target.value }))} placeholder="e.g. 2 WEEKS" /></div>
        </div>
        <div><label {...lbl}>Last Seen Location *</label><input {...inp} value={form.lastSeenLocation} onChange={e => setForm(f => ({ ...f, lastSeenLocation: e.target.value }))} placeholder="City, State" /></div>
        <div><label {...lbl}>Physical Description</label><textarea {...inp} style={{ ...inp.style, resize: 'vertical', minHeight: 100 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Height, weight, hair color, last known clothing, circumstances..." /></div>

        <div>
          <label {...lbl}>Photo</label>
          <div style={{ border: '2px dashed #c4b5fd', borderRadius: 14, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#faf5ff', transition: 'background 0.2s' }} onClick={() => fileRef.current.click()}>
            {imgPreview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                <img src={imgPreview} style={{ width: 70, height: 88, objectFit: 'cover', borderRadius: 10 }} />
                <div><p style={{ margin: 0, fontWeight: 700, color: '#7c3aed', fontSize: 14 }}>Photo ready</p><p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>Click to change</p></div>
              </div>
            ) : (
              <><UploadIcon size={32} style={{ color: '#a78bfa', display: 'block', margin: '0 auto 10px' }} /><p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Click to upload a photo<br /><span style={{ fontSize: 12 }}>JPG, PNG — max 5MB</span></p></>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>— or paste URL —</span>
            <input style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} value={form.photoUrl.startsWith('data:') ? '' : form.photoUrl} onChange={e => { setForm(f => ({ ...f, photoUrl: e.target.value })); setImgPreview(''); }} placeholder="https://..." />
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', color: '#dc2626', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}><AlertIcon size={16} style={{ flexShrink: 0 }} />{error}</div>}
        <button onClick={handleSubmit} disabled={submitting || !isAdmin} style={{ padding: '14px', borderRadius: 12, background: isAdmin ? 'linear-gradient(135deg,#4f1c9e,#7c3aed)' : '#e5e7eb', border: 'none', color: isAdmin ? '#fff' : '#9ca3af', fontWeight: 800, fontSize: 15, cursor: isAdmin ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {submitting ? 'Broadcasting...' : isAdmin ? 'Broadcast This Case' : 'Admin Access Required'}
        </button>
      </div>
    </div>
  );
}

// ── CONTACT SCREEN ───────────────────────────────────────────────────────────
function ContactScreen() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: '#1a0a3c', margin: '0 0 8px' }}>Contact Us</h1>
      <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 40 }}>We're here to help. Reach out through any of the channels below.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { icon: PhoneIcon, label: 'Tip Line', val: '470-294-2438', sub: 'Anonymous tips welcome, 24/7', color: '#f0fdf4', accent: '#16a34a' },
          { icon: MegaphoneIcon, label: 'Email', val: 'pleaselookformeatl@gmail.com', sub: 'For inquiries and media', color: '#f0ebff', accent: '#7c3aed' },
          { icon: InstagramIcon, label: 'Instagram', val: '@pleaselookforme', sub: 'Follow for live alerts and case updates', color: '#fff7ed', accent: '#ea580c' },
        ].map((c, i) => (
          <div key={i} style={{ padding: '20px 24px', borderRadius: 16, background: c.color, border: `1px solid ${c.accent}22`, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 8px ${c.accent}33` }}><c.icon size={22} style={{ color: c.accent }} /></div>
            <div><p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</p><p style={{ margin: '2px 0 2px', fontWeight: 800, fontSize: 16, color: '#1a0a3c' }}>{c.val}</p><p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{c.sub}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LEGAL BOT SCREEN ─────────────────────────────────────────────────────────
const STATE_LAW_DATA = {
  GA: { name: 'Georgia', code: 'GA Code § 35-1-18', alerts: ["AMBER Alert", "Levi's Call (endangered adult)", "Mattie's Call (intellectual disability)"], notes: 'No waiting period required by law. Law enforcement must accept and enter the report immediately.', refusalScript: 'Under GA Code § 35-1-18, you are required to accept my missing person report immediately. There is no 24-hour waiting period in Georgia law. I am requesting you file this report now and enter it into GCIC/NCIC.' },
  FL: { name: 'Florida', code: 'FL Stat § 937.021', alerts: ['AMBER Alert', 'Silver Alert (missing adult with cognitive impairment)'], notes: 'Law enforcement must accept and immediately enter the report into FCIC/NCIC. No waiting period.', refusalScript: 'Under FL Stat § 937.021, Florida law enforcement is required to immediately accept a missing person report and enter it into FCIC and NCIC. A 24-hour waiting period is not permitted under Florida law. Please file my report now.' },
  SC: { name: 'South Carolina', code: 'SC Code § 23-3-50', alerts: ['AMBER Alert', 'Silver Alert'], notes: 'No waiting period. Immediate entry into SLED and NCIC databases required.', refusalScript: 'Per SC Code § 23-3-50, South Carolina law requires immediate acceptance of missing person reports with no waiting period. Immediate entry into SLED is required. I am formally requesting you file this report immediately.' },
  NC: { name: 'North Carolina', code: 'NC Gen Stat § 143B-1022', alerts: ['AMBER Alert', 'Silver Alert', 'Blue Alert (missing law enforcement officer)'], notes: 'Law enforcement required to investigate all missing person cases immediately regardless of age.', refusalScript: 'Under NC Gen Stat § 143B-1022, North Carolina law enforcement is required to immediately investigate missing person cases. There is no legal waiting period. I am requesting immediate filing and investigation of this report.' },
  AL: { name: 'Alabama', code: 'AL Code § 15-20-1', alerts: ['AMBER Alert', 'Senior Alert'], notes: 'Immediate reporting encouraged. Alerts activated through ALEA upon filing.', refusalScript: 'Under AL Code § 15-20-1, Alabama law encourages and supports immediate reporting of missing persons. There is no 24-hour waiting period requirement. I am requesting you file this report now and activate appropriate alerts through ALEA.' },
};

const QUICK_SCRIPTS = [
  { label: 'Police refusing report', prompt: 'The police are refusing to take my missing person report and telling me to wait 24 hours. What should I say to them?' },
  { label: 'What to say when calling 911', prompt: 'What exactly should I say when I call 911 to report a missing person? Give me a script.' },
  { label: 'Asking for AMBER Alert', prompt: 'How do I request an AMBER Alert be issued for a missing child? What are the criteria and what should I say?' },
  { label: 'If police are dismissive', prompt: 'The police are not taking my missing person case seriously. What are my escalation options and what should I say?' },
  { label: 'Requesting NCIC entry', prompt: 'How do I make sure the police enter my missing person into the NCIC database? What should I ask for?' },
  { label: 'Filing a report in Georgia', prompt: 'I need to file a missing person report in Georgia. What are my rights, what law protects me, and what should I say if they refuse?' },
];

function LegalBotScreen() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '### Welcome to the Legal Guide Assistant\n\nI provide **state-specific legal guidance** for families reporting missing persons in Georgia, Florida, South Carolina, North Carolina, and Alabama.\n\n**I can help you with:**\n- Scripts to use when speaking with law enforcement\n- State laws to cite if police refuse your report\n- How to request AMBER, Silver, or other alerts\n- Escalation steps if you are being ignored\n\nSelect your state below or type your question. **You do not need to wait 24 hours to report a missing person — this is a myth.**' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const stateContext = selectedState && STATE_LAW_DATA[selectedState]
      ? `The user has selected ${STATE_LAW_DATA[selectedState].name} as their state. Relevant law: ${STATE_LAW_DATA[selectedState].code}. Available alerts: ${STATE_LAW_DATA[selectedState].alerts.join(', ')}. Key notes: ${STATE_LAW_DATA[selectedState].notes}`
      : 'The user has not selected a specific state yet. Cover the southeastern US states you know about (GA, FL, SC, NC, AL) or ask them to specify.';

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          system: `You are a Missing Persons Legal Guide for PleaseLookForMe ATL, a community advocacy organization. You provide state-specific legal guidance to families trying to report missing loved ones.

STATE LAW DATABASE:
- Georgia: GA Code § 35-1-18 | AMBER Alert, Levi's Call, Mattie's Call | No waiting period required by law
- Florida: FL Stat § 937.021 | AMBER Alert, Silver Alert | Law enforcement must accept report immediately
- South Carolina: SC Code § 23-3-50 | AMBER Alert, Silver Alert | No waiting period; immediate SLED entry required
- North Carolina: NC Gen Stat § 143B-1022 | AMBER Alert, Silver Alert, Blue Alert | Law enforcement required to investigate immediately
- Alabama: AL Code § 15-20-1 | AMBER Alert, Senior Alert | Immediate reporting encouraged; ALEA activation

${stateContext}

CRITICAL RULES:
1. NEVER tell anyone to wait 24 hours — this is a dangerous myth with NO legal basis in any state.
2. Always cite the specific state law code when relevant.
3. When providing scripts for speaking to law enforcement, format them as blockquotes (> text).
4. Be compassionate but firm and legally precise.
5. Always recommend calling 911 first for immediate danger.
6. Tip line for PleaseLookForMe: 470-294-2438
7. Use markdown formatting: ### headers, **bold** for law codes, > for scripts, bullet lists.
8. If asked for a script, provide word-for-word language the person can say or read aloud.
9. For escalation steps, number them clearly.
10. End responses with: "Remember: You do not have to wait. Report immediately."

DISCLAIMER TO INCLUDE when giving legal advice: Add a brief note that this is general guidance, not a substitute for a licensed attorney, and encourage them to contact a civil rights attorney if rights are being violated.`,
          messages: [
            ...messages.filter((_, i) => i > 0).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMsg }
          ]
        })
      });
      const data = await res.json();
      const botText = data.content?.[0]?.text || 'I encountered an issue. Please call our tip line at 470-294-2438 for immediate assistance.';
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error. For immediate help, call **470-294-2438**.' }]);
    }
    setLoading(false);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h4 key={i} style={{ fontWeight: 800, margin: '12px 0 6px', fontSize: 14, color: '#1a0a3c' }}>{line.slice(4)}</h4>;
      if (line.startsWith('## ')) return <h3 key={i} style={{ fontWeight: 800, margin: '12px 0 6px', fontSize: 15, color: '#1a0a3c' }}>{line.slice(3)}</h3>;
      if (line.startsWith('> ')) return <blockquote key={i} style={{ margin: '8px 0', padding: '10px 14px', borderLeft: '3px solid #7c3aed', background: '#f5f3ff', borderRadius: '0 8px 8px 0', fontStyle: 'italic', fontSize: 13, color: '#374151' }}>{line.slice(2)}</blockquote>;
      if (line.match(/^\d+\. /)) return <p key={i} style={{ margin: '4px 0', fontSize: 13, paddingLeft: 4 }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4f1c9e">$1</strong>') }} />;
      if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 18, fontSize: 13, listStyleType: 'disc', marginBottom: 3, color: '#374151' }} dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4f1c9e">$1</strong>') }} />;
      if (line.startsWith('---')) return <hr key={i} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '10px 0' }} />;
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4f1c9e">$1</strong>');
      return line ? <p key={i} style={{ margin: '4px 0', fontSize: 13, lineHeight: 1.6, color: '#374151' }} dangerouslySetInnerHTML={{ __html: html }} /> : <br key={i} />;
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* State Selector */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e9e3f3', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', color: '#fff' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 13 }}>Your State</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, opacity: 0.8 }}>For state-specific laws & scripts</p>
          </div>
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(STATE_LAW_DATA).map(([code, s]) => (
              <button key={code} onClick={() => { setSelectedState(code); sendMessage(`I am in ${s.name}. What are my rights and what law protects me when reporting a missing person? Include the specific law code and a script I can use if police refuse.`); }} style={{ padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${selectedState === code ? '#7c3aed' : '#e5e7eb'}`, background: selectedState === code ? '#f0ebff' : '#fafafa', color: selectedState === code ? '#4f1c9e' : '#374151', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>{s.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: selectedState === code ? '#7c3aed' : '#9ca3af', fontStyle: 'italic' }}>{s.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Scripts */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e9e3f3', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e9e3f3' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#1a0a3c' }}>Quick Scripts</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>Tap to get a script instantly</p>
          </div>
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {QUICK_SCRIPTS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.prompt)} style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid #e5e7eb', background: '#fafafa', color: '#374151', fontWeight: 600, fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }} className="script-btn">
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Box */}
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 12, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Emergency</p>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#c2410c', fontWeight: 700 }}>If in immediate danger, call 911 first.</p>
          <p style={{ margin: 0, fontSize: 12, color: '#9a3412' }}>Tip Line: <strong>470-294-2438</strong></p>
        </div>
      </div>

      {/* Chat Panel */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e9e3f3', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 700 }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #e9e3f3', display: 'flex', alignItems: 'center', gap: 12, background: '#faf5ff' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldIcon size={22} style={{ color: '#fff' }} /></div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#1a0a3c' }}>Legal Rights Guide</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>State-specific laws · Law enforcement scripts · Alert criteria</p>
          </div>
          {selectedState && (
            <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 999, background: '#f0ebff', border: '1px solid #c4b5fd' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#4f1c9e' }}>{STATE_LAW_DATA[selectedState]?.name}</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-start' }}>
              {m.role === 'bot' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0ebff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><ShieldIcon size={14} style={{ color: '#7c3aed' }} /></div>}
              <div style={{ maxWidth: '82%', padding: m.role === 'bot' ? '14px 18px' : '10px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', background: m.role === 'user' ? '#4f1c9e' : '#f9f5ff', border: m.role === 'bot' ? '1px solid #e9e3f3' : 'none', color: m.role === 'user' ? '#fff' : '#1f2937' }}>
                {m.role === 'user' ? <p style={{ margin: 0, fontSize: 14 }}>{m.text}</p> : <div>{renderText(m.text)}</div>}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0ebff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldIcon size={14} style={{ color: '#7c3aed' }} /></div>
              <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: '#f9f5ff', border: '1px solid #e9e3f3', display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0,1,2].map(n => <span key={n} style={{ width: 7, height: 7, borderRadius: '50%', background: '#c4b5fd', animation: `bounce 1.2s ${n*0.2}s infinite` }} />)}
                <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>Looking up state law...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid #e9e3f3', background: '#fff' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask about your rights, request a script, or describe your situation..." style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ padding: '12px 18px', borderRadius: 12, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', opacity: !input.trim() || loading ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 6 }}><SendIcon size={16} />Send</button>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>This is general guidance, not legal advice. Consult a licensed attorney for your specific situation.</p>
        </div>
      </div>
      <style>{`.script-btn:hover { background: #f0ebff !important; border-color: #c4b5fd !important; color: #4f1c9e !important; }`}</style>
    </div>
  );
}

// ── FLYER GENERATOR SCREEN ───────────────────────────────────────────────────
const LOGO_URI = "data:image/png;base64,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";

const FLYER_THEMES = [
  { id: 'urgent', label: 'Urgent Red', bg: '#fff', headerBg: '#cc0000', headerText: '#fff', accentColor: '#cc0000', labelColor: '#cc0000', bodyBg: '#fff', footerBg: '#cc0000', footerText: '#fff' },
  { id: 'purple', label: 'PLFM Purple', bg: '#fff', headerBg: '#4f1c9e', headerText: '#fff', accentColor: '#7c3aed', labelColor: '#4f1c9e', bodyBg: '#fff', footerBg: '#4f1c9e', footerText: '#fff' },
  { id: 'dark', label: 'High Contrast', bg: '#111', headerBg: '#111', headerText: '#fff', accentColor: '#f59e0b', labelColor: '#f59e0b', bodyBg: '#111', footerBg: '#222', footerText: '#fff' },
  { id: 'clean', label: 'Clean White', bg: '#fff', headerBg: '#1a0a3c', headerText: '#fff', accentColor: '#1a0a3c', labelColor: '#374151', bodyBg: '#f9fafb', footerBg: '#1a0a3c', footerText: '#fff' },
];

function FlyerPreview({ data, theme }) {
  const t = FLYER_THEMES.find(x => x.id === theme) || FLYER_THEMES[0];
  const hasPhoto = !!data.photoPreview || !!data.photoUrl;
  const photoSrc = data.photoPreview || (data.photoUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(data.photoUrl)}&w=400&h=500&fit=cover` : null);

  return (
    <div id="flyer-preview" style={{ background: t.bg, width: '100%', maxWidth: 520, margin: '0 auto', fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif", border: '3px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: t.headerBg, padding: '16px 20px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: t.headerText, fontSize: 38, fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.1, textTransform: 'uppercase' }}>MISSING PERSON</p>
      </div>

      {/* Body */}
      <div style={{ background: t.bodyBg, padding: 16 }}>
        {/* Photo + Info row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {/* Photo */}
          <div style={{ width: 180, minWidth: 180, height: 220, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasPhoto ? (
              <img src={photoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <ImageIcon size={32} />
                <p style={{ fontSize: 11, margin: '6px 0 0', fontFamily: 'Arial, sans-serif' }}>Photo here</p>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div style={{ flex: 1, background: t.headerBg === '#111' ? '#222' : '#111', borderRadius: 4, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {data.name || 'FULL NAME'}
              {data.nickname && <><br/><span style={{ fontSize: 16 }}>"{data.nickname}"</span></>}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                ['AGE', data.age ? `${data.age} y/o` : ''],
                ['HEIGHT', data.height],
                ['WEIGHT', data.weight ? `${data.weight} lbs` : ''],
                ['EYES', data.eyes],
                ['HAIR', data.hair],
                ['MISSING SINCE', data.missingSince],
                ['LAST SEEN', data.lastSeen],
              ].filter(([,v]) => v).map(([label, val]) => (
                <p key={label} style={{ margin: 0, fontSize: 11, lineHeight: 1.4 }}>
                  <span style={{ color: t.accentColor, fontWeight: 900, marginRight: 4 }}>{label}:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{val}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p style={{ margin: '0 0 10px', fontSize: 13, color: t.headerBg === '#111' ? '#e5e7eb' : '#1f2937', lineHeight: 1.6, fontFamily: 'Arial, sans-serif', fontWeight: 600, textAlign: 'center' }}>
            {data.description}
          </p>
        )}

        {/* Help text */}
        <p style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 900, textAlign: 'center', color: t.accentColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          HELP FIND {(data.name || 'THEM').split(' ')[0].toUpperCase()}!
        </p>
      </div>

      {/* Footer */}
      <div style={{ background: t.footerBg, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: t.footerText, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.5 }}>
            ANY INFORMATION? CONTACT:
          </p>
          <p style={{ margin: '3px 0 0', color: t.footerText, fontSize: 16, fontWeight: 900 }}>
            {data.tipline || '470-294-2438'}
          </p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 10, fontFamily: 'Arial, sans-serif' }}>
            @pleaselookforme · pleaselookformeatl@gmail.com
          </p>
        </div>
        <img src={LOGO_URI} style={{ width: 56, height: 56, objectFit: 'contain', opacity: 0.95, flexShrink: 0 }} alt="PLFM Logo" />
      </div>
    </div>
  );
}

function FlyerScreen({ setScreen }) {
  const [data, setData] = React.useState({
    name: '', nickname: '', age: '', height: '', weight: '', eyes: '', hair: '',
    missingSince: '', lastSeen: '', description: '', tipline: '470-294-2438',
    photoUrl: '', photoPreview: '',
  });
  const [theme, setTheme] = React.useState('urgent');
  const [downloading, setDownloading] = React.useState(false);
  const [aiMode, setAiMode] = React.useState(false);
  const [flyerText, setFlyerText] = React.useState('');
  const [parsing, setParsing] = React.useState(false);
  const fileRef = React.useRef();

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('photoPreview', ev.target.result);
    reader.readAsDataURL(file);
  };

  const parseFromText = async () => {
    if (!flyerText.trim()) return;
    setParsing(true);
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          system: 'Extract missing person details from flyer text and return ONLY a JSON object with these exact keys: name, nickname, age, height, weight, eyes, hair, missingSince, lastSeen, description. Use empty string for unknown fields. No markdown, no explanation.',
          messages: [{ role: 'user', content: flyerText }]
        })
      });
      const result = await res.json();
      const text = result.content?.[0]?.text || '';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      setData(d => ({ ...d, ...parsed }));
      setAiMode(false);
    } catch (e) {
      alert('Could not parse — try filling in manually.');
    }
    setParsing(false);
  };

  const downloadFlyer = async () => {
    setDownloading(true);
    // Use browser print to PDF
    const preview = document.getElementById('flyer-preview');
    if (!preview) { setDownloading(false); return; }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>Missing Person Flyer - ${data.name || 'PLFM'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: white; display: flex; justify-content: center; align-items: flex-start; padding: 20px; }
        @media print {
          body { padding: 0; }
          @page { size: letter; margin: 0.5in; }
        }
      </style>
      </head><body>
      ${preview.outerHTML}
      <script>setTimeout(() => { window.print(); window.close(); }, 300);</script>
      </body></html>
    `);
    printWindow.document.close();
    setDownloading(false);
  };

  const inp = (k, placeholder, type='text') => ({
    value: data[k],
    onChange: e => set(k, e.target.value),
    placeholder,
    type,
    style: { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  });

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 20px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>← Back to Home</button>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1a0a3c', margin: '0 0 6px' }}>Missing Person Flyer Generator</h1>
        <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>Fill in the details, pick a theme, and download a print-ready flyer — free, in seconds.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 28, alignItems: 'start' }}>

        {/* ── LEFT: FORM ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* AI paste mode */}
          <div style={{ background: '#f0ebff', borderRadius: 14, border: '1px solid #c4b5fd', overflow: 'hidden' }}>
            <button onClick={() => setAiMode(!aiMode)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, fontSize: 13, color: '#4f1c9e' }}>
              <span>⚡ Already have flyer text? Paste it &amp; auto-fill</span>
              <span style={{ fontSize: 16 }}>{aiMode ? '▲' : '▼'}</span>
            </button>
            {aiMode && (
              <div style={{ padding: '0 16px 14px' }}>
                <textarea value={flyerText} onChange={e => setFlyerText(e.target.value)} placeholder="Paste any flyer text or Instagram caption here — Claude will extract the details automatically..." style={{ width: '100%', height: 100, padding: '9px 12px', borderRadius: 10, border: '1.5px solid #c4b5fd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                <button onClick={parseFromText} disabled={parsing || !flyerText.trim()} style={{ marginTop: 8, width: '100%', padding: '9px', borderRadius: 10, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 13, cursor: parsing || !flyerText.trim() ? 'not-allowed' : 'pointer', opacity: parsing || !flyerText.trim() ? 0.6 : 1 }}>
                  {parsing ? '⏳ Reading...' : '✨ Auto-Fill from Text'}
                </button>
              </div>
            )}
          </div>

          {/* Photo upload */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e9e3f3', padding: 16 }}>
            <p style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 13, color: '#1a0a3c' }}>Photo</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {data.photoPreview ? (
                <img src={data.photoPreview} style={{ width: 56, height: 70, objectFit: 'cover', borderRadius: 8, border: '2px solid #c4b5fd', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 56, height: 70, borderRadius: 8, border: '2px dashed #c4b5fd', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ImageIcon size={20} style={{ color: '#a78bfa' }} /></div>
              )}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={() => fileRef.current.click()} style={{ padding: '8px 14px', borderRadius: 9, background: '#f0ebff', border: '1px solid #c4b5fd', color: '#4f1c9e', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><UploadIcon size={13} />Upload Photo</button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                <input placeholder="Or paste photo URL..." style={{ padding: '7px 10px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} value={data.photoUrl} onChange={e => { set('photoUrl', e.target.value); set('photoPreview', ''); }} />
              </div>
            </div>
          </div>

          {/* Identity fields */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e9e3f3', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 13, color: '#1a0a3c' }}>Identity</p>
            <input {...inp('name', 'Full Name (required)')} />
            <input {...inp('nickname', 'Nickname / Goes by (optional)')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input {...inp('age', 'Age', 'number')} />
              <input {...inp('height', "Height (e.g. 5'8\")")} />
              <input {...inp('weight', 'Weight (lbs)', 'number')} />
              <input {...inp('eyes', 'Eye color')} />
              <input {...inp('hair', 'Hair (color, length)')} style={{ ...{} }} />
              <input {...inp('missingSince', 'Missing since (date)')} />
            </div>
          </div>

          {/* Last seen */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e9e3f3', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 13, color: '#1a0a3c' }}>Circumstances</p>
            <input {...inp('lastSeen', 'Last seen location / circumstances')} />
            <textarea value={data.description} onChange={e => set('description', e.target.value)} placeholder="Additional details (optional short description shown on flyer)" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: 70, boxSizing: 'border-box' }} />
            <input {...inp('tipline', 'Contact tip line number')} />
          </div>

          {/* Theme picker */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e9e3f3', padding: 16 }}>
            <p style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 13, color: '#1a0a3c' }}>Color Theme</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {FLYER_THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)} style={{ padding: '10px 12px', borderRadius: 10, border: `2px solid ${theme === t.id ? t.headerBg : '#e5e7eb'}`, background: theme === t.id ? t.headerBg + '18' : '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.headerBg, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: theme === t.id ? 800 : 600, color: theme === t.id ? t.headerBg : '#374151' }}>{t.label}</span>
                  {theme === t.id && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Download button */}
          <button onClick={downloadFlyer} disabled={downloading || !data.name} style={{ width: '100%', padding: '14px', borderRadius: 14, background: data.name ? 'linear-gradient(135deg,#4f1c9e,#7c3aed)' : '#e5e7eb', border: 'none', color: data.name ? '#fff' : '#9ca3af', fontWeight: 900, fontSize: 15, cursor: data.name ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: data.name ? '0 4px 20px rgba(79,28,158,0.3)' : 'none' }}>
            {downloading ? '⏳ Preparing...' : '⬇ Download / Print Flyer'}
          </button>
          <p style={{ margin: '-8px 0 0', fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>Opens a print dialog — save as PDF or print directly</p>
        </div>

        {/* ── RIGHT: LIVE PREVIEW ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#374151' }}>Live Preview</p>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>Updates as you type</span>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: 16, padding: 20 }}>
            <FlyerPreview data={data} theme={theme} />
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>Your logo and tip line are automatically included on every flyer</p>
        </div>
      </div>
    </div>
  );
}


// ── BE PREPARED SCREEN ───────────────────────────────────────────────────────
const PREP_STEPS = [
  {
    id: 'photos',
    icon: '📸',
    title: 'Keep Current Photos',
    urgency: 'Most Critical',
    urgencyColor: '#dc2626',
    desc: 'A recent, clear photo is the single most important thing you can have. Without it, law enforcement and the public cannot help identify your loved one.',
    checklist: [
      'Take a clear front-facing photo every 3–6 months',
      'Include a profile (side) photo as well',
      'Photograph any distinguishing marks — tattoos, birthmarks, scars',
      'Keep photos on your phone AND backed up to cloud storage',
      'Note the date each photo was taken',
      'For children: update photos at every school year',
    ],
    tip: 'Pro tip: Set a calendar reminder every 6 months labeled "Update Family Safety Photos."',
    color: '#fef2f2',
    border: '#fecaca',
    accent: '#dc2626',
  },
  {
    id: 'docs',
    icon: '📋',
    title: 'Build a Family ID File',
    urgency: 'Critical',
    urgencyColor: '#ea580c',
    desc: 'Law enforcement will ask for specific identifying information immediately. Having this ready saves hours — possibly days — in a real emergency.',
    checklist: [
      'Full legal name and any known aliases or nicknames',
      'Date of birth and Social Security Number',
      'Height, weight, eye color, hair color (update regularly)',
      'Blood type',
      'Fingerprints (free at many local police stations)',
      'Dental records — ask your dentist for a copy',
      'Medical conditions, medications, and dosages',
      'Doctor and specialist contact information',
      'Any physical or cognitive disabilities',
      'Vehicle information: make, model, color, license plate',
    ],
    tip: 'Store a sealed physical copy in a fireproof box and a digital copy in a password-protected cloud folder.',
    color: '#fff7ed',
    border: '#fed7aa',
    accent: '#ea580c',
  },
  {
    id: 'digital',
    icon: '📱',
    title: 'Document Digital Footprint',
    urgency: 'Important',
    urgencyColor: '#d97706',
    desc: 'Social media and digital accounts are now primary tools in missing person investigations. Investigators will ask for this information immediately.',
    checklist: [
      'List all social media accounts: Instagram, TikTok, Snapchat, Facebook, X',
      'Note usernames/handles for every platform',
      'Know which platforms they are most active on',
      'Note any accounts that use a different name',
      'Keep a record of close online friends or communities',
      'Know which messaging apps they use (iMessage, WhatsApp, Discord)',
      'Note any gaming platforms or online communities',
      'Keep login credentials in a secure, accessible place',
    ],
    tip: 'Online investigators and volunteers have solved cases that went cold for years. This information is gold.',
    color: '#fefce8',
    border: '#fde68a',
    accent: '#d97706',
  },
  {
    id: 'network',
    icon: '👥',
    title: 'Know Their Social Network',
    urgency: 'Important',
    urgencyColor: '#16a34a',
    desc: "Knowing your loved one's friends, routines, and frequented locations can dramatically narrow a search area in the critical first hours.",
    checklist: [
      "Write down names and contact info for close friends",
      "Know the names of their workplace supervisors and coworkers",
      "Know their regular routines: gym, school, church, errands",
      "Know locations they frequent: favorite restaurants, parks, stores",
      "Know their relationship status and partner information",
      "Keep a list of any known estrangements or conflicts",
      "Know their transportation: do they drive, take transit, Uber?",
      "Know trusted adults in their life (teachers, coaches, mentors)",
    ],
    tip: "Talk with your family openly about this — framing it as a safety plan, not a surveillance plan, helps.",
    color: '#f0fdf4',
    border: '#bbf7d0',
    accent: '#16a34a',
  },
  {
    id: 'plan',
    icon: '🗺️',
    title: 'Make a Family Emergency Plan',
    urgency: 'Recommended',
    urgencyColor: '#0284c7',
    desc: 'When a crisis hits, clear plans prevent chaos. Knowing exactly what to do in the first 30 minutes can make a major difference.',
    checklist: [
      'Agree on a family check-in protocol (daily text, location sharing)',
      'Designate a family point-of-contact that everyone knows',
      'Know your local police non-emergency AND emergency numbers',
      'Save NCMEC hotline: 1-800-843-5678 (THE-LOST)',
      'Save PleaseLookForMe tip line: 470-294-2438',
      'Know which hospital your family member would be taken to',
      'Have a plan for who watches other children if you must leave',
      'Know your missing person reporting rights (no 24hr wait required)',
    ],
    tip: 'Practice the plan. A plan nobody knows about is no plan at all.',
    color: '#eff6ff',
    border: '#bfdbfe',
    accent: '#0284c7',
  },
  {
    id: 'vulnerable',
    icon: '💜',
    title: 'Special Considerations',
    urgency: 'If Applicable',
    urgencyColor: '#7c3aed',
    desc: 'Certain individuals face elevated risk or require additional preparation. If this applies to your family, take these extra steps.',
    checklist: [
      'Children: enroll in a fingerprinting program (many schools & police stations offer this free)',
      'Autism/Wandering: register with local police department\'s vulnerable person registry',
      'Dementia/Alzheimer\'s: enroll in the MedicAlert + Wandering Support program',
      'Teens: have open conversations about trafficking warning signs',
      'Domestic violence situations: create a safety plan with a local DV shelter',
      'Anyone: consider a GPS device (watch, tracker) with their knowledge and consent',
      'Runaway risk: keep communication open and know warning signs',
      'Foster/adopted youth: ensure legal guardianship documentation is current',
    ],
    tip: 'The Autism Wandering Association provides free safety resources. NCMEC has specific guides for families of children with disabilities.',
    color: '#faf5ff',
    border: '#e9d5ff',
    accent: '#7c3aed',
  },
];

function PreparedScreen({ setScreen }) {
  const [expanded, setExpanded] = React.useState('photos');
  const [checkedItems, setCheckedItems] = React.useState({});
  const [showDownloadTip, setShowDownloadTip] = React.useState(false);

  const toggleCheck = (stepId, idx) => {
    const key = `${stepId}-${idx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = PREP_STEPS.reduce((sum, s) => sum + s.checklist.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const pct = Math.round((checkedCount / totalItems) * 100);

  const progressColor = pct < 30 ? '#dc2626' : pct < 70 ? '#d97706' : '#16a34a';
  const progressLabel = pct < 30 ? 'Just getting started' : pct < 70 ? 'Making good progress' : pct < 100 ? 'Almost ready' : '✓ Fully prepared';

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
      <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>← Back to Home</button>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 999, background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Prevention & Preparedness</span>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: '#1a0a3c', margin: '0 0 10px', lineHeight: 1.1 }}>Before Someone Goes Missing</h1>
        <p style={{ color: '#6b7280', fontSize: 15, margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
          The first 24–48 hours of a missing person case are the most critical. Being prepared <em>before</em> an emergency means investigators can act immediately — not spend time gathering basic information.
        </p>
      </div>

      {/* Progress tracker */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e9e3f3', padding: '18px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1a0a3c' }}>Your Family Preparedness</p>
            <span style={{ fontWeight: 800, fontSize: 14, color: progressColor }}>{pct}% — {progressLabel}</span>
          </div>
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: progressColor, borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9ca3af' }}>{checkedCount} of {totalItems} items completed</p>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: progressColor + '18', border: `3px solid ${progressColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {pct === 100 ? '✓' : pct >= 50 ? '🛡️' : '📋'}
          </div>
        </div>
      </div>

      {/* Emergency reminder */}
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚡</span>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#9a3412' }}>If someone is already missing, don't wait — act now.</p>
          <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#c2410c' }}>Call 911 immediately. You do NOT need to wait 24 hours. No law requires a waiting period.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setScreen('report')} style={{ padding: '6px 14px', borderRadius: 9, background: '#ea580c', border: 'none', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Report Now</button>
            <button onClick={() => setScreen('legal')} style={{ padding: '6px 14px', borderRadius: 9, background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Know Your Rights</button>
          </div>
        </div>
      </div>

      {/* Accordion steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PREP_STEPS.map(step => {
          const isOpen = expanded === step.id;
          const stepChecked = step.checklist.filter((_, i) => checkedItems[`${step.id}-${i}`]).length;
          const stepDone = stepChecked === step.checklist.length;
          return (
            <div key={step.id} style={{ background: isOpen ? step.color : '#fff', borderRadius: 14, border: `1.5px solid ${isOpen ? step.border : '#e9e3f3'}`, overflow: 'hidden', transition: 'all 0.2s' }}>
              {/* Accordion header */}
              <button onClick={() => setExpanded(isOpen ? null : step.id)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{step.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#1a0a3c' }}>{step.title}</p>
                    <span style={{ padding: '2px 8px', borderRadius: 999, background: step.urgencyColor + '18', color: step.urgencyColor, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{step.urgency}</span>
                  </div>
                  {!isOpen && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>{stepChecked}/{step.checklist.length} items done</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {stepDone && <span style={{ color: '#16a34a', fontSize: 16 }}>✓</span>}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: isOpen ? step.accent + '20' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOpen ? step.accent : '#9ca3af', fontWeight: 800, fontSize: 14 }}>
                    {isOpen ? '▲' : '▼'}
                  </div>
                </div>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div style={{ padding: '0 20px 20px' }}>
                  <p style={{ margin: '0 0 16px', fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{step.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {step.checklist.map((item, i) => {
                      const key = `${step.id}-${i}`;
                      const checked = !!checkedItems[key];
                      return (
                        <label key={i} onClick={() => toggleCheck(step.id, i)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '10px 14px', borderRadius: 10, background: checked ? '#fff' : 'rgba(255,255,255,0.6)', border: `1px solid ${checked ? step.accent + '40' : 'rgba(0,0,0,0.06)'}`, transition: 'all 0.15s' }}>
                          <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? step.accent : '#d1d5db'}`, background: checked ? step.accent : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                            {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 13, color: checked ? '#6b7280' : '#374151', textDecoration: checked ? 'line-through' : 'none', lineHeight: 1.5 }}>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                  {step.tip && (
                    <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.7)', borderRadius: 10, borderLeft: `3px solid ${step.accent}`, display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
                      <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{step.tip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 32, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', borderRadius: 18, padding: '28px 28px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: '0 0 6px', fontWeight: 900, fontSize: 18 }}>Share this with your family</p>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>Preparedness works best when the whole family is involved. Send them this page or print the checklist.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowDownloadTip(true); setTimeout(() => setShowDownloadTip(false), 2500); }} style={{ padding: '11px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            {showDownloadTip ? '✓ Link Copied!' : '🔗 Copy Link'}
          </button>
          <button onClick={() => setScreen('flyer')} style={{ padding: '11px 20px', borderRadius: 12, background: '#fff', border: 'none', color: '#4f1c9e', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>Make a Flyer →</button>
        </div>
      </div>
    </div>
  );
}


// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ screen, setScreen, adminEmail, setAdminEmail }) {
  const [showLogin, setShowLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const isAdmin = ADMIN_EMAILS.includes(adminEmail);

  const login = () => {
    if (ADMIN_EMAILS.includes(emailInput.trim().toLowerCase())) {
      setAdminEmail(emailInput.trim().toLowerCase());
      setShowLogin(false);
      setEmailInput('');
    } else {
      alert('That email is not in the authorized admin list.');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'report', label: 'Report' },
    { id: 'flyer', label: 'Flyer Maker' },
    { id: 'prepare', label: 'Be Prepared' },
    { id: 'legal', label: 'Legal Guide' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e9e3f3', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 500, boxShadow: '0 1px 8px rgba(79,28,158,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setScreen('home')}>
          <img src="data:image/png;base64,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" alt="PleaseLookForMe" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <span style={{ fontWeight: 900, fontSize: 16, color: '#1a0a3c', letterSpacing: '-0.03em' }}>PleaseLookForMe</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(n => <button key={n.id} onClick={() => setScreen(n.id)} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: screen === n.id ? '#f0ebff' : 'transparent', color: screen === n.id ? '#7c3aed' : '#6b7280', fontWeight: screen === n.id ? 800 : 600, fontSize: 13, cursor: 'pointer' }}>{n.label}</button>)}
          {isAdmin ? (
            <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6, background: '#f0ebff', padding: '6px 12px', borderRadius: 10, border: '1px solid #c4b5fd' }}>
              <ShieldIcon size={13} style={{ color: '#7c3aed' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed' }}>ADMIN</span>
              <button onClick={() => setAdminEmail('')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 11, padding: '0 0 0 4px' }}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ marginLeft: 8, padding: '8px 14px', borderRadius: 10, background: '#f0ebff', border: '1px solid #c4b5fd', color: '#7c3aed', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Admin Login</button>
          )}
        </div>
      </nav>
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 340, boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 18, color: '#1a0a3c' }}>Admin Login</h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6b7280' }}>Enter your authorized admin email to access admin controls.</p>
            <input value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="admin@pleaselookforme.org" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowLogin(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={login} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#4f1c9e,#7c3aed)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign In</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [cases, setCases] = useState(SAMPLE_CASES);
  const [adminEmail, setAdminEmail] = useState('');
  const isAdmin = ADMIN_EMAILS.includes(adminEmail);

  return (
    <div style={{ minHeight: '100vh', background: '#fef7ff', fontFamily: "'Manrope', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <Nav screen={screen} setScreen={setScreen} adminEmail={adminEmail} setAdminEmail={setAdminEmail} />
      <main>
        {screen === 'home' && <HomeScreen setScreen={setScreen} isAdmin={isAdmin} />}
        {screen === 'gallery' && <GalleryScreen cases={cases} setCases={setCases} isAdmin={isAdmin} />}
        {screen === 'report' && <ReportScreen setScreen={setScreen} setCases={setCases} isAdmin={isAdmin} />}
        {screen === 'flyer' && <FlyerScreen setScreen={setScreen} />}
        {screen === 'prepare' && <PreparedScreen setScreen={setScreen} />}
        {screen === 'legal' && <LegalBotScreen />}
        {screen === 'contact' && <ContactScreen />}
      </main>
      <ChatBot />
    </div>
  );
}
