import {config} from '../config';
import {PRIVACY_VERSION} from '../lib/registrationConfig';
export default function PrivacyNotice(){return <div className="registration-privacy-copy">
 <p>A {config.church} utiliza seu nome, contato e inscrição para organizar sua participação nos Fluxos de Cura e enviar informações do encontro. Comunicações futuras dependem da sua autorização opcional.</p>
 <p>No evento, informações de saúde poderão ser solicitadas, com autorização específica, para organizar o atendimento e as pessoas que receberão oração. Esses dados não são solicitados neste formulário.</p>
 <p>O acesso é restrito à equipe autorizada. Os dados da campanha são mantidos por até 90 dias após o evento; contatos autorizados para comunicações futuras, por até um ano ou até a revogação.</p>
 <p>Para consultar, corrigir ou excluir seus dados, ou retirar sua autorização, fale pelo <a href={config.contactWhatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {config.churchPhone}</a>.</p>
 <p className="notice-version">Versão {PRIVACY_VERSION}.</p>
 </div>;}
