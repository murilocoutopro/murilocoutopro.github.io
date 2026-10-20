import {config} from '../config';

// The supplied artwork already includes both pastors and the campaign lighting.
// CSS crops and masks only the surrounding layout. No face is regenerated.
export default function CampaignVisual(){
  return <div className="campaign-visual">
    <img src={config.images.campaign} alt={config.images.alt} width="1152" height="2048" fetchPriority="high"/>
    <span className="visual-glow" aria-hidden="true"/>
  </div>;
}
