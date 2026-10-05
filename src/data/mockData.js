// Mock data for Way2Go indoor navigation

export const QUICK_ACCESS_ITEMS = [
  {
    id: 'library',
    title: 'Library',
    subtitle: 'Ground Floor — Main Block',
    category: 'academic',
    iconType: 'library',
    steps: 85,
    distance: '120m',
    time: '~2 min',
    wheelchairAccessible: true,
  },
  {
    id: 'admin',
    title: 'Admin Block',
    subtitle: 'Ground Floor — Front Wing',
    category: 'office',
    iconType: 'admin',
    steps: 110,
    distance: '160m',
    time: '~3 min',
    wheelchairAccessible: true,
  },
  {
    id: 'science-labs',
    title: 'Science Labs',
    subtitle: 'Ground Floor — Science Block',
    category: 'lab',
    iconType: 'science',
    steps: 140,
    distance: '210m',
    time: '~4 min',
    wheelchairAccessible: true,
  },
  {
    id: 'auditorium',
    title: 'Auditorium',
    subtitle: 'First Floor — Cultural Complex',
    category: 'hall',
    iconType: 'auditorium',
    steps: 190,
    distance: '280m',
    time: '~5 min',
    wheelchairAccessible: true,
  },
];

export const RECENT_DESTINATIONS = [
  {
    id: 'seminar-room-1',
    title: 'Seminar Room 1',
    subtitle: 'First Floor — Main Block',
    steps: 95,
    distance: '135m',
    time: '~2.5 min',
    wheelchairAccessible: true,
  },
  {
    id: 'computer-lab-2',
    title: 'Computer Lab 2',
    subtitle: 'Ground Floor — Science Block',
    steps: 125,
    distance: '180m',
    time: '~3.5 min',
    wheelchairAccessible: true,
  },
  {
    id: 'robotics-lab',
    title: 'Robotics & AI Center',
    subtitle: 'Second Floor — Tech Wing',
    steps: 220,
    distance: '310m',
    time: '~6 min',
    wheelchairAccessible: true,
  },
  {
    id: 'accessible-restroom',
    title: 'Accessible Restroom 102',
    subtitle: 'Ground Floor — North Hall',
    steps: 40,
    distance: '60m',
    time: '~1 min',
    wheelchairAccessible: true,
  }
];

export const ALL_DESTINATIONS = [
  ...QUICK_ACCESS_ITEMS,
  ...RECENT_DESTINATIONS,
  {
    id: 'room-204',
    title: 'Room 204 (Lecture Hall)',
    subtitle: 'Second Floor — Main Block',
    steps: 80,
    distance: '110m',
    time: '~2 min',
    wheelchairAccessible: true,
  },
  {
    id: 'deans-office',
    title: 'Dean’s Office',
    subtitle: 'First Floor — Admin Wing',
    steps: 150,
    distance: '220m',
    time: '~4 min',
    wheelchairAccessible: true,
  },
  {
    id: 'cafeteria',
    title: 'Campus Food Court & Cafe',
    subtitle: 'Ground Floor — Student Center',
    steps: 175,
    distance: '250m',
    time: '~4.5 min',
    wheelchairAccessible: true,
  }
];

export const ROUTE_STEPS = [
  {
    stepIndex: 1,
    totalSteps: 85,
    remainingDistance: '240m',
    remainingTime: '~4 min',
    instruction: 'Start at Campus South Entrance & Reception',
    subInstruction: 'Enter through automatic sliding doors into Grand Hallway',
    turnType: 'straight',
    floor: 'GROUND FLOOR',
    roomLocation: 'South Entrance Hall',
    mapMarker: { x: 5850, y: 10450 }
  },
  {
    stepIndex: 18,
    totalSteps: 85,
    remainingDistance: '180m',
    remainingTime: '~3 min',
    instruction: 'Walk straight along South Central Corridor',
    subInstruction: 'Pass Rooms 112–118 on your left, tactile paving straight ahead',
    turnType: 'straight',
    floor: 'GROUND FLOOR',
    roomLocation: 'South Wing Corridor',
    mapMarker: { x: 5850, y: 7500 }
  },
  {
    stepIndex: 34,
    totalSteps: 85,
    remainingDistance: '130m',
    remainingTime: '~2.2 min',
    instruction: 'Bear left into Central Connector Hub',
    subInstruction: 'Cross connecting skywalk between South Block & North Block',
    turnType: 'turn-left',
    floor: 'GROUND FLOOR',
    roomLocation: 'Central Skywalk Hub',
    mapMarker: { x: 4300, y: 3800 }
  },
  {
    stepIndex: 58,
    totalSteps: 85,
    remainingDistance: '80m',
    remainingTime: '~1.3 min',
    instruction: 'Turn right past Room 204 & Science Labs',
    subInstruction: 'Follow the main illuminated corridor heading towards East Wing',
    turnType: 'turn-right',
    floor: 'GROUND FLOOR',
    roomLocation: 'Room 204 Junction',
    mapMarker: { x: 5550, y: 550 }
  },
  {
    stepIndex: 75,
    totalSteps: 85,
    remainingDistance: '35m',
    remainingTime: '~40 sec',
    instruction: 'Turn left towards North Library Wing',
    subInstruction: 'Enter wide accessible corridor with double push-to-open doors',
    turnType: 'turn-left',
    floor: 'FIRST FLOOR',
    roomLocation: 'Library Access Corridor',
    mapMarker: { x: 7800, y: -600 }
  },
  {
    stepIndex: 85,
    totalSteps: 85,
    remainingDistance: '0m',
    remainingTime: 'Arrived',
    instruction: 'You have arrived at North Library Complex!',
    subInstruction: 'Quiet study zone, help desk & reception directly ahead',
    turnType: 'arrived',
    floor: 'FIRST FLOOR',
    roomLocation: 'North Library Wing',
    mapMarker: { x: 7100, y: -4200 }
  }
];
