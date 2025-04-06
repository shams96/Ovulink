import { User } from '../types';

// Message types
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  CYCLE_DATA = 'cycle_data',
  HEALTH_DATA = 'health_data',
  APPOINTMENT = 'appointment',
  NOTIFICATION = 'notification',
}

// Message status
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

// Message interface
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: MessageType;
  content: string;
  timestamp: string;
  status: MessageStatus;
  metadata?: Record<string, any>;
}

// Appointment interface
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  isShared: boolean;
  createdBy: string;
  attendees: string[];
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
  };
}

// Partner invitation interface
export interface PartnerInvitation {
  id: string;
  inviterId: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  expiresAt: string;
  code: string;
}

// Mock messages for development
const mockMessages: Message[] = [
  {
    id: 'msg-001',
    senderId: '1', // Demo user
    receiverId: '2', // Partner
    type: MessageType.TEXT,
    content: 'Hi! I just logged my temperature for today.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: MessageStatus.READ,
  },
  {
    id: 'msg-002',
    senderId: '2', // Partner
    receiverId: '1', // Demo user
    type: MessageType.TEXT,
    content: 'Great! How are you feeling today?',
    timestamp: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
    status: MessageStatus.READ,
  },
  {
    id: 'msg-003',
    senderId: '1', // Demo user
    receiverId: '2', // Partner
    type: MessageType.TEXT,
    content: 'Pretty good! I think we might be in the fertile window soon.',
    timestamp: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
    status: MessageStatus.READ,
  },
  {
    id: 'msg-004',
    senderId: '2', // Partner
    receiverId: '1', // Demo user
    type: MessageType.TEXT,
    content: 'I\'ll check my calendar for the next few days.',
    timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
    status: MessageStatus.READ,
  },
  {
    id: 'msg-005',
    senderId: '1', // Demo user
    receiverId: '2', // Partner
    type: MessageType.CYCLE_DATA,
    content: 'Shared cycle data',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    status: MessageStatus.READ,
    metadata: {
      cycleDay: 12,
      temperature: 36.7,
      cervicalMucus: 'eggWhite',
      predictedOvulation: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    },
  },
  {
    id: 'msg-006',
    senderId: '2', // Partner
    receiverId: '1', // Demo user
    type: MessageType.APPOINTMENT,
    content: 'Created a new appointment',
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    status: MessageStatus.READ,
    metadata: {
      appointmentId: 'apt-001',
      title: 'Fertility Clinic Appointment',
      date: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
    },
  },
];

// Mock appointments for development
const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    title: 'Fertility Clinic Appointment',
    description: 'Initial consultation with Dr. Johnson',
    date: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 1 week from now
    time: '10:00',
    location: 'Fertility Clinic, 123 Main St',
    notes: 'Bring medical history and any previous test results',
    isShared: true,
    createdBy: '2', // Partner
    attendees: ['1', '2'], // Both users
    reminder: {
      enabled: true,
      minutesBefore: 60,
    },
  },
  {
    id: 'apt-002',
    title: 'Ovulation Day',
    description: 'Predicted ovulation based on cycle tracking',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: 'All day',
    isShared: true,
    createdBy: '1', // Demo user
    attendees: ['1', '2'], // Both users
    reminder: {
      enabled: true,
      minutesBefore: 1440, // 1 day before
    },
  },
];

// Mock partner invitations
const mockInvitations: PartnerInvitation[] = [
  {
    id: 'inv-001',
    inviterId: '1',
    inviterName: 'Demo User',
    inviterEmail: 'demo@example.com',
    inviteeEmail: 'partner@example.com',
    status: 'accepted',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    expiresAt: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
    code: 'ABC123',
  },
];

// Get messages between users
export const getMessages = (userId: string, partnerId: string): Message[] => {
  return mockMessages.filter(
    message => 
      (message.senderId === userId && message.receiverId === partnerId) ||
      (message.senderId === partnerId && message.receiverId === userId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Send a message
export const sendMessage = (
  senderId: string, 
  receiverId: string, 
  type: MessageType, 
  content: string,
  metadata?: Record<string, any>
): Message => {
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    senderId,
    receiverId,
    type,
    content,
    timestamp: new Date().toISOString(),
    status: MessageStatus.SENT,
    metadata,
  };
  
  mockMessages.push(newMessage);
  
  // Simulate message delivery and read status updates
  setTimeout(() => {
    const index = mockMessages.findIndex(msg => msg.id === newMessage.id);
    if (index >= 0) {
      mockMessages[index] = {
        ...mockMessages[index],
        status: MessageStatus.DELIVERED,
      };
    }
  }, 1000);
  
  setTimeout(() => {
    const index = mockMessages.findIndex(msg => msg.id === newMessage.id);
    if (index >= 0) {
      mockMessages[index] = {
        ...mockMessages[index],
        status: MessageStatus.READ,
      };
    }
  }, 3000);
  
  return newMessage;
};

// Get appointments for a user
export const getAppointments = (userId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.attendees.includes(userId))
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
};

// Create a new appointment
export const createAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt-${Date.now()}`,
  };
  
  mockAppointments.push(newAppointment);
  
  // If the appointment is shared, create a notification message
  if (newAppointment.isShared) {
    const otherAttendees = newAppointment.attendees.filter(id => id !== newAppointment.createdBy);
    
    otherAttendees.forEach(attendeeId => {
      sendMessage(
        newAppointment.createdBy,
        attendeeId,
        MessageType.APPOINTMENT,
        'Created a new appointment',
        {
          appointmentId: newAppointment.id,
          title: newAppointment.title,
          date: newAppointment.date,
          time: newAppointment.time,
        }
      );
    });
  }
  
  return newAppointment;
};

// Update an appointment
export const updateAppointment = (appointmentId: string, updates: Partial<Appointment>): Appointment | null => {
  const index = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (index >= 0) {
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...updates,
    };
    
    return mockAppointments[index];
  }
  
  return null;
};

// Delete an appointment
export const deleteAppointment = (appointmentId: string): boolean => {
  const index = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (index >= 0) {
    mockAppointments.splice(index, 1);
    return true;
  }
  
  return false;
};

// Create a partner invitation
export const createPartnerInvitation = (
  inviterId: string,
  inviterName: string,
  inviterEmail: string,
  inviteeEmail: string
): PartnerInvitation => {
  // Generate a random 6-character code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newInvitation: PartnerInvitation = {
    id: `inv-${Date.now()}`,
    inviterId,
    inviterName,
    inviterEmail,
    inviteeEmail,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    code,
  };
  
  mockInvitations.push(newInvitation);
  
  return newInvitation;
};

// Accept a partner invitation
export const acceptPartnerInvitation = (code: string, userId: string): User | null => {
  const invitation = mockInvitations.find(inv => inv.code === code && inv.status === 'pending');
  
  if (invitation) {
    // Update invitation status
    invitation.status = 'accepted';
    
    // In a real app, you would create a partner relationship in the database
    // For now, we'll just return a mock partner user
    return {
      id: '2',
      name: 'Partner User',
      gender: invitation.inviterId === userId ? 'female' : 'male',
      birthDate: '1988-05-15',
      email: invitation.inviteeEmail,
      partnerId: invitation.inviterId,
    };
  }
  
  return null;
};

// Get pending invitations for a user
export const getPendingInvitations = (email: string): PartnerInvitation[] => {
  return mockInvitations.filter(inv => inv.inviteeEmail === email && inv.status === 'pending');
};

// Share cycle data with partner
export const shareCycleData = (
  userId: string,
  partnerId: string,
  cycleData: Record<string, any>
): Message => {
  return sendMessage(
    userId,
    partnerId,
    MessageType.CYCLE_DATA,
    'Shared cycle data',
    cycleData
  );
};

// Share health data with partner
export const shareHealthData = (
  userId: string,
  partnerId: string,
  healthData: Record<string, any>
): Message => {
  return sendMessage(
    userId,
    partnerId,
    MessageType.HEALTH_DATA,
    'Shared health data',
    healthData
  );
};

export default {
  getMessages,
  sendMessage,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createPartnerInvitation,
  acceptPartnerInvitation,
  getPendingInvitations,
  shareCycleData,
  shareHealthData,
};
