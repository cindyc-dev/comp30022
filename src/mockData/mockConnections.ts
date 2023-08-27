import { ConnectionI } from "~/types/ConnectionI";

export const mockTags = {
  friend: "badge-primary",
  colleague: "badge-info",
  family: "badge-success",
  client: "badge-warning",
  neighbor: "badge-error",
};

export const mockSearchResults: ConnectionI[] = [
  {
    name: "John Doe",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/23.jpg",
    email: "john.doe@example.com",
    tags: [],
  },
  {
    name: "Jane Smith",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/15.jpg",
    email: "jane.smith@gmail.com",
    tags: [],
  },
];

// Random data generated using ChatGPT with appropriate prompts
export const mockConnections: ConnectionI[] = [
  {
    name: "John Doe",
    phone: "555-1234",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/23.jpg",
    email: "john.doe@example.com",
    tags: ["friend", "colleague"],
    notes: "Met at the conference",
  },
  {
    name: "Jane Smith",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/15.jpg",
    email: "jane.smith@gmail.com",
    tags: ["family"],
    notes: "Cousin's birthday",
  },
  {
    name: "Robert Johnson",
    phone: "555-9876",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/7.jpg",
    email: "robert.johnson@workplace.com",
    tags: ["client"],
    notes: "Discuss upcoming project",
  },
  {
    name: "Emily Brown",
    phone: "555-5678",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/38.jpg",
    email: "emily.brown@hotmail.com",
    tags: ["friend"],
    notes: "Likes hiking",
  },
  {
    name: "Michael Williams",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/11.jpg",
    email: "michael.williams@example.org",
    tags: ["colleague"],
    notes: "Works in marketing",
  },
  {
    name: "Samantha Miller",
    phone: "555-2222",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/5.jpg",
    email: "samantha.miller@example.com",
    tags: ["friend"],
    notes: "Shared interest in painting",
  },
  {
    name: "David Wilson",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/17.jpg",
    email: "david.wilson@gmail.com",
    tags: ["friend", "neighbor"],
    notes: "Helped with gardening",
  },
  {
    name: "Jennifer Lee",
    phone: "555-4444",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/29.jpg",
    email: "jennifer.lee@workplace.com",
    tags: ["colleague"],
    notes: "Attended the training together",
  },
  {
    name: "Richard Brown",
    phone: "555-5555",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/42.jpg",
    email: "richard.brown@hotmail.com",
    tags: ["family"],
    notes: "Nephew's graduation",
  },
  {
    name: "Linda Davis",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/7.jpg",
    email: "linda.davis@example.org",
    tags: ["friend"],
    notes: "Travelling to Europe",
  },
  {
    name: "Daniel Martinez",
    phone: "555-6666",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/28.jpg",
    email: "daniel.martinez@gmail.com",
    tags: ["client"],
    notes: "Discussing new contract",
  },
  {
    name: "Michelle Taylor",
    phone: "555-7777",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/12.jpg",
    email: "michelle.taylor@workplace.com",
    tags: ["colleague"],
    notes: "Team building event",
  },
  {
    name: "Christopher Harris",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/34.jpg",
    email: "christopher.harris@hotmail.com",
    tags: ["friend"],
    notes: "Golf outing",
  },
  {
    name: "Karen Clark",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/23.jpg",
    email: "karen.clark@example.org",
    tags: ["neighbor"],
    notes: "Borrowed lawnmower",
  },
  {
    name: "Matthew Turner",
    phone: "555-8888",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/14.jpg",
    email: "matthew.turner@gmail.com",
    tags: ["friend"],
    notes: "College roommate",
  },
  {
    name: "Elizabeth Baker",
    phone: "555-9999",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/4.jpg",
    email: "elizabeth.baker@workplace.com",
    tags: ["colleague"],
    notes: "Joint project presentation",
  },
  {
    name: "William Garcia",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/21.jpg",
    email: "william.garcia@hotmail.com",
    tags: ["friend"],
    notes: "Football match",
  },
  {
    name: "Amanda Martinez",
    phone: "555-1010",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/32.jpg",
    email: "amanda.martinez@example.org",
    tags: ["friend"],
    notes: "Book club meeting",
  },
  {
    name: "Jason Robinson",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/46.jpg",
    email: "jason.robinson@gmail.com",
    tags: ["neighbor"],
    notes: "Organizing block party",
  },
  {
    name: "Melissa Adams",
    photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/11.jpg",
    email: "melissa.adams@workplace.com",
    tags: ["colleague"],
    notes: "Birthday celebration in the office",
  },
];
