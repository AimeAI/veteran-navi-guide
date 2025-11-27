/**
 * Canadian Veteran Employers Database
 * Comprehensive directory of companies hiring veterans across all sectors
 */

export type EmployerSector =
  | 'defense'
  | 'public-safety'
  | 'logistics-transportation'
  | 'construction-trades'
  | 'government'
  | 'tech-cybersecurity'
  | 'healthcare'
  | 'utilities-energy'
  | 'manufacturing'
  | 'retail-hospitality';

export type EmployerCategory =
  | 'prime-contractor'
  | 'systems-integrator'
  | 'specialized'
  | 'cybersecurity'
  | 'aviation'
  | 'police'
  | 'fire-rescue'
  | 'corrections'
  | 'freight-logistics'
  | 'trades'
  | 'federal-agency'
  | 'provincial-agency'
  | 'municipal'
  | 'tech-company'
  | 'healthcare-provider'
  | 'utility'
  | 'manufacturer';

export interface VeteranEmployer {
  id: string;
  name: string;
  sector: EmployerSector;
  category: EmployerCategory;
  website: string;
  careersUrl: string;
  locations: string[];
  employees?: string;
  phone?: string;
  email?: string;
  address?: string;
  veteranFriendly: boolean;
  veteranOwned?: boolean;
  description?: string;
  securityClearanceJobs: boolean;
  clearanceLevel?: 'reliability' | 'secret' | 'top-secret' | 'various';
  rssUrl?: string;
  apiUrl?: string;
}

export const veteranEmployers: VeteranEmployer[] = [
  // ======================
  // DEFENSE CONTRACTORS
  // ======================
  {
    id: 'lockheed-martin-ca',
    name: 'Lockheed Martin Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.lockheedmartin.com/en-ca',
    careersUrl: 'https://www.lockheedmartin.com/en-ca/careers.html',
    locations: ['Ottawa', 'Montreal', 'Halifax', 'Calgary', 'Victoria'],
    employees: '1,000+',
    phone: '(613) 596-4300',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'top-secret',
    description: 'Global aerospace, defense, security and advanced technologies company'
  },
  {
    id: 'gd-mission-systems-ca',
    name: 'General Dynamics Mission Systems - Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.gdmissionsystems.ca',
    careersUrl: 'https://www.gdmissionsystems.ca/careers',
    locations: ['Ottawa'],
    address: '1941 Robertson Rd, Ottawa, ON K2H 5B7',
    phone: '(613) 596-7000',
    email: 'careers@gdmissionsystems.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Advanced technology systems for defense and intelligence'
  },
  {
    id: 'gd-land-systems-ca',
    name: 'General Dynamics Land Systems - Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.gdls.com/canada',
    careersUrl: 'https://www.gdls.com/careers',
    locations: ['London, ON'],
    address: '1991 Oxford Street East, London, ON N5V 2Z7',
    phone: '(519) 964-5900',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Combat vehicles and armored systems'
  },
  {
    id: 'gd-ordnance-ca',
    name: 'General Dynamics Ordnance and Tactical Systems - Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.gdotscanada.com',
    careersUrl: 'https://www.gdotscanada.com/careers',
    locations: ['Repentigny', 'Quebec City', 'Valleyfield', 'Nicolet'],
    address: '5 Montée des Arsenaux, Repentigny, QC J5Z 2P4',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Munitions and weapon systems'
  },
  {
    id: 'bae-systems-ca',
    name: 'BAE Systems Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.baesystems.com/en-ca',
    careersUrl: 'https://www.baesystems.com/en-ca/careers',
    locations: ['Multiple across Canada'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense, aerospace and security solutions'
  },
  {
    id: 'raytheon-ca',
    name: 'Raytheon Canada (RTX)',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.rtx.com/raytheon/what-we-do/raytheon-canada',
    careersUrl: 'https://www.rtx.com/careers',
    locations: ['Ottawa', 'Calgary'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Missiles, radar, and defense systems'
  },
  {
    id: 'l3harris-ca',
    name: 'L3Harris Technologies Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.l3harris.com/en-ca/canada',
    careersUrl: 'https://www.l3harris.com/careers',
    locations: ['Mirabel, QC', 'Ottawa, ON', 'Waterdown, ON'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense technology and communication systems including WESCAM'
  },
  {
    id: 'thales-ca',
    name: 'Thales Canada',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.thalesgroup.com/en/americas/canada',
    careersUrl: 'https://www.thalesgroup.com/en/careers',
    locations: ['Ottawa', 'Montreal', 'Quebec City', 'Halifax', 'Vancouver'],
    employees: '1,300+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense electronics, aerospace, and transportation'
  },
  {
    id: 'cae',
    name: 'CAE Inc.',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.cae.com',
    careersUrl: 'https://www.cae.com/careers',
    locations: ['Montreal', 'Multiple locations across Canada'],
    employees: '9,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Flight simulation and training systems'
  },
  {
    id: 'bombardier-defense',
    name: 'Bombardier Defense',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://defense.bombardier.com',
    careersUrl: 'https://www.bombardier.com/en/careers',
    locations: ['Montreal', 'Toronto', 'Saint-Laurent, QC'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Military aviation and surveillance aircraft'
  },

  // MAJOR SYSTEMS INTEGRATORS
  {
    id: 'adga-group',
    name: 'ADGA Group Consultants Inc.',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.adga.ca',
    careersUrl: 'https://www.adga.ca/careers',
    locations: ['Ottawa'],
    employees: '501-1,000',
    phone: '(613) 736-9551',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'IT and engineering services for defense and aerospace'
  },
  {
    id: 'calian-group',
    name: 'Calian Group',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.calian.com',
    careersUrl: 'https://careers.calian.com/',
    locations: ['Ottawa'],
    phone: '(613) 599-8600',
    email: 'info@calian.com',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense systems integration and professional services'
  },
  {
    id: 'rheinmetall-ca',
    name: 'Rheinmetall Canada Inc.',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.rheinmetall.com/en/company/subsidiaries/rheinmetall-canada',
    careersUrl: 'https://www.rheinmetall.com/en/career',
    locations: ['Saint-Jean-sur-Richelieu, QC', 'Ottawa'],
    employees: '400+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Military vehicles and ammunition systems'
  },
  {
    id: 'mda-space',
    name: 'MDA (Maxar Defense & Space)',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.mda.space',
    careersUrl: 'https://www.mda.space/careers',
    locations: ['Brampton, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Space systems, satellites, and geointelligence'
  },
  {
    id: 'imp-aerospace',
    name: 'IMP Aerospace & Defence',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.impaerospaceanddefence.com',
    careersUrl: 'https://www.impaerospaceanddefence.com/join-the-team.php',
    locations: ['Abbotsford, BC', 'Trenton, ON', 'Ottawa, ON'],
    phone: '(902) 873-3900',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aerospace maintenance, repair, and overhaul'
  },
  {
    id: 'dew-engineering',
    name: 'DEW Engineering and Development',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.dewengineering.com',
    careersUrl: 'https://www.dewengineering.com/careers',
    locations: ['Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Electronic warfare and defense systems'
  },
  {
    id: 'collins-aerospace-ca',
    name: 'Collins Aerospace Canada (RTX)',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.collinsaerospace.com',
    careersUrl: 'https://careers.rtx.com/global/en/collins-aerospace',
    locations: ['Ottawa'],
    employees: '140',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aerospace systems and avionics'
  },
  {
    id: 'leonardo-drs',
    name: 'Leonardo DRS',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.leonardodrs.com',
    careersUrl: 'https://careers.leonardodrs.com/',
    locations: ['Multiple locations'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense electronics and advanced technology'
  },
  {
    id: 'pratt-whitney-ca',
    name: 'Pratt & Whitney Canada',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.pwc.ca',
    careersUrl: 'https://jobs-ca.pwc.com/ca/en',
    locations: ['Multiple Canadian facilities'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Aircraft engines and aerospace systems'
  },
  {
    id: 'magellan-aerospace',
    name: 'Magellan Aerospace',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.magellan.aero',
    careersUrl: 'https://www.magellan.aero/careers',
    locations: ['Multiple provinces'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aerospace systems and components'
  },

  // SPECIALIZED DEFENSE & TECHNOLOGY FIRMS
  {
    id: 'tactiql',
    name: 'TACTIQL Inc.',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.tactiql.com',
    careersUrl: 'https://www.tactiql.com/',
    locations: ['Ottawa, ON'],
    veteranFriendly: true,
    veteranOwned: true,
    securityClearanceJobs: true,
    description: 'VETERAN-OWNED: Military ISR data integration platform (FULCRUM)'
  },
  {
    id: 'h2-analytics',
    name: 'H2 Analytics',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.h2analytics.ca',
    careersUrl: 'https://www.h2analytics.ca/careers',
    locations: ['Ottawa, ON'],
    email: 'info@h2analytics.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Military training simulations and Exercise Architect Suite (EASE)'
  },
  {
    id: 'gamestrat',
    name: 'GameStrat',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.gamestrat.com',
    careersUrl: 'https://www.gamestrat.com/careers',
    locations: ['Ottawa, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Real-time video replay for tactical training'
  },
  {
    id: 'metropolitan-tech',
    name: 'Metropolitan Technologies',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.mettech.io',
    careersUrl: 'https://www.mettech.io/',
    locations: ['Ottawa, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Critical infrastructure cybersecurity platform'
  },
  {
    id: 'promaxis',
    name: 'Promaxis Systems',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.promaxis.com',
    careersUrl: 'https://www.promaxis.com/careers',
    locations: ['Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Professional services for government (40+ years experience)'
  },
  {
    id: 'snc-lavalin',
    name: 'SNC-Lavalin / AtkinsRéalis',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.snclavalin.com',
    careersUrl: 'https://careers.snclavalin.com/canada',
    locations: ['Multiple locations'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Engineering and nuclear services for defense'
  },
  {
    id: 'babcock-ca',
    name: 'Babcock Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.babcockinternational.com/canada',
    careersUrl: 'https://www.babcockinternational.com/careers',
    locations: ['Multiple locations'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Naval systems, submarine support, marine engineering'
  },
  {
    id: 'top-aces',
    name: 'Top Aces',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.topaces.com',
    careersUrl: 'https://www.topaces.com/',
    locations: ['Dorval (Montreal), QC'],
    employees: '251-500',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Adversary air training services'
  },
  {
    id: 'allen-vanguard',
    name: 'Allen-Vanguard (Chemring)',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.allenvanguard.com',
    careersUrl: 'https://www.allenvanguard.com/careers',
    locations: ['Ottawa, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Electronic warfare and radio frequency systems'
  },
  {
    id: 'ultra-electronics',
    name: 'Ultra Electronics',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.ultra-electronics.com',
    careersUrl: 'https://www.ultra-electronics.com/careers',
    locations: ['Canadian operations'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense and security systems'
  },

  // CYBERSECURITY & INTELLIGENCE
  {
    id: 'cyology-labs',
    name: 'Cyology Labs',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.cyologylabs.com',
    careersUrl: 'https://www.cyologylabs.com/careers',
    locations: ['Montreal, QC (nationwide)'],
    phone: '(514) 360-0123',
    email: 'info@cyologylabs.com',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Cybersecurity testing and penetration services'
  },
  {
    id: 'mindbridge-ai',
    name: 'MindBridge AI',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.mindbridge.ai',
    careersUrl: 'https://www.mindbridge.ai/careers',
    locations: ['Ottawa, ON'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'AI-powered financial risk detection and auditing'
  },
  {
    id: 'snyk',
    name: 'Snyk',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.snyk.io',
    careersUrl: 'https://www.snyk.io/careers',
    locations: ['Ottawa, ON'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Code and cloud infrastructure security'
  },

  // AVIATION & TRAINING
  {
    id: 'paladin-ai',
    name: 'Paladin AI Inc.',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.paladinai.com',
    careersUrl: 'https://www.paladinai.com/careers',
    locations: ['Montreal, QC'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'InstructIQ® - AI-powered flight training assessment'
  },
  {
    id: 'whale-seeker',
    name: 'Whale Seeker Inc.',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.whaleseeker.com',
    careersUrl: 'https://www.whaleseeker.com/careers',
    locations: ['Toronto, ON'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'AI detection systems and aerial imagery analysis'
  },

  // ADDITIONAL DEFENSE & AEROSPACE COMPANIES (50+ more)

  // Technology & Software
  {
    id: 'cgi',
    name: 'CGI Inc.',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.cgi.com',
    careersUrl: 'https://www.cgi.com/en/careers',
    locations: ['Montreal', 'Ottawa', 'Toronto', 'Calgary', 'Nationwide'],
    employees: '10,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'IT and business consulting services for government and defense'
  },
  {
    id: 'ibm-canada',
    name: 'IBM Canada',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.ibm.com/ca-en',
    careersUrl: 'https://www.ibm.com/careers',
    locations: ['Toronto', 'Ottawa', 'Montreal', 'Multiple cities'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Technology and consulting services including defense sector'
  },
  {
    id: 'microsoft-canada',
    name: 'Microsoft Canada',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.microsoft.com/en-ca',
    careersUrl: 'https://careers.microsoft.com',
    locations: ['Toronto', 'Vancouver', 'Montreal'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Cloud computing and cybersecurity for defense'
  },
  {
    id: 'cisco-canada',
    name: 'Cisco Systems Canada',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.cisco.com/c/en_ca',
    careersUrl: 'https://jobs.cisco.com',
    locations: ['Toronto', 'Ottawa', 'Vancouver'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Network security and defense communications'
  },
  {
    id: 'dell-emc-canada',
    name: 'Dell EMC Canada',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.dell.com/en-ca',
    careersUrl: 'https://jobs.dell.com',
    locations: ['Toronto', 'Ottawa', 'Calgary'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'IT infrastructure for defense and government'
  },

  // Engineering & Manufacturing
  {
    id: 'standard-aero',
    name: 'StandardAero',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.standardaero.com',
    careersUrl: 'https://www.standardaero.com/careers',
    locations: ['Winnipeg', 'Summerside, PE', 'Multiple'],
    employees: '2,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aircraft engine maintenance and repair for military'
  },
  {
    id: 'raytheon-anschutz-canada',
    name: 'Raytheon Anschütz Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.raytheon-anschuetz.com',
    careersUrl: 'https://www.raytheon-anschuetz.com/careers',
    locations: ['Kelowna, BC'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Naval navigation systems'
  },
  {
    id: 'elbit-systems-canada',
    name: 'Elbit Systems of Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://elbitsystems.com',
    careersUrl: 'https://elbitsystemscareer.com/?locale=en_US',
    locations: ['Montreal', 'Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Night vision, surveillance, and tactical systems'
  },
  {
    id: 'textron-systems-canada',
    name: 'Textron Systems Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.textronsystems.com',
    careersUrl: 'https://www.textron.com/Careers',
    locations: ['Hunt Valley, MD - Canadian operations'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'UAVs and unmanned systems'
  },
  {
    id: 'flir-systems',
    name: 'FLIR Systems (Teledyne)',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.flir.com',
    careersUrl: 'https://www.teledyne.com/careers',
    locations: ['Burlington, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Thermal imaging and surveillance systems'
  },

  // Communications & Electronics
  {
    id: 'ericsson-canada',
    name: 'Ericsson Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.ericsson.com/en/ca',
    careersUrl: 'https://www.ericsson.com/en/careers/global-locations/canada',
    locations: ['Ottawa', 'Montreal', 'Toronto'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Military communications systems'
  },
  {
    id: 'nokia-canada',
    name: 'Nokia Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.nokia.com',
    careersUrl: 'https://www.nokia.com/careers/our-locations/canada/',
    locations: ['Ottawa', 'Montreal'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Secure communications for defense'
  },
  {
    id: 'motorola-solutions-canada',
    name: 'Motorola Solutions Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.motorolasolutions.com',
    careersUrl: 'https://www.motorolasolutions.com/careers',
    locations: ['Nationwide'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Public safety and defense communications'
  },

  // Shipbuilding & Marine
  {
    id: 'seaspan-shipyards',
    name: 'Seaspan Shipyards',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.seaspan.com',
    careersUrl: 'https://www.seaspan.com/careers',
    locations: ['North Vancouver, BC'],
    employees: '2,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Naval shipbuilding - National Shipbuilding Strategy'
  },
  {
    id: 'irving-shipbuilding',
    name: 'Irving Shipbuilding',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.irvingshipbuilding.com',
    careersUrl: 'https://www.irvingshipbuilding.com/careers',
    locations: ['Halifax, NS'],
    employees: '2,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Naval shipbuilding - National Shipbuilding Strategy'
  },
  {
    id: 'davie-shipbuilding',
    name: 'Chantier Davie Canada (Davie Shipbuilding)',
    sector: 'defense',
    category: 'prime-contractor',
    website: 'https://www.davie.ca',
    careersUrl: 'https://www.davie.ca/en/careers/',
    locations: ['Lévis, QC'],
    employees: '1,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Naval shipbuilding and repair'
  },
  {
    id: 'heddle-shipyards',
    name: 'Heddle Shipyards',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.heddleshipyards.com',
    careersUrl: 'https://heddleshipyards.com/careers/',
    locations: ['Hamilton, ON', 'Thunder Bay, ON'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Marine vessel construction and repair'
  },

  // Consulting & Professional Services
  {
    id: 'deloitte-canada-defense',
    name: 'Deloitte Canada - Defense & Security',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.deloitte.com/ca',
    careersUrl: 'https://careers.deloitte.ca',
    locations: ['Toronto', 'Ottawa', 'Calgary', 'Nationwide'],
    employees: '15,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense consulting and professional services'
  },
  {
    id: 'pwc-canada-defense',
    name: 'PwC Canada - Defense Practice',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.pwc.com/ca',
    careersUrl: 'https://www.pwc.com/ca/en/careers',
    locations: ['Toronto', 'Ottawa', 'Montreal'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense sector consulting'
  },
  {
    id: 'kpmg-canada-defense',
    name: 'KPMG Canada - Defense Sector',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://home.kpmg/ca',
    careersUrl: 'https://home.kpmg/ca/en/home/careers',
    locations: ['Toronto', 'Ottawa', 'Vancouver'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense and security consulting'
  },
  {
    id: 'accenture-canada-defense',
    name: 'Accenture Canada - Federal Services',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.accenture.com/ca-en',
    careersUrl: 'https://www.accenture.com/ca-en/careers',
    locations: ['Toronto', 'Ottawa', 'Calgary'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense and federal IT consulting'
  },

  // Research & Development
  {
    id: 'drdc',
    name: 'Defence Research and Development Canada (DRDC)',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.canada.ca/en/defence-research-development',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs',
    locations: ['Ottawa', 'Valcartier, QC', 'Suffield, AB', 'Multiple'],
    employees: '2,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Government defense research and development'
  },
  {
    id: 'nrc-aerospace',
    name: 'National Research Council (NRC) - Aerospace',
    sector: 'defense',
    category: 'specialized',
    website: 'https://nrc.canada.ca/en/research-development/research-collaboration/programs/aerospace-program',
    careersUrl: 'https://nrc.canada.ca/en/corporate/careers',
    locations: ['Ottawa', 'Montreal'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aerospace research for defense applications'
  },

  // Training & Simulation
  {
    id: 'rheinmetall-expal-munitions',
    name: 'Rheinmetall Expal Munitions Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.rheinmetall-defence.com',
    careersUrl: 'https://www.rheinmetall.com/en/career',
    locations: ['Quebec'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Ammunition and munitions systems'
  },
  {
    id: 'meggitt-training-systems',
    name: 'Meggitt Training Systems Canada',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.meggitttrainingsystems.com',
    careersUrl: 'https://www.meggitttrainingsystems.com/careers',
    locations: ['British Columbia'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Military training systems and ranges'
  },

  // Space & Satellite
  {
    id: 'telesat',
    name: 'Telesat',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.telesat.com',
    careersUrl: 'https://www.telesat.com/careers',
    locations: ['Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Satellite communications for defense'
  },
  {
    id: 'canadarm3',
    name: 'MDA - Canadarm3 Program',
    sector: 'defense',
    category: 'specialized',
    website: 'https://mda.space',
    careersUrl: 'https://mda.space/careers',
    locations: ['Brampton, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Space robotics and systems'
  },

  // Smaller Defense Contractors
  {
    id: 'nova-systems',
    name: 'Nova Systems Canada',
    sector: 'defense',
    category: 'systems-integrator',
    website: 'https://www.novasystems.com',
    careersUrl: 'https://www.novasystems.com/careers',
    locations: ['Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense systems engineering and support'
  },
  {
    id: 'esterline-cmc-electronics',
    name: 'Esterline CMC Electronics (Collins Aerospace)',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.collinsaerospace.com',
    careersUrl: 'https://careers.rtx.com/global/en/collins-aerospace',
    locations: ['Montreal'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Avionics and electronics for military aircraft'
  },
  {
    id: 'heroux-devtek',
    name: 'Héroux-Devtek',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.herouxdevtek.com',
    careersUrl: 'https://www.herouxdevtek.com/en/careers',
    locations: ['Longueuil, QC', 'Montreal', 'Multiple'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Landing gear and aerospace components'
  },
  {
    id: 'imp-group',
    name: 'IMP Group International',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.impgroup.com',
    careersUrl: 'https://www.impgroup.com/careers',
    locations: ['Halifax', 'Multiple'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aerospace and defense services'
  },
  {
    id: 'safran-canada',
    name: 'Safran Canada',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.safran-group.com',
    careersUrl: 'https://www.safran-group.com/jobs',
    locations: ['Montreal', 'Multiple'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Aircraft systems and components'
  },

  // Intelligence & Security
  {
    id: 'forcepoint-canada',
    name: 'Forcepoint Canada',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.forcepoint.com',
    careersUrl: 'https://www.forcepoint.com/company/careers',
    locations: ['Ottawa', 'Toronto'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Cybersecurity for defense and intelligence'
  },
  {
    id: 'raytheon-blackbird',
    name: 'Raytheon Blackbird Technologies',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.rtx.com',
    careersUrl: 'https://www.rtx.com/raytheon/careers',
    locations: ['Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Intelligence and cybersecurity solutions'
  },
  {
    id: 'palantir-canada',
    name: 'Palantir Technologies Canada',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.palantir.com',
    careersUrl: 'https://www.palantir.com/careers',
    locations: ['Toronto', 'Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Data analytics for defense and intelligence'
  },
  {
    id: 'crowdstrike-canada',
    name: 'CrowdStrike Canada',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.crowdstrike.com',
    careersUrl: 'https://www.crowdstrike.com/careers',
    locations: ['Toronto', 'Remote'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Cybersecurity and threat intelligence'
  },

  // Maintenance & Support
  {
    id: 'cascade-aerospace',
    name: 'Cascade Aerospace',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.cascadeaerospace.com',
    careersUrl: 'https://www.cascadeaerospace.com/join-the-team/',
    locations: ['Abbotsford, BC'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Military aircraft maintenance and modifications'
  },
  {
    id: 'provincial-aerospace',
    name: 'Provincial Aerospace (PAL Aerospace)',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.provincialae rospace.com',
    careersUrl: 'https://palaerospace.com/careers/',
    locations: ['St. John\'s, NL', 'Multiple'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Maritime surveillance and defense aviation'
  },
  {
    id: 'viking-air',
    name: 'Viking Air (Longview Aviation)',
    sector: 'defense',
    category: 'aviation',
    website: 'https://www.vikingair.com',
    careersUrl: 'https://www.vikingair.com/careers',
    locations: ['Victoria, BC'],
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Aircraft manufacturing and support'
  },

  // Additional IT & Cyber
  {
    id: 'blackberry-qnx',
    name: 'BlackBerry QNX',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.blackberry.com/qnx',
    careersUrl: 'https://www.blackberry.com/us/en/company/careers',
    locations: ['Ottawa', 'Waterloo, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Secure embedded systems for defense'
  },
  {
    id: 'opentext-security',
    name: 'OpenText Security Solutions',
    sector: 'defense',
    category: 'cybersecurity',
    website: 'https://www.opentext.com',
    careersUrl: 'https://careers.opentext.com/us/en',
    locations: ['Waterloo, ON', 'Ottawa'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Enterprise security for government'
  },
  {
    id: 'solace-systems',
    name: 'Solace Systems',
    sector: 'defense',
    category: 'specialized',
    website: 'https://solace.com',
    careersUrl: 'https://solace.com/careers/',
    locations: ['Ottawa', 'Toronto'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Secure messaging for defense applications'
  },

  // Engineering Services
  {
    id: 'aecon-defense',
    name: 'Aecon Group - Defense Infrastructure',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.aecon.com',
    careersUrl: 'https://www.aecon.com/careers',
    locations: ['Toronto', 'Nationwide'],
    employees: '12,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Defense base construction and infrastructure'
  },
  {
    id: 'stantec-defense',
    name: 'Stantec - Defense Sector',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.stantec.com',
    careersUrl: 'https://www.stantec.com/en/careers',
    locations: ['Edmonton', 'Calgary', 'Nationwide'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Engineering and consulting for military facilities'
  },
  {
    id: 'wsp-defense',
    name: 'WSP Canada - Defense Projects',
    sector: 'defense',
    category: 'specialized',
    website: 'https://www.wsp.com/en-ca',
    careersUrl: 'https://www.wsp.com/en-ca/careers/job-opportunities',
    locations: ['Toronto', 'Montreal', 'Nationwide'],
    employees: '12,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Engineering services for defense infrastructure'
  },

  // ======================
  // PUBLIC SAFETY
  // ======================
  {
    id: 'rcmp',
    name: 'Royal Canadian Mounted Police (RCMP)',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.rcmp-grc.gc.ca',
    careersUrl: 'https://www.rcmp-grc.gc.ca/en/careers',
    locations: ['Nationwide'],
    employees: '30,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Canada\'s national police service - actively recruits military veterans'
  },
  {
    id: 'toronto-police',
    name: 'Toronto Police Service',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.torontopolice.on.ca',
    careersUrl: 'https://www.tps.ca/careers/',
    locations: ['Toronto, ON'],
    employees: '7,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Canada\'s largest municipal police service'
  },
  {
    id: 'csc',
    name: 'Correctional Service Canada',
    sector: 'public-safety',
    category: 'corrections',
    website: 'https://www.csc-scc.gc.ca',
    careersUrl: 'https://www.csc-scc.gc.ca/careers/index-eng.shtml',
    locations: ['Nationwide'],
    employees: '18,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Federal corrections - values military leadership experience'
  },

  // ======================
  // LOGISTICS & TRANSPORTATION
  // ======================
  {
    id: 'cn-rail',
    name: 'Canadian National Railway (CN)',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.cn.ca',
    careersUrl: 'https://www.cn.ca/en/careers',
    locations: ['Nationwide'],
    employees: '24,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Major railway operator - values veteran discipline and safety focus'
  },
  {
    id: 'cp-rail',
    name: 'Canadian Pacific Kansas City (CPKC)',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.cpkcr.com',
    careersUrl: 'https://www.cpkcr.com/en/careers',
    locations: ['Nationwide'],
    employees: '20,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Railway and logistics - veteran hiring initiatives'
  },
  {
    id: 'purolator',
    name: 'Purolator Inc.',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.purolator.com',
    careersUrl: 'https://careers.purolator.com/',
    locations: ['Nationwide'],
    employees: '13,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Canada\'s leading integrated freight and parcel solutions provider'
  },

  // ======================
  // CONSTRUCTION & TRADES
  // ======================
  {
    id: 'aecon',
    name: 'Aecon Group Inc.',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.aecon.com',
    careersUrl: 'https://www.aecon.com/careers',
    locations: ['Nationwide'],
    employees: '12,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Major infrastructure construction - values military project management'
  },
  {
    id: 'pcl-construction',
    name: 'PCL Construction',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.pcl.com',
    careersUrl: 'https://www.pcl.com/careers',
    locations: ['Nationwide'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Employee-owned construction company - veteran apprenticeship programs'
  },

  // ======================
  // GOVERNMENT AGENCIES
  // ======================
  {
    id: 'cbsa',
    name: 'Canada Border Services Agency',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.cbsa-asfc.gc.ca',
    careersUrl: 'https://www.cbsa-asfc.gc.ca/job-emploi/menu-eng.html',
    locations: ['Nationwide - Border Crossings'],
    employees: '14,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'secret',
    description: 'Border security - actively recruits military veterans'
  },
  {
    id: 'csis',
    name: 'Canadian Security Intelligence Service',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.canada.ca/en/security-intelligence-service.html',
    careersUrl: 'https://www.canada.ca/en/security-intelligence-service/corporate/csis-jobs/available-jobs.html',
    locations: ['Ottawa', 'Regional Offices'],
    employees: '3,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'top-secret',
    description: 'Intelligence service - military experience highly valued'
  },
  {
    id: 'service-canada',
    name: 'Service Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Nationwide'],
    employees: '30,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Federal service delivery - priority hiring for veterans'
  },

  // ======================
  // TECH & CYBERSECURITY
  // ======================
  {
    id: 'shopify',
    name: 'Shopify',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.shopify.com',
    careersUrl: 'https://www.shopify.com/careers',
    locations: ['Ottawa', 'Toronto', 'Montreal', 'Remote'],
    employees: '10,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'E-commerce platform - welcomes veteran transition to tech'
  },
  {
    id: 'blackberry-cylance',
    name: 'BlackBerry Cylance',
    sector: 'tech-cybersecurity',
    category: 'cybersecurity',
    website: 'https://www.blackberry.com/us/en/products/cylance-endpoint-security',
    careersUrl: 'https://www.blackberry.com/us/en/company/careers',
    locations: ['Waterloo, ON', 'Ottawa'],
    employees: '3,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Cybersecurity - values military security expertise'
  },
  {
    id: 'cse',
    name: 'Communications Security Establishment (CSE)',
    sector: 'tech-cybersecurity',
    category: 'federal-agency',
    website: 'https://www.cse-cst.gc.ca',
    careersUrl: 'https://www.cse-cst.gc.ca/en/careers',
    locations: ['Ottawa'],
    employees: '2,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'top-secret',
    description: 'Signals intelligence - priority recruitment for military cyber specialists'
  },

  // ======================
  // UTILITIES & ENERGY
  // ======================
  {
    id: 'hydro-one',
    name: 'Hydro One',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.hydroone.com',
    careersUrl: 'https://jobs.hydroone.com/',
    locations: ['Ontario'],
    employees: '9,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Electrical utility - skilled trades and technical positions'
  },
  {
    id: 'tc-energy',
    name: 'TC Energy',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.tcenergy.com',
    careersUrl: 'https://www.tcenergy.com/careers/',
    locations: ['Calgary', 'Multiple Locations'],
    employees: '7,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Energy infrastructure - values military technical skills'
  },

  // ======================
  // MANUFACTURING
  // ======================
  {
    id: 'magna',
    name: 'Magna International',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.magna.com',
    careersUrl: 'https://www.magna.com/careers',
    locations: ['Nationwide'],
    employees: '171,000+ globally, 20,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Automotive manufacturing - technical and operations roles'
  },
  {
    id: 'linamar',
    name: 'Linamar Corporation',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.linamar.com',
    careersUrl: 'https://www.linamar.com/careers',
    locations: ['Guelph, ON', 'Multiple Locations'],
    employees: '29,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Manufacturing - precision machining and technical skills'
  },

  // ======================
  // HEALTHCARE
  // ======================
  {
    id: 'vac-health',
    name: 'Veterans Affairs Canada - Health Services',
    sector: 'healthcare',
    category: 'federal-agency',
    website: 'https://www.veterans.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Nationwide'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Healthcare services for veterans - priority hiring for veterans'
  },
  {
    id: 'sunnybrook-health',
    name: 'Sunnybrook Health Sciences Centre',
    sector: 'healthcare',
    category: 'hospital',
    website: 'https://sunnybrook.ca',
    careersUrl: 'https://sunnybrook.ca/content/?page=careers-search',
    locations: ['Toronto, ON'],
    employees: '10,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Major trauma center - veteran healthcare expertise valued'
  },
  {
    id: 'ottawa-hospital',
    name: 'The Ottawa Hospital',
    sector: 'healthcare',
    category: 'hospital',
    website: 'https://www.ottawahospital.on.ca',
    careersUrl: 'https://www.ottawahospital.on.ca/en/career-opportunities/',
    locations: ['Ottawa, ON'],
    employees: '12,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Academic health sciences center - diverse healthcare roles'
  },
  {
    id: 'providence-health',
    name: 'Providence Health Care',
    sector: 'healthcare',
    category: 'hospital',
    website: 'https://www.providencehealthcare.org',
    careersUrl: 'https://www.providencehealthcare.org/careers',
    locations: ['Vancouver, BC'],
    employees: '6,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Healthcare network - values veteran medical and leadership experience'
  },

  // ======================
  // RETAIL & HOSPITALITY (expanded)
  // ======================
  {
    id: 'canadian-tire',
    name: 'Canadian Tire Corporation',
    sector: 'retail-hospitality',
    category: 'retail',
    website: 'https://www.canadiantire.ca',
    careersUrl: 'https://www.canadiantirecareers.com/home',
    locations: ['Nationwide'],
    employees: '100,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Retail leader - management, distribution, and technical roles'
  },
  {
    id: 'loblaws',
    name: 'Loblaws Companies Limited',
    sector: 'retail-hospitality',
    category: 'retail',
    website: 'https://www.loblaw.ca',
    careersUrl: 'https://jobs.loblaw.ca/',
    locations: ['Nationwide'],
    employees: '200,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Grocery and retail - management, logistics, and operations'
  },
  {
    id: 'tim-hortons',
    name: 'Tim Hortons',
    sector: 'retail-hospitality',
    category: 'hospitality',
    website: 'https://www.timhortons.ca',
    careersUrl: 'https://jobs.timhortons.ca/',
    locations: ['Nationwide'],
    employees: '100,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Restaurant franchise - management and operations roles'
  },
  {
    id: 'marriott-canada',
    name: 'Marriott Hotels Canada',
    sector: 'retail-hospitality',
    category: 'hospitality',
    website: 'https://www.marriott.com',
    careersUrl: 'https://jobs.marriott.com/corporate/',
    locations: ['Major Cities'],
    employees: '15,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Hospitality - veteran hiring program for management roles'
  },
  {
    id: 'home-depot-canada',
    name: 'Home Depot Canada',
    sector: 'retail-hospitality',
    category: 'retail',
    website: 'https://www.homedepot.ca',
    careersUrl: 'https://careers.homedepot.ca/',
    locations: ['Nationwide'],
    employees: '28,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Home improvement retail - values trades and technical skills'
  },

  // ======================
  // PUBLIC SAFETY (expanded)
  // ======================
  {
    id: 'vancouver-police',
    name: 'Vancouver Police Department',
    sector: 'public-safety',
    category: 'police',
    website: 'https://vpd.ca',
    careersUrl: 'https://vpd.ca/recruit/',
    locations: ['Vancouver, BC'],
    employees: '1,900+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Municipal police - recruits veterans for sworn and civilian roles'
  },
  {
    id: 'calgary-police',
    name: 'Calgary Police Service',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.calgary.ca/cps.html',
    careersUrl: 'https://join.calgarypolice.ca/',
    locations: ['Calgary, AB'],
    employees: '2,900+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Municipal police - veteran recruitment programs'
  },

  // PROVINCIAL POLICE FORCES
  {
    id: 'opp',
    name: 'Ontario Provincial Police (OPP)',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.opp.ca',
    careersUrl: 'https://www.opp.ca/index.php?id=128',
    locations: ['Province-wide, ON'],
    employees: '8,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability' as const,
    description: 'Provincial police force serving Ontario communities'
  },
  {
    id: 'surete-quebec',
    name: 'Sûreté du Québec (SQ)',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.sq.gouv.qc.ca',
    careersUrl: 'https://www.sq.gouv.qc.ca/carriere/',
    locations: ['Province-wide, QC'],
    employees: '5,500+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Quebec provincial police force'
  },
  {
    id: 'rnc',
    name: 'Royal Newfoundland Constabulary',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.rnc.gov.nl.ca',
    careersUrl: 'https://www.rnc.gov.nl.ca/join-the-rnc/',
    locations: ['St. John\'s, Corner Brook, Labrador City, NL'],
    employees: '400+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Provincial police serving major NL cities'
  },

  // BRITISH COLUMBIA POLICE SERVICES
  {
    id: 'vancouver-police',
    name: 'Vancouver Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://vpd.ca',
    careersUrl: 'https://vpd.ca/join-us/',
    locations: ['Vancouver, BC'],
    employees: '1,600+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Vancouver municipal police service'
  },
  {
    id: 'surrey-police',
    name: 'Surrey Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.surreypolice.ca',
    careersUrl: 'https://careers.surreypolice.ca/',
    locations: ['Surrey, BC'],
    employees: '930+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Surrey\'s municipal police service'
  },
  {
    id: 'saanich-police',
    name: 'Saanich Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://joinspd.ca',
    careersUrl: 'https://joinspd.ca/',
    locations: ['Saanich, BC'],
    employees: '185+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Greater Victoria area police service'
  },
  {
    id: 'abbotsford-police',
    name: 'Abbotsford Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.abbypd.ca',
    careersUrl: 'https://www.abbypd.ca/police-officer-recruit-training',
    locations: ['Abbotsford, BC'],
    employees: '319+',
    email: 'recruiting@abbypd.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Abbotsford municipal police'
  },
  {
    id: 'new-westminster-police',
    name: 'New Westminster Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.nwpolice.org',
    careersUrl: 'https://www.nwpolice.org/join-nwpd/police-officer/',
    locations: ['New Westminster, BC'],
    employees: '200+',
    email: 'recruiting@nwpolice.org',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'New Westminster police service'
  },
  {
    id: 'delta-police',
    name: 'Delta Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.deltapolice.ca',
    careersUrl: 'https://www.deltapolice.ca/joindpd',
    locations: ['Delta, BC'],
    employees: '200+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Delta municipal police'
  },
  {
    id: 'west-vancouver-police',
    name: 'West Vancouver Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://westvanpolice.ca',
    careersUrl: 'https://westvanpolice.ca/join-us/',
    locations: ['West Vancouver, BC'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'West Vancouver police service'
  },
  {
    id: 'port-moody-police',
    name: 'Port Moody Police Department',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://portmoodypolice.ca',
    careersUrl: 'https://portmoodypolice.ca/join-pmpd/',
    locations: ['Port Moody, BC'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Port Moody police service'
  },

  // ALBERTA POLICE SERVICES
  {
    id: 'edmonton-police',
    name: 'Edmonton Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.edmontonpolice.ca',
    careersUrl: 'https://joineps.ca/',
    locations: ['Edmonton, AB'],
    employees: '1,800+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Edmonton municipal police service'
  },
  {
    id: 'lethbridge-police',
    name: 'Lethbridge Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.lethbridgepolice.ca',
    careersUrl: 'https://www.lethbridgepolice.ca/join-our-team/',
    locations: ['Lethbridge, AB'],
    email: 'recruiting@lethbridgepolice.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Lethbridge municipal police'
  },
  {
    id: 'medicine-hat-police',
    name: 'Medicine Hat Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://mhps.ca',
    careersUrl: 'https://mhps.ca/posts/post/148',
    locations: ['Medicine Hat, AB'],
    email: 'recruiting@mhps.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Medicine Hat police service'
  },

  // SASKATCHEWAN POLICE SERVICES
  {
    id: 'regina-police',
    name: 'Regina Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://reginapolice.ca',
    careersUrl: 'https://join.reginapolice.ca/',
    locations: ['Regina, SK'],
    employees: '400+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Regina municipal police service'
  },
  {
    id: 'saskatoon-police',
    name: 'Saskatoon Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://saskatoonpolice.ca',
    careersUrl: 'https://join.saskatoonpolice.ca/',
    locations: ['Saskatoon, SK'],
    employees: '500+',
    email: 'recruiting@police.saskatoon.sk.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Saskatoon municipal police'
  },

  // MANITOBA POLICE SERVICES
  {
    id: 'winnipeg-police',
    name: 'Winnipeg Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.winnipeg.ca/police',
    careersUrl: 'https://www.winnipeg.ca/police/recruitment',
    locations: ['Winnipeg, MB'],
    employees: '1,400+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Winnipeg municipal police service'
  },

  // ONTARIO POLICE SERVICES (Major Cities)
  {
    id: 'peel-regional-police',
    name: 'Peel Regional Police',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.peelpolice.ca',
    careersUrl: 'https://joinus.peelpolice.ca/',
    locations: ['Mississauga, Brampton, Caledon, ON'],
    employees: '3,100+',
    email: 'joinus@peelpolice.com',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Peel Region police - veteran programs'
  },
  {
    id: 'york-regional-police',
    name: 'York Regional Police',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.yrp.ca',
    careersUrl: 'https://jobs.yrp.ca/',
    locations: ['Markham, Vaughan, Richmond Hill, Newmarket, ON'],
    employees: '1,800+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'York Region police service'
  },
  {
    id: 'durham-regional-police',
    name: 'Durham Regional Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.drps.ca',
    careersUrl: 'https://joindrps.ca/',
    locations: ['Oshawa, Whitby, Ajax, Pickering, ON'],
    employees: '800+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Durham Region police'
  },
  {
    id: 'halton-regional-police',
    name: 'Halton Regional Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.haltonpolice.ca',
    careersUrl: 'https://careers.haltonpolice.ca/',
    locations: ['Burlington, Oakville, Milton, Halton Hills, ON'],
    employees: '800+',
    email: 'policerecruiting@haltonpolice.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Halton Region police'
  },
  {
    id: 'waterloo-regional-police',
    name: 'Waterloo Regional Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://wrps.ca',
    careersUrl: 'https://wrps.ca/careers',
    locations: ['Kitchener, Waterloo, Cambridge, ON'],
    employees: '1,200+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Waterloo Region police'
  },
  {
    id: 'ottawa-police',
    name: 'Ottawa Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.ottawapolice.ca',
    careersUrl: 'https://jobs-emplois.ottawa.ca/OttawaPolice',
    locations: ['Ottawa, ON'],
    employees: '1,400+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Ottawa municipal police - bilingual'
  },
  {
    id: 'hamilton-police',
    name: 'Hamilton Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://hamiltonpolice.on.ca',
    careersUrl: 'https://hamiltonpolice.on.ca/careers',
    locations: ['Hamilton, ON'],
    employees: '1,160+',
    email: 'recruiting@hamiltonpolice.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Hamilton municipal police'
  },
  {
    id: 'niagara-regional-police',
    name: 'Niagara Regional Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.niagarapolice.ca',
    careersUrl: 'https://www.niagarapolice.ca/en/careersopportunities.aspx',
    locations: ['St. Catharines, Niagara Falls, Welland, ON'],
    employees: '1,020+',
    email: 'recruiting@niagarapolice.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Niagara Region police'
  },
  {
    id: 'london-police',
    name: 'London Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.londonpolice.ca',
    careersUrl: 'https://www.londonpolice.ca/en/careers/Careers.aspx',
    locations: ['London, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'London municipal police'
  },
  {
    id: 'windsor-police',
    name: 'Windsor Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://windsorpolice.ca',
    careersUrl: 'https://windsorpolice.ca/careers',
    locations: ['Windsor, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Windsor municipal police'
  },
  {
    id: 'sudbury-police',
    name: 'Greater Sudbury Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.gsps.ca',
    careersUrl: 'https://www.gsps.ca/en/jobs-and-opportunities/jobs-and-opportunities.aspx',
    locations: ['Greater Sudbury, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Greater Sudbury police'
  },
  {
    id: 'thunder-bay-police',
    name: 'Thunder Bay Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.thunderbaypolice.ca',
    careersUrl: 'https://www.thunderbaypolice.ca/careers',
    locations: ['Thunder Bay, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Thunder Bay municipal police'
  },
  {
    id: 'barrie-police',
    name: 'Barrie Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.barriepolice.ca',
    careersUrl: 'https://www.barriepolice.ca/join-our-team/',
    locations: ['Barrie, ON'],
    email: 'recruitment@barriepolice.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Barrie municipal police'
  },
  {
    id: 'guelph-police',
    name: 'Guelph Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.guelphpolice.ca',
    careersUrl: 'https://www.guelphpolice.ca/en/careers/careers-overview.aspx',
    locations: ['Guelph, ON'],
    email: 'careers@guelphpolice.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Guelph municipal police'
  },
  {
    id: 'brantford-police',
    name: 'Brantford Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.brantfordpolice.ca',
    careersUrl: 'https://www.brantfordpolice.ca/sworn-recruiting',
    locations: ['Brantford, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Brantford municipal police'
  },
  {
    id: 'cornwall-police',
    name: 'Cornwall Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://cornwallpolice.ca',
    careersUrl: 'https://cornwallpolice.ca/careers',
    locations: ['Cornwall, ON'],
    employees: '190+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Cornwall municipal police'
  },
  {
    id: 'chatham-kent-police',
    name: 'Chatham-Kent Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://ckpolice.com',
    careersUrl: 'https://ckpolice.com/about/employment/',
    locations: ['Chatham-Kent, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Chatham-Kent police'
  },
  {
    id: 'sarnia-police',
    name: 'Sarnia Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.sarniapolice.ca',
    careersUrl: 'https://www.sarniapolice.ca/police-constables',
    locations: ['Sarnia, ON'],
    email: 'recruitment@police.sarnia.on.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Sarnia municipal police'
  },
  {
    id: 'kawartha-lakes-police',
    name: 'Kawartha Lakes Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://kawarthalakespolice.com',
    careersUrl: 'https://kawarthalakespolice.com/join-our-team',
    locations: ['Kawartha Lakes, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Kawartha Lakes police'
  },
  {
    id: 'timmins-police',
    name: 'Timmins Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://timminspolice.ca',
    careersUrl: 'https://timminspolice.ca/careers/',
    locations: ['Timmins, ON'],
    email: 'tpsrecruitment@timmins.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Timmins municipal police'
  },

  // QUEBEC POLICE SERVICES
  {
    id: 'spvm',
    name: 'Service de police de la Ville de Montréal (SPVM)',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://spvm.qc.ca',
    careersUrl: 'https://spvm.qc.ca/en/Pages/careers',
    locations: ['Montreal, QC'],
    employees: '4,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Montreal police service - bilingual'
  },
  {
    id: 'spvq',
    name: 'Service de police de la Ville de Québec (SPVQ)',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.ville.quebec.qc.ca/citoyens/police',
    careersUrl: 'https://www.ville.quebec.qc.ca/citoyens/police/organisation/recrutement/',
    locations: ['Quebec City, QC'],
    employees: '1,080+',
    phone: '418-641-6411',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Quebec City police - bilingual'
  },
  {
    id: 'laval-police',
    name: 'Service de police de Laval',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.laval.ca',
    careersUrl: 'https://www.laval.ca/en/police/careers/',
    locations: ['Laval, QC'],
    phone: '450-662-4242',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Laval police service'
  },
  {
    id: 'longueuil-police',
    name: 'Service de police de l\'agglomération de Longueuil',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://longueuil.quebec',
    careersUrl: 'https://longueuil.quebec/fr/services/SPAL/emplois-spal',
    locations: ['Longueuil, QC'],
    phone: '450-463-7100',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Longueuil police service'
  },

  // ATLANTIC CANADA POLICE
  {
    id: 'halifax-police',
    name: 'Halifax Regional Police',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.halifax.ca/fire-police/police',
    careersUrl: 'https://www.halifax.ca/about-halifax/employment/work-halifax-regional-police',
    locations: ['Halifax, NS'],
    employees: '500+',
    email: 'hrprecruiting@halifax.ca',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Halifax regional police'
  },
  {
    id: 'cape-breton-police',
    name: 'Cape Breton Regional Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.cbrps.ca',
    careersUrl: 'https://www.cbrps.ca/join-cbrps/join-cbrps',
    locations: ['Sydney, NS'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Cape Breton regional police'
  },

  // INDIGENOUS POLICE SERVICES
  {
    id: 'naps',
    name: 'Nishnawbe-Aski Police Service (NAPS)',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.naps.ca',
    careersUrl: 'https://joinnaps.ca/',
    locations: ['34 First Nations, Northern ON'],
    veteranFriendly: true,
    veteranOwned: false,
    securityClearanceJobs: true,
    description: 'Indigenous police serving 34 First Nation communities'
  },
  {
    id: 'anishinabek-police',
    name: 'Anishinabek Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.anishinabekpolice.ca',
    careersUrl: 'https://www.anishinabekpolice.ca/careers',
    locations: ['16 First Nations, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Indigenous police - 16 First Nations'
  },
  {
    id: 'treaty-three-police',
    name: 'Treaty Three Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.t3ps.ca',
    careersUrl: 'https://www.t3ps.ca/careers/',
    locations: ['Treaty Three Territory, ON'],
    employees: '85+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Indigenous police - Treaty Three Territory'
  },
  {
    id: 'uccm-police',
    name: 'UCCM Anishnaabe Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.uccmpolice.com',
    careersUrl: 'https://www.uccmpolice.com/careers',
    locations: ['Manitoulin Island, ON'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Indigenous police - Manitoulin Island'
  },
  {
    id: 'blood-tribe-police',
    name: 'Blood Tribe Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.bloodtribepolice.com',
    careersUrl: 'https://www.bloodtribepolice.com/careers',
    locations: ['Blood Tribe Reserve, AB'],
    employees: '50+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Indigenous police - Blood Tribe'
  },
  {
    id: 'kahnawake-peacekeepers',
    name: 'Kahnawake Peacekeepers',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://kahnawakepeacekeepers.ca',
    careersUrl: 'https://kahnawakepeacekeepers.ca/',
    locations: ['Kahnawake Mohawk Territory, QC'],
    employees: '30-40',
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Indigenous police - Kahnawake Mohawk'
  },
  {
    id: 'manitoba-first-nations-police',
    name: 'Manitoba First Nations Police Service',
    sector: 'public-safety' as const,
    category: 'police' as const,
    website: 'https://www.mfnp.ca',
    careersUrl: 'https://www.mfnp.ca/',
    locations: ['First Nations, MB'],
    veteranFriendly: true,
    securityClearanceJobs: true,
    description: 'Indigenous police - Manitoba First Nations'
  },
  {
    id: 'canada-post-security',
    name: 'Canada Post - Security Services',
    sector: 'public-safety',
    category: 'corporate-security',
    website: 'https://www.canadapost.ca',
    careersUrl: 'https://jobs.canadapost.ca/',
    locations: ['Nationwide'],
    employees: '3,000+ security staff',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Corporate security - values military security experience'
  },
  {
    id: 'garda-world',
    name: 'GardaWorld Security',
    sector: 'public-safety',
    category: 'corporate-security',
    website: 'https://www.garda.com',
    careersUrl: 'https://www.garda.com/careers',
    locations: ['Nationwide'],
    employees: '5,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Private security - actively recruits military veterans'
  },

  // ======================
  // LOGISTICS & TRANSPORTATION (expanded)
  // ======================
  {
    id: 'canada-post',
    name: 'Canada Post',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.canadapost.ca',
    careersUrl: 'https://jobs.canadapost.ca/',
    locations: ['Nationwide'],
    employees: '64,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'National postal service - logistics, operations, and management'
  },
  {
    id: 'fedex-canada',
    name: 'FedEx Canada',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.fedex.com/en-ca',
    careersUrl: 'https://www.fedex.com/en-ca/careers.html',
    locations: ['Nationwide'],
    employees: '8,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'International logistics - operations and management roles'
  },
  {
    id: 'ups-canada',
    name: 'UPS Canada',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.ups.com/ca/en',
    careersUrl: 'https://www.jobs-ups.com/',
    locations: ['Nationwide'],
    employees: '7,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Package delivery - management and operations opportunities'
  },
  {
    id: 'air-canada',
    name: 'Air Canada',
    sector: 'logistics-transportation',
    category: 'aviation',
    website: 'https://www.aircanada.com',
    careersUrl: 'https://careers.aircanada.com/ca/en',
    locations: ['Nationwide'],
    employees: '36,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'National airline - aviation and operations roles for veterans'
  },
  {
    id: 'westjet',
    name: 'WestJet Airlines',
    sector: 'logistics-transportation',
    category: 'aviation',
    website: 'https://www.westjet.com',
    careersUrl: 'https://www.westjet.com/en-ca/careers',
    locations: ['Calgary', 'Major Cities'],
    employees: '14,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Airline carrier - pilots, maintenance, and operations'
  },

  // ======================
  // CONSTRUCTION & TRADES (expanded)
  // ======================
  {
    id: 'ellisdon',
    name: 'EllisDon Corporation',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.ellisdon.com',
    careersUrl: 'https://recruiting.ultipro.ca/ELL5000/JobBoard/fa7dd324-0b16-f8cb-f544-f46b499e5db7',
    locations: ['Nationwide'],
    employees: '4,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Construction - project management and skilled trades'
  },
  {
    id: 'bird-construction',
    name: 'Bird Construction',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.bird.ca',
    careersUrl: 'https://careers.bird.ca/ca/en',
    locations: ['Nationwide'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Heavy construction - civil, mining, and infrastructure projects'
  },
  {
    id: 'ledcor',
    name: 'Ledcor Group',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.ledcor.com',
    careersUrl: 'https://jobs.ledcor.com/',
    locations: ['Western Canada'],
    employees: '7,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Construction and infrastructure - diverse trades opportunities'
  },

  // ======================
  // GOVERNMENT (expanded)
  // ======================
  {
    id: 'dnd-civilian',
    name: 'Department of National Defence - Civilian',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.canada.ca/en/department-national-defence.html',
    careersUrl: 'https://www.canada.ca/en/department-national-defence/corporate/job-opportunities.html',
    locations: ['Nationwide'],
    employees: '24,000+ civilians',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'DND civilian jobs - priority hiring for former CAF members'
  },
  {
    id: 'transport-canada',
    name: 'Transport Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.tc.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Nationwide'],
    employees: '6,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Transportation regulation - aviation and marine expertise valued'
  },
  {
    id: 'public-services-procurement',
    name: 'Public Services and Procurement Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.tpsgc-pwgsc.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Ottawa', 'Regional Offices'],
    employees: '12,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Federal procurement and services - project management roles'
  },
  {
    id: 'veterans-affairs-canada',
    name: 'Veterans Affairs Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.veterans.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Charlottetown, PE', 'Regional Offices Nationwide'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Department serving veterans - priority hiring for former CAF members'
  },
  {
    id: 'parks-canada',
    name: 'Parks Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.pc.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['National Parks Nationwide'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Park operations, conservation, law enforcement - outdoor leadership roles'
  },
  {
    id: 'fisheries-oceans',
    name: 'Fisheries and Oceans Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.dfo-mpo.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Coastal Regions', 'Ottawa'],
    employees: '11,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Marine operations, coast guard support - maritime experience valued'
  },
  {
    id: 'correctional-service-canada',
    name: 'Correctional Service Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.csc-scc.gc.ca',
    careersUrl: 'https://www.csc-scc.gc.ca/careers/index-eng.shtml',
    locations: ['Nationwide'],
    employees: '18,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Federal corrections - correctional officers and security roles'
  },
  {
    id: 'immigration-refugees-citizenship',
    name: 'Immigration, Refugees and Citizenship Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Nationwide', 'International Offices'],
    employees: '8,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'secret',
    description: 'Immigration services - investigation and enforcement roles'
  },
  {
    id: 'global-affairs-canada',
    name: 'Global Affairs Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.international.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Ottawa', 'International Postings'],
    employees: '11,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'top-secret',
    description: 'Foreign service - security, intelligence, and diplomatic roles'
  },
  {
    id: 'employment-social-development',
    name: 'Employment and Social Development Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.canada.ca/en/employment-social-development.html',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Nationwide'],
    employees: '23,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Social programs administration - service delivery roles'
  },
  {
    id: 'natural-resources-canada',
    name: 'Natural Resources Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.nrcan.gc.ca',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Ottawa', 'Regional Offices'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Energy, mining, forestry regulation - technical and field roles'
  },
  {
    id: 'environment-climate-change',
    name: 'Environment and Climate Change Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.canada.ca/en/environment-climate-change.html',
    careersUrl: 'https://www.canada.ca/en/public-service-commission/jobs.html',
    locations: ['Nationwide'],
    employees: '7,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Environmental protection - enforcement and conservation roles'
  },

  // ======================
  // CROWN CORPORATIONS
  // ======================
  {
    id: 'canada-post',
    name: 'Canada Post',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.canadapost.ca',
    careersUrl: 'https://jobs.canadapost.ca/',
    locations: ['Nationwide'],
    employees: '55,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'National postal service - logistics, delivery, and operations roles'
  },
  {
    id: 'via-rail',
    name: 'VIA Rail Canada',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.viarail.ca',
    careersUrl: 'https://careers.viarail.ca/',
    locations: ['Montreal', 'Toronto', 'Vancouver', 'Major Rail Corridors'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Passenger rail service - operations, maintenance, and customer service'
  },
  {
    id: 'nav-canada',
    name: 'NAV CANADA',
    sector: 'logistics-transportation',
    category: 'aviation',
    website: 'https://www.navcanada.ca',
    careersUrl: 'https://www.navcanada.ca/en/careers.aspx',
    locations: ['Nationwide'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Air navigation services - air traffic control and technical roles'
  },
  {
    id: 'cbc-radio-canada',
    name: 'CBC/Radio-Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.cbc.ca',
    careersUrl: 'https://cbc.radio-canada.ca/en/working-with-us',
    locations: ['Nationwide'],
    employees: '7,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'National broadcaster - technical, operations, and production roles'
  },
  {
    id: 'atomic-energy-canada',
    name: 'Atomic Energy of Canada Limited',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.aecl.ca',
    careersUrl: 'https://www.aecl.ca/about-aecl/employment-with-aecl/',
    locations: ['Chalk River, ON', 'Pinawa, MB'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'secret',
    description: 'Nuclear science and technology - technical and security roles'
  },
  {
    id: 'canada-lands-company',
    name: 'Canada Lands Company',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.clc.ca',
    careersUrl: 'https://www.clc.ca/careers',
    locations: ['Toronto', 'Vancouver', 'Ottawa', 'Calgary'],
    employees: '300+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Federal property development - project management and real estate'
  },
  {
    id: 'export-development-canada',
    name: 'Export Development Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.edc.ca',
    careersUrl: 'https://www.edc.ca/en/about-us/careers.html',
    locations: ['Ottawa', 'Regional Offices'],
    employees: '1,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Export financing - risk analysis and international business roles'
  },
  {
    id: 'marine-atlantic',
    name: 'Marine Atlantic',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.marineatlantic.ca',
    careersUrl: 'https://careers-carrieres.ma.ca/',
    locations: ['Port aux Basques, NL', 'North Sydney, NS'],
    employees: '1,400+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Ferry service - marine operations and maintenance roles'
  },
  {
    id: 'canada-mortgage-housing',
    name: 'Canada Mortgage and Housing Corporation',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.cmhc-schl.gc.ca',
    careersUrl: 'https://careers.cmhc-schl.gc.ca/',
    locations: ['Ottawa', 'Regional Offices'],
    employees: '2,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Housing finance - analysis and program administration'
  },
  {
    id: 'business-development-bank',
    name: 'Business Development Bank of Canada',
    sector: 'government',
    category: 'federal-agency',
    website: 'https://www.bdc.ca',
    careersUrl: 'https://www.bdc.ca/en/about/careers',
    locations: ['Nationwide'],
    employees: '2,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Small business financing - financial services and consulting'
  },

  // ======================
  // TECH & CYBERSECURITY (expanded)
  // ======================
  {
    id: 'opentext',
    name: 'OpenText',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.opentext.com',
    careersUrl: 'https://careers.opentext.com/us/en',
    locations: ['Waterloo, ON', 'Multiple Locations'],
    employees: '14,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Enterprise software - technical and security roles'
  },
  {
    id: 'cgi-group',
    name: 'CGI Inc.',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.cgi.com',
    careersUrl: 'https://www.cgi.com/en/careers',
    locations: ['Nationwide'],
    employees: '21,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'IT consulting - government and defense IT projects'
  },
  {
    id: 'telus-digital',
    name: 'TELUS Digital',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.telus.com',
    careersUrl: 'https://www.telus.com/en/careers',
    locations: ['Nationwide'],
    employees: '50,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Telecommunications and IT - technical support and network roles'
  },
  {
    id: 'rogers-communications',
    name: 'Rogers Communications',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.rogers.com',
    careersUrl: 'https://www.rogers.com/careers',
    locations: ['Nationwide'],
    employees: '24,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Telecommunications - network operations and technology roles'
  },

  // ======================
  // UTILITIES & ENERGY (expanded)
  // ======================
  {
    id: 'bc-hydro',
    name: 'BC Hydro',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.bchydro.com',
    careersUrl: 'https://www.bchydro.com/about/careers.html',
    locations: ['British Columbia'],
    employees: '6,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Electrical utility - engineering and skilled trades'
  },
  {
    id: 'suncor-energy',
    name: 'Suncor Energy',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.suncor.com',
    careersUrl: 'https://www.suncor.com/en-ca/careers',
    locations: ['Alberta', 'Multiple Locations'],
    employees: '30,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Energy production - operations, maintenance, and safety roles'
  },
  {
    id: 'enbridge',
    name: 'Enbridge Inc.',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.enbridge.com',
    careersUrl: 'https://www.enbridge.com/careers',
    locations: ['Nationwide'],
    employees: '11,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Pipeline and energy infrastructure - technical and operations'
  },
  {
    id: 'fortisbc',
    name: 'FortisBC',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.fortisbc.com',
    careersUrl: 'https://www.fortisbc.com/careers',
    locations: ['British Columbia'],
    employees: '2,600+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Gas and electric utility - skilled trades and technical roles'
  },

  // ======================
  // MANUFACTURING (expanded)
  // ======================
  {
    id: 'bombardier',
    name: 'Bombardier Inc.',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.bombardier.com',
    careersUrl: 'https://careers.bombardier.com/',
    locations: ['Montreal', 'Toronto', 'Multiple Locations'],
    employees: '17,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Aerospace manufacturing - engineering and skilled trades'
  },
  {
    id: 'pratt-whitney-canada',
    name: 'Pratt & Whitney Canada',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.pwc.ca',
    careersUrl: 'https://jobs.rtx.com/',
    locations: ['Montreal', 'Multiple Locations'],
    employees: '6,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Aircraft engine manufacturing - aviation technical expertise valued'
  },
  {
    id: 'nova-steel',
    name: 'Nova Steel Inc.',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.novasteel.com',
    careersUrl: 'https://www.novasteel.com/careers/',
    locations: ['Hamilton, ON'],
    employees: '300+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Steel fabrication - welding and manufacturing trades'
  },

  // ======================
  // LOGISTICS & TRANSPORTATION (expanded)
  // ======================
  {
    id: 'cn-rail',
    name: 'Canadian National Railway',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.cn.ca',
    careersUrl: 'https://www.cn.ca/en/careers',
    locations: ['Nationwide'],
    employees: '24,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Railway operations - logistics, operations, and safety roles'
  },
  {
    id: 'cp-rail',
    name: 'Canadian Pacific Kansas City',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.cpr.ca',
    careersUrl: 'https://careers.cpr.ca/',
    locations: ['Nationwide'],
    employees: '12,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Railway freight - operations, maintenance, and logistics'
  },
  {
    id: 'fedex-canada',
    name: 'FedEx Canada',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.fedex.com/en-ca',
    careersUrl: 'https://www.fedex.com/en-ca/careers.html',
    locations: ['Nationwide'],
    employees: '8,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Package delivery and logistics - operations and drivers'
  },
  {
    id: 'ups-canada',
    name: 'UPS Canada',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.ups.com/ca',
    careersUrl: 'https://en.jobs-ups.ca/',
    locations: ['Nationwide'],
    employees: '13,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Package delivery - drivers, supervisors, and warehouse roles'
  },
  {
    id: 'dhl-canada',
    name: 'DHL Express Canada',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.dhl.com/ca-en',
    careersUrl: 'https://www.dhl.com/ca-en/home/careers.html',
    locations: ['Nationwide'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'International shipping - logistics and operations'
  },
  {
    id: 'purolator',
    name: 'Purolator',
    sector: 'logistics-transportation',
    category: 'freight-logistics',
    website: 'https://www.purolator.com',
    careersUrl: 'https://careers.purolator.com/',
    locations: ['Nationwide'],
    employees: '14,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Canadian courier - delivery, operations, and fleet maintenance'
  },
  {
    id: 'westjet',
    name: 'WestJet Airlines',
    sector: 'logistics-transportation',
    category: 'aviation',
    website: 'https://www.westjet.com',
    careersUrl: 'https://www.westjet.com/en-ca/careers',
    locations: ['Calgary', 'Nationwide'],
    employees: '14,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Airline operations - pilots, mechanics, and ground operations'
  },
  {
    id: 'air-canada',
    name: 'Air Canada',
    sector: 'logistics-transportation',
    category: 'aviation',
    website: 'https://www.aircanada.com',
    careersUrl: 'https://careers.aircanada.com/ca/en',
    locations: ['Montreal', 'Toronto', 'Vancouver', 'Nationwide'],
    employees: '33,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'National airline - pilots, aviation technicians, operations'
  },
  {
    id: 'porter-airlines',
    name: 'Porter Airlines',
    sector: 'logistics-transportation',
    category: 'aviation',
    website: 'https://www.flyporter.com',
    careersUrl: 'https://careers.flyporter.com/jobs',
    locations: ['Toronto', 'Ottawa', 'Halifax'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Regional airline - aviation operations and customer service'
  },

  // ======================
  // PUBLIC SAFETY (expanded)
  // ======================
  {
    id: 'garda-world',
    name: 'GardaWorld Security',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.garda.com',
    careersUrl: 'https://www.garda.com/careers',
    locations: ['Nationwide'],
    employees: '45,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Security services - guards, armored transport, risk consulting'
  },
  {
    id: 'paladin-security',
    name: 'Paladin Security',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.paladinsecurity.com',
    careersUrl: 'https://www.paladinsecurity.com/careers/',
    locations: ['Western Canada'],
    employees: '25,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Private security - security guards and supervisors'
  },
  {
    id: 'securitas-canada',
    name: 'Securitas Canada',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.securitas.ca',
    careersUrl: 'https://www.securitas.ca/careers/',
    locations: ['Nationwide'],
    employees: '20,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Security services - mobile patrol, guarding, and technology'
  },
  {
    id: 'commissionaires',
    name: 'Corps of Commissionaires',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.commissionaires.ca',
    careersUrl: 'https://commissionaires.ca/en/careers/',
    locations: ['Nationwide'],
    employees: '20,000+',
    veteranFriendly: true,
    veteranOwned: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Veteran-operated security - priority hiring for veterans and RCMP'
  },
  {
    id: 'paragon-security',
    name: 'Paragon Security',
    sector: 'public-safety',
    category: 'police',
    website: 'https://www.paragonsecurity.ca',
    careersUrl: 'https://paragonsecurity.ca/jobs/',
    locations: ['Ontario', 'Alberta'],
    employees: '3,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Private security - guards, mobile patrol, special constables'
  },

  // ======================
  // MANUFACTURING (more additions)
  // ======================
  {
    id: 'magna-international',
    name: 'Magna International',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.magna.com',
    careersUrl: 'https://www.magna.com/careers',
    locations: ['Ontario', 'Multiple Locations'],
    employees: '26,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Automotive parts manufacturing - production and skilled trades'
  },
  {
    id: 'linamar',
    name: 'Linamar Corporation',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.linamar.com',
    careersUrl: 'https://www.linamar.com/careers',
    locations: ['Guelph, ON', 'Multiple Locations'],
    employees: '9,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Precision manufacturing - machining and assembly'
  },
  {
    id: 'mda-space',
    name: 'MDA Space',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://mda.space',
    careersUrl: 'https://mda.space/en/careers',
    locations: ['Brampton, ON', 'Richmond, BC', 'Montreal'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'secret',
    description: 'Space technology and robotics - engineering and technical roles'
  },
  {
    id: '3m-canada',
    name: '3M Canada',
    sector: 'manufacturing',
    category: 'manufacturer',
    website: 'https://www.3m.ca',
    careersUrl: 'https://www.3mcanada.ca/3M/en_CA/careers-ca/',
    locations: ['London, ON', 'Brockville, ON', 'Multiple Locations'],
    employees: '2,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Diversified manufacturing - production, quality, and logistics'
  },

  // ======================
  // TECH & CYBERSECURITY (more additions)
  // ======================
  {
    id: 'shopify',
    name: 'Shopify',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.shopify.com',
    careersUrl: 'https://www.shopify.com/careers',
    locations: ['Ottawa', 'Toronto', 'Montreal', 'Remote'],
    employees: '7,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'E-commerce platform - software development and operations'
  },
  {
    id: 'blackberry',
    name: 'BlackBerry',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.blackberry.com',
    careersUrl: 'https://www.blackberry.com/us/en/company/careers',
    locations: ['Waterloo, ON', 'Ottawa'],
    employees: '2,400+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Cybersecurity and IoT - security software and services'
  },
  {
    id: 'ibm-canada',
    name: 'IBM Canada',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.ibm.com/ca-en',
    careersUrl: 'https://www.ibm.com/ca-en/employment/',
    locations: ['Nationwide'],
    employees: '15,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'various',
    description: 'Enterprise technology - IT consulting and cloud services'
  },
  {
    id: 'amazon-canada',
    name: 'Amazon Canada',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.amazon.ca',
    careersUrl: 'https://hiring.amazon.ca/',
    locations: ['Nationwide'],
    employees: '25,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'E-commerce and cloud computing - operations, tech, and logistics'
  },
  {
    id: 'microsoft-canada',
    name: 'Microsoft Canada',
    sector: 'tech-cybersecurity',
    category: 'tech-company',
    website: 'https://www.microsoft.com/en-ca',
    careersUrl: 'https://careers.microsoft.com/v2/global/en/locations/canada.html',
    locations: ['Toronto', 'Montreal', 'Vancouver'],
    employees: '3,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Software and cloud services - technical and sales roles'
  },

  // ======================
  // HEALTHCARE (expanded)
  // ======================
  {
    id: 'shoppers-drug-mart',
    name: 'Shoppers Drug Mart',
    sector: 'healthcare',
    category: 'healthcare-provider',
    website: 'https://www1.shoppersdrugmart.ca',
    careersUrl: 'https://jobs.shoppersdrugmart.ca/',
    locations: ['Nationwide'],
    employees: '50,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Pharmacy and retail health - pharmacy technicians and retail'
  },
  {
    id: 'rexall',
    name: 'Rexall Pharmacy',
    sector: 'healthcare',
    category: 'healthcare-provider',
    website: 'https://www.rexall.ca',
    careersUrl: 'https://www.rexall.ca/careers',
    locations: ['Ontario', 'Alberta', 'Manitoba'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Community pharmacy - pharmacy and retail roles'
  },
  {
    id: 'paramount-home-health',
    name: 'ParaMed Home Health Care',
    sector: 'healthcare',
    category: 'healthcare-provider',
    website: 'https://www.paramed.com',
    careersUrl: 'https://www.paramed.com/careers',
    locations: ['Nationwide'],
    employees: '4,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Home healthcare - nursing and rehabilitation services'
  },
  {
    id: 'extendicare',
    name: 'Extendicare',
    sector: 'healthcare',
    category: 'healthcare-provider',
    website: 'https://www.extendicare.com',
    careersUrl: 'https://www.extendicare.com/careers',
    locations: ['Ontario', 'Multiple Locations'],
    employees: '23,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Long-term care - nursing, personal support workers, and administration'
  },

  // ======================
  // CONSTRUCTION & TRADES (more additions)
  // ======================
  {
    id: 'pcl-construction',
    name: 'PCL Constructors',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.pcl.com',
    careersUrl: 'https://www.pcl.com/careers',
    locations: ['Nationwide'],
    employees: '3,000+ Canada',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'General contracting - construction management and skilled trades'
  },
  {
    id: 'aecon',
    name: 'Aecon Group',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.aecon.com',
    careersUrl: 'https://www.aecon.com/careers',
    locations: ['Nationwide'],
    employees: '12,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Infrastructure construction - civil, mechanical, and electrical trades'
  },
  {
    id: 'bird-construction',
    name: 'Bird Construction',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.bird.ca',
    careersUrl: 'https://careers.bird.ca/ca/en',
    locations: ['Nationwide'],
    employees: '5,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'General contracting - construction management and field operations'
  },
  {
    id: 'graham-construction',
    name: 'Graham Construction',
    sector: 'construction-trades',
    category: 'trades',
    website: 'https://www.graham.ca',
    careersUrl: 'https://www.grahambuilds.com/careers/',
    locations: ['Western Canada', 'Ontario'],
    employees: '3,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Construction and infrastructure - project management and trades'
  },

  // ======================
  // UTILITIES & ENERGY (more additions)
  // ======================
  {
    id: 'ontario-power-generation',
    name: 'Ontario Power Generation',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.opg.com',
    careersUrl: 'https://www.opg.com/careers/',
    locations: ['Ontario'],
    employees: '9,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'reliability',
    description: 'Power generation - nuclear, hydro operations and maintenance'
  },
  {
    id: 'hydro-quebec',
    name: 'Hydro-Québec',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.hydroquebec.com',
    careersUrl: 'https://www.hydroquebec.com/careers/',
    locations: ['Quebec'],
    employees: '20,000+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Hydroelectric power - engineering, operations, and skilled trades'
  },
  {
    id: 'transalta',
    name: 'TransAlta Corporation',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.transalta.com',
    careersUrl: 'https://www.transalta.com/careers/',
    locations: ['Alberta', 'Multiple Locations'],
    employees: '2,500+',
    veteranFriendly: true,
    securityClearanceJobs: false,
    description: 'Power generation - operations and renewable energy'
  },
  {
    id: 'bruce-power',
    name: 'Bruce Power',
    sector: 'utilities-energy',
    category: 'utility',
    website: 'https://www.brucepower.com',
    careersUrl: 'https://www.brucepower.com/careers/',
    locations: ['Tiverton, ON'],
    employees: '4,000+',
    veteranFriendly: true,
    securityClearanceJobs: true,
    clearanceLevel: 'secret',
    description: 'Nuclear power generation - operations, maintenance, and security'
  }
];

// Helper functions
export const getEmployersBySector = (sector: EmployerSector) => {
  return veteranEmployers.filter(c => c.sector === sector);
};

export const getEmployersByCategory = (category: EmployerCategory) => {
  return veteranEmployers.filter(c => c.category === category);
};

export const getVeteranOwnedEmployers = () => {
  return veteranEmployers.filter(c => c.veteranOwned === true);
};

export const getSecurityClearanceEmployers = () => {
  return veteranEmployers.filter(c => c.securityClearanceJobs === true);
};

export const searchEmployers = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return veteranEmployers.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description?.toLowerCase().includes(lowerQuery) ||
    c.locations.some(loc => loc.toLowerCase().includes(lowerQuery))
  );
};

// Backwards compatibility exports
export const defenseContractors = veteranEmployers.filter(e => e.sector === 'defense');
export const getVeteranOwnedContractors = getVeteranOwnedEmployers;
export type DefenseContractor = VeteranEmployer;
