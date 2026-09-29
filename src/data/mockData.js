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
    remainingDistance: '120m',
    remainingTime: '~2 min',
    instruction: 'Start at the Library Entry Floor',
    subInstruction: 'Facing north towards main hallway corridor',
    turnType: 'straight',
    floor: 'GROUND FLOOR',
    roomLocation: 'Library Entry',
    mapMarker: { x: 80, y: 100 }
  },
  {
    stepIndex: 18,
    totalSteps: 85,
    remainingDistance: '95m',
    remainingTime: '~1.8 min',
    instruction: 'Walk straight past Student Helpdesk',
    subInstruction: 'Keep to the tactile paving strip on your right',
    turnType: 'straight',
    floor: 'GROUND FLOOR',
    roomLocation: 'Helpdesk',
    mapMarker: { x: 120, y: 100 }
  },
  {
    stepIndex: 34,
    totalSteps: 85,
    remainingDistance: '75m',
    remainingTime: '~1.4 min',
    instruction: 'Turn left near Room 204',
    subInstruction: 'Take the wide accessible corridor ramp',
    turnType: 'turn-left',
    floor: 'GROUND FLOOR',
    roomLocation: 'Room 204',
    mapMarker: { x: 150, y: 120 }
  },
  {
    stepIndex: 58,
    totalSteps: 85,
    remainingDistance: '40m',
    remainingTime: '~45 sec',
    instruction: 'Continue past Central Courtyard Glass Doors',
    subInstruction: 'Automatic sliding doors are fully open and clear',
    turnType: 'straight',
    floor: 'GROUND FLOOR',
    roomLocation: 'Courtyard Corridor',
    mapMarker: { x: 180, y: 140 }
  },
  {
    stepIndex: 75,
    totalSteps: 85,
    remainingDistance: '15m',
    remainingTime: '~20 sec',
    instruction: 'Turn slightly right towards Library Reception',
    subInstruction: 'Double accessible doors with automatic push sensor',
    turnType: 'turn-right',
    floor: 'GROUND FLOOR',
    roomLocation: 'Library Vestibule',
    mapMarker: { x: 210, y: 145 }
  },
  {
    stepIndex: 85,
    totalSteps: 85,
    remainingDistance: '0m',
    remainingTime: 'Arrived',
    instruction: 'You have arrived at your destination!',
    subInstruction: 'Library — Ground Floor entrance directly ahead',
    turnType: 'arrived',
    floor: 'GROUND FLOOR',
    roomLocation: 'Library — Ground Floor',
    mapMarker: { x: 225, y: 145 }
  }
];
