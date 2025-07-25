export interface Freelancer {
  name: string;
  username: string;
  role: string;
  desc: string;
  projects: number;
  stars: number;
  perfection: number;
  wallet: string;
}

export const freelancers: Freelancer[] = [
    { name: "Alice Kim", username: "alice", role: "Frontend Developer", desc: "Passionate about building responsive UIs with React and Tailwind CSS.", projects: 24, stars: 4.8, perfection: 98, wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2" },
    { name: "Brian Lee", username: "brian", role: "Backend Engineer", desc: "Expert in scalable APIs and databases. Enjoys optimizing server performance.", projects: 31, stars: 4.6, perfection: 95, wallet: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db" },
    { name: "Carla Smith", username: "carla", role: "UI/UX Designer", desc: "Designs accessible, intuitive, and clean user experiences with good frontend design.", projects: 19, stars: 4.9, perfection: 99, wallet: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB" },
    { name: "David Chen", username: "david", role: "Full Stack Dev", desc: "Seamlessly bridges frontend and backend; eager to learn new tech.", projects: 27, stars: 4.7, perfection: 97, wallet: "0x617F2E2fD72FD9D5503197092AcC168C92156E9f" },
    { name: "Elena Rossi", username: "elena", role: "Web3 Developer", desc: "Builds fast, reliable mobile apps with a passion for cross-platform solutions.", projects: 22, stars: 4.9, perfection: 94, wallet: "0x1Db3439a222C519ab44bb1144fC28167b48ECE57" },
    { name: "Felix Turner", username: "felix", role: "DevOps Engineer", desc: "Automates deployments and ensures smooth system operations.", projects: 18, stars: 4.8, perfection: 96, wallet: "0x2445347F89e8A447479752233215aB56893639A4" },
    { name: "Grace Park", username: "grace", role: "QA Specialist", desc: "Ensures bug-free releases. Detail-oriented and passionate about quality.", projects: 20, stars: 4.7, perfection: 97, wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
    { name: "Hugo Silva", username: "hugo", role: "AI Engineer", desc: "Develops smart algorithms and ML models. Loves solving problems.", projects: 16, stars: 4.9, perfection: 99, wallet: "0xDb20096219BfC77a50f94716299A27E575171314" },
    { name: "Ivy Wang", username: "ivy", role: "Web3 Developer", desc: "Builds decentralized apps and smart contracts. Blockchain enthusiast.", projects: 21, stars: 4.6, perfection: 95, wallet: "0x2499a02F54d8Dc12977b85Fbd62464D98bb45897" },
    { name: "Jack Brown", username: "jack", role: "Cloud Architect", desc: "Designs scalable cloud infrastructure. AWS and Azure certified.", projects: 23, stars: 4.8, perfection: 98, wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc" },
    { name: "Kira Patel", username: "kira", role: "Security Analyst", desc: "Protects systems from threats. Conducts audits and penetration tests.", projects: 17, stars: 4.7, perfection: 96, wallet: "0x976EA74026E726554dB657fA54763abd0C3a0aa9" },
    { name: "Leo Müller", username: "leo", role: "Data Scientist", desc: "Turns data into actionable insights. Skilled in Python and visualization.", projects: 21, stars: 4.9, perfection: 99, wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955" },
    { name: "Maya Singh", username: "maya", role: "web3 developer", desc: "Leads teams to deliver great products. Strong communicator and planner.", projects: 28, stars: 4.5, perfection: 93, wallet: "0x0754241982730dB1ecf4a2C5e7839C1467f13c5E" },
    { name: "Nina Lopez", username: "nina", role: "Web3 Developer", desc: "Creates engaging and clear content. Loves storytelling and research.", projects: 10, stars: 4.8, perfection: 97, wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" },
    { name: "Omar Farouk", username: "omar", role: "Blockchain Dev", desc: "Specializes in secure blockchain solutions. Keeps up with crypto trends.", projects: 25, stars: 4.7, perfection: 96, wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096" },
];
  