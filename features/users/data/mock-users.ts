import { UserType } from '../types';

export const mockUserTypes: UserType[] = [
  {
    id: "1",
    name: "Guest User",
    description: "Guest Users can browse public content and limited features.",
    storiesCount: 16,
    personasCount: 2,
    personas: [
      {
        name: "Serena Bialek",
        age: 38,
        location: "Austin, Texas, U.S.",
        about: "Balances a fast-paced operations job with school schedules and elder-care check-ins for her mother.",
        goals: "Complete key tasks in under a few minutes without hassle.",
        frustrations: "Missing an important update because notifications are scattered across email, apps, and dashboards."
      },
      {
        name: "Darius Otorkwo",
        age: 42,
        location: "Chicago, IL",
        about: "Manages multi-site logistics and inventory systems.",
        goals: "Streamline tracking and reporting in real-time.",
        frustrations: "Manual data entry delays and clunky UI workflows."
      }
    ]
  },
  {
    id: "2",
    name: "Registered User",
    description: "Registered Users utilize the web application to access personalized features, save preferences, and interact with customized content.",
    storiesCount: 49,
    personasCount: 1,
    personas: [
      {
        name: "Alex Turner",
        age: 29,
        location: "Bandung, Indonesia",
        about: "Software developer focused on building efficient tools.",
        goals: "Access personalized dashboard and save project setups quickly.",
        frustrations: "Session timeouts and unclear error messages."
      }
    ]
  }
];