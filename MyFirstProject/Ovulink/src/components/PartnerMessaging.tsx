import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
  Keyboard,
  AccessibilityInfo,
  Modal
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { colors } from '../theme';
import partnerService, { 
  Message, 
  MessageType, 
  MessageStatus,
  Appointment
} from '../services/partnerService';
import { User } from '../types';

interface PartnerMessagingProps {
  user: User;
  partner: User;
  onShareCycleData?: () => void;
  onShareHealthData?: () => void;
  onCreateAppointment?: () => void;
  onBack?: () => void;
}

// Message reaction type
type ReactionType = '❤️' | '👍' | '😊' | '😢' | '😮';

interface MessageReaction {
  userId: string;
  reaction: ReactionType;
  timestamp: string;
}

const PartnerMessaging: React.FC<PartnerMessagingProps> = ({
  user,
  partner,
  onShareCycleData,
  onShareHealthData,
  onCreateAppointment,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, MessageReaction[]>>({});
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  
  const flatListRef = useRef<FlatList>(null);
  const searchInputRef = useRef<TextInput>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if screen reader is enabled
  useEffect(() => {
    const checkScreenReader = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setScreenReaderEnabled(isEnabled);
    };
    
    checkScreenReader();
    
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Load messages on mount
  useEffect(() => {
    loadMessages();
    
    // Set up polling for new messages (in a real app, you would use WebSockets or push notifications)
    const interval = setInterval(loadMessages, 5000);
    
    // Simulate partner typing occasionally
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulatePartnerTyping();
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
      clearInterval(typingInterval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user.id, partner.id]);
  
  // Simulate partner typing
  const simulatePartnerTyping = () => {
    setIsTyping(true);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      
      // 50% chance to actually send a message after typing
      if (Math.random() > 0.5) {
        const randomResponses = [
          "How are you feeling today?",
          "Did you log your temperature?",
          "Should we schedule an appointment soon?",
          "I've been reading about fertility tracking.",
          "Let me know if you need anything."
        ];
        
        const randomMessage = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        
        const newMessage = partnerService.sendMessage(
          partner.id,
          user.id,
          MessageType.TEXT,
          randomMessage
        );
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    }, 3000);
  };
  
  // Load messages from the service
  const loadMessages = useCallback(() => {
    try {
      const msgs = partnerService.getMessages(user.id, partner.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, partner.id]);
  
  // Group messages by date
  const groupMessagesByDate = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    
    // Add date separators
    const messagesWithSeparators: Message[] = [];
    let currentDateStr = '';
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const messageDateStr = format(messageDate, 'yyyy-MM-dd');
      
      if (messageDateStr !== currentDateStr) {
        currentDateStr = messageDateStr;
        
        let dateLabel = format(messageDate, 'MMMM d, yyyy');
        if (messageDateStr === todayStr) {
          dateLabel = 'Today';
        } else if (messageDateStr === yesterdayStr) {
          dateLabel = 'Yesterday';
        }
        
        // Add a date separator (using a fake message object)
        messagesWithSeparators.push({
          id: `date-${messageDateStr}`,
          senderId: 'system',
          receiverId: 'system',
          type: MessageType.NOTIFICATION,
          content: dateLabel,
          timestamp: message.timestamp,
          status: MessageStatus.READ
        });
      }
      
      messagesWithSeparators.push(message);
    });
    
    return messagesWithSeparators;
  }, [messages]);
  
  // Filter messages based on search query
  const filteredMessages = useCallback(() => {
    if (!searchQuery.trim()) {
      return groupMessagesByDate();
    }
    
    const query = searchQuery.toLowerCase();
    
    return messages.filter(message => 
      message.content.toLowerCase().includes(query) ||
      (message.metadata && JSON.stringify(message.metadata).toLowerCase().includes(query))
    );
  }, [messages, searchQuery, groupMessagesByDate]);
  
  // Send a text message
  const sendTextMessage = useCallback(() => {
    if (!inputText.trim()) return;
    
    setIsSending(true);
    Keyboard.dismiss();
    
    try {
      const newMessage = partnerService.sendMessage(
        user.id,
        partner.id,
        MessageType.TEXT,
        inputText.trim()
      );
      
      // Add the new message to the list
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Clear the input
      setInputText('');
      
      // Scroll to the bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }, [inputText, user.id, partner.id]);
  
  // Add reaction to a message
  const addReaction = useCallback((messageId: string, reaction: ReactionType) => {
    const newReaction: MessageReaction = {
      userId: user.id,
      reaction,
      timestamp: new Date().toISOString()
    };
    
    setMessageReactions(prev => {
      const messageReactions = prev[messageId] || [];
      
      // Check if user already reacted with this reaction
      const existingReactionIndex = messageReactions.findIndex(
        r => r.userId === user.id && r.reaction === reaction
      );
      
      if (existingReactionIndex >= 0) {
        // Remove the reaction if it already exists (toggle behavior)
        const updatedReactions = [...messageReactions];
        updatedReactions.splice(existingReactionIndex, 1);
        return { ...prev, [messageId]: updatedReactions };
      } else {
        // Add the new reaction
        return { ...prev, [messageId]: [...messageReactions, newReaction] };
      }
    });
    
    setShowReactions(false);
    setSelectedMessage(null);
  }, [user.id]);
  
  // Share cycle data
  const handleShareCycleData = useCallback(() => {
    setShowActions(false);
    
    if (onShareCycleData) {
      onShareCycleData();
    } else {
      // Mock cycle data
      const cycleData = {
        cycleDay: 12,
        temperature: 36.7,
        cervicalMucus: 'eggWhite',
        predictedOvulation: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };
      
      try {
        const newMessage = partnerService.shareCycleData(user.id, partner.id, cycleData);
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } catch (error) {
        Alert.alert('Error', 'Failed to share cycle data. Please try again.');
        console.error('Error sharing cycle data:', error);
      }
    }
  }, [onShareCycleData, user.id, partner.id]);
  
  // Share health data
  const handleShareHealthData = useCallback(() => {
    setShowActions(false);
    
    if (onShareHealthData) {
      onShareHealthData();
    } else {
      // Mock health data
      const healthData = {
        sleep: { duration: 7.5, quality: 'good' },
        stress: 'low',
        exercise: { duration: 30, intensity: 'moderate' },
        symptoms: ['headache', 'fatigue'],
      };
      
      try {
        const newMessage = partnerService.shareHealthData(user.id, partner.id, healthData);
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } catch (error) {
        Alert.alert('Error', 'Failed to share health data. Please try again.');
        console.error('Error sharing health data:', error);
      }
    }
  }, [onShareHealthData, user.id, partner.id]);
  
  // Create appointment
  const handleCreateAppointment = useCallback(() => {
    setShowActions(false);
    
    if (onCreateAppointment) {
      onCreateAppointment();
    } else {
      // Show appointment creation modal
      setAppointmentTitle('');
      setShowAppointmentModal(true);
    }
  }, [onCreateAppointment]);
  
  // Create appointment from modal
  const createAppointment = useCallback(() => {
    if (appointmentTitle.trim()) {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      
      const appointment: Omit<Appointment, 'id'> = {
        title: appointmentTitle.trim(),
        description: 'Created from messaging',
        date: oneWeekFromNow.toISOString().split('T')[0],
        time: '10:00',
        isShared: true,
        createdBy: user.id,
        attendees: [user.id, partner.id],
        reminder: {
          enabled: true,
          minutesBefore: 60,
        },
      };
      
      partnerService.createAppointment(appointment);
      
      // The appointment message will be created by the service
      loadMessages();
      setShowAppointmentModal(false);
    }
  }, [appointmentTitle, user.id, partner.id, loadMessages]);
  
  // Delete a message
  const deleteMessage = useCallback((messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMessages(prevMessages => 
              prevMessages.filter(message => message.id !== messageId)
            );
          },
        },
      ]
    );
  }, []);
  
  // Format timestamp for display
  const formatMessageTime = useCallback((timestamp: string): string => {
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  }, []);
  
  // Get status icon for a message
  const getStatusIcon = useCallback((status: MessageStatus) => {
    switch (status) {
      case MessageStatus.SENDING:
        return <ActivityIndicator size="small" color={colors.neutral} />;
      case MessageStatus.SENT:
        return <Ionicons name="checkmark" size={16} color={colors.neutral} />;
      case MessageStatus.DELIVERED:
        return <Ionicons name="checkmark-done" size={16} color={colors.neutral} />;
      case MessageStatus.READ:
        return <Ionicons name="checkmark-done" size={16} color={colors.primary} />;
      case MessageStatus.FAILED:
        return <Ionicons name="alert-circle" size={16} color={colors.error} />;
      default:
        return null;
    }
  }, []);
  
  // Toggle search bar
  const toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
    setSearchQuery('');
    
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);
  
  // Render message reactions
  const renderMessageReactions = useCallback((messageId: string) => {
    const reactions = messageReactions[messageId] || [];
    
    if (reactions.length === 0) {
      return null;
    }
    
    // Count reactions by type
    const reactionCounts: Record<ReactionType, number> = {} as Record<ReactionType, number>;
    
    reactions.forEach(reaction => {
      if (!reactionCounts[reaction.reaction]) {
        reactionCounts[reaction.reaction] = 0;
      }
      reactionCounts[reaction.reaction]++;
    });
    
    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(reactionCounts).map(([reaction, count]) => (
          <View key={reaction} style={styles.reactionBubble}>
            <Text style={styles.reactionEmoji}>{reaction}</Text>
            {count > 1 && <Text style={styles.reactionCount}>{count}</Text>}
          </View>
        ))}
      </View>
    );
  }, [messageReactions]);
  
  // Render a message item
  const renderMessageItem = useCallback(({ item }: { item: Message }) => {
    // For date separator
    if (item.senderId === 'system' && item.type === MessageType.NOTIFICATION) {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>{item.content}</Text>
        </View>
      );
    }
    
    const isUserMessage = item.senderId === user.id;
    
    // Render different message types
    const renderMessageContent = () => {
      switch (item.type) {
        case MessageType.TEXT:
          return (
            <View style={[
              styles.messageBubble,
              isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                isUserMessage ? styles.userMessageText : styles.partnerMessageText
              ]}>
                {item.content}
              </Text>
            </View>
          );
          
        case MessageType.IMAGE:
          return (
            <View style={[
              styles.messageBubble,
              styles.imageBubble,
              isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
            ]}>
              <Image 
                source={{ uri: item.content }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            </View>
          );
          
        case MessageType.CYCLE_DATA:
          return (
            <View style={[
              styles.messageBubble,
              styles.dataBubble,
              isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
            ]}>
              <View style={styles.dataHeader}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dataTitle}>Cycle Data</Text>
              </View>
              
              {item.metadata && (
                <View style={styles.dataContent}>
                  {item.metadata.cycleDay !== undefined && (
                    <Text style={styles.dataText}>Cycle Day: {item.metadata.cycleDay}</Text>
                  )}
                  {item.metadata.temperature !== undefined && (
                    <Text style={styles.dataText}>Temperature: {item.metadata.temperature}°C</Text>
                  )}
                  {item.metadata.cervicalMucus && (
                    <Text style={styles.dataText}>
                      Cervical Mucus: {item.metadata.cervicalMucus.replace(/([A-Z])/g, ' $1').trim()}
                    </Text>
                  )}
                  {item.metadata.predictedOvulation && (
                    <Text style={styles.dataText}>
                      Predicted Ovulation: {format(new Date(item.metadata.predictedOvulation), 'MMM d')}
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
          
        case MessageType.HEALTH_DATA:
          return (
            <View style={[
              styles.messageBubble,
              styles.dataBubble,
              isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
            ]}>
              <View style={styles.dataHeader}>
                <Ionicons name="fitness" size={20} color={colors.primary} />
                <Text style={styles.dataTitle}>Health Data</Text>
              </View>
              
              {item.metadata && (
                <View style={styles.dataContent}>
                  {item.metadata.sleep && (
                    <Text style={styles.dataText}>
                      Sleep: {item.metadata.sleep.duration} hours ({item.metadata.sleep.quality})
                    </Text>
                  )}
                  {item.metadata.stress && (
                    <Text style={styles.dataText}>Stress Level: {item.metadata.stress}</Text>
                  )}
                  {item.metadata.exercise && (
                    <Text style={styles.dataText}>
                      Exercise: {item.metadata.exercise.duration} min ({item.metadata.exercise.intensity})
                    </Text>
                  )}
                  {item.metadata.symptoms && item.metadata.symptoms.length > 0 && (
                    <Text style={styles.dataText}>
                      Symptoms: {item.metadata.symptoms.join(', ')}
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
          
        case MessageType.APPOINTMENT:
          return (
            <View style={[
              styles.messageBubble,
              styles.dataBubble,
              isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
            ]}>
              <View style={styles.dataHeader}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dataTitle}>Appointment</Text>
              </View>
              
              {item.metadata && (
                <View style={styles.dataContent}>
                  <Text style={styles.dataTitle}>{item.metadata.title}</Text>
                  {item.metadata.date && (
                    <Text style={styles.dataText}>
                      Date: {format(new Date(item.metadata.date), 'MMM d, yyyy')}
                    </Text>
                  )}
                  {item.metadata.time && (
                    <Text style={styles.dataText}>Time: {item.metadata.time}</Text>
                  )}
                  {item.metadata.location && (
                    <Text style={styles.dataText}>Location: {item.metadata.location}</Text>
                  )}
                </View>
              )}
              
              <TouchableOpacity style={styles.dataButton}>
                <Text style={styles.dataButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          );
          
        default:
          return (
            <View style={[
              styles.messageBubble,
              isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                isUserMessage ? styles.userMessageText : styles.partnerMessageText
              ]}>
                {item.content}
              </Text>
            </View>
          );
      }
    };
    
    return (
      <Pressable 
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessageContainer : styles.partnerMessageContainer
        ]}
        onLongPress={() => {
          if (item.senderId === user.id) {
            // Show delete option for user's messages
            Alert.alert(
              'Message Options',
              'What would you like to do?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive',
                  onPress: () => deleteMessage(item.id)
                }
              ]
            );
          } else {
            // Show reaction options for partner's messages
            setSelectedMessage(item);
            setShowReactions(true);
          }
        }}
      >
        {renderMessageContent()}
        {renderMessageReactions(item.id)}
        
        <View style={[
          styles.messageFooter,
          isUserMessage ? styles.userMessageFooter : styles.partnerMessageFooter
        ]}>
          <Text style={styles.messageTime}>
            {formatMessageTime(item.timestamp)}
          </Text>
          
          {isUserMessage && (
            <View style={styles.messageStatus}>
              {getStatusIcon(item.status)}
            </View>
          )}
        </View>
      </Pressable>
    );
  }, [user.id, formatMessageTime, getStatusIcon, deleteMessage, renderMessageReactions]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Appointment creation modal */}
      <Modal
        visible={showAppointmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAppointmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Appointment</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Appointment title"
              value={appointmentTitle}
              onChangeText={setAppointmentTitle}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowAppointmentModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCreateButton]}
                onPress={createAppointment}
                disabled={!appointmentTitle.trim()}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Reactions modal */}
      <Modal
        visible={showReactions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactions(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowReactions(false)}
        >
          <View style={styles.reactionsModal}>
            {['❤️', '👍', '😊', '😢', '😮'].map((reaction) => (
              <TouchableOpacity
                key={reaction}
                style={styles.reactionButton}
                onPress={() => selectedMessage && addReaction(selectedMessage.id, reaction as ReactionType)}
              >
                <Text style={styles.reactionButtonText}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
      
      <View style={styles.header}>
        <View style={styles.partnerInfo}>
          <View style={[
            styles.partnerAvatar,
            { backgroundColor: partner.gender === 'male' ? colors.male : colors.female }
          ]}>
            <Text style={styles.partnerInitial}>{partner.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.partnerName}>{partner.name}</Text>
            <Text style={styles.partnerStatus}>Online</Text>
          </View>
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredMessages()}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, styles.typingDotMiddle]} />
            <View style={styles.typingDot} />
          </View>
          <Text style={styles.typingText}>{partner.name} is typing...</Text>
        </View>
      )}
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.searchCloseButton}
            onPress={toggleSearch}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowActions(!showActions)}
        >
          <Ionicons 
            name={showActions ? 'close' : 'add'} 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
          onPress={sendTextMessage}
          disabled={!inputText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleShareCycleData}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.female }]}>
              <Ionicons name="calendar" size={20} color="white" />
            </View>
            <Text style={styles.actionText}>Share Cycle Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleShareHealthData}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
              <Ionicons name="fitness" size={20} color="white" />
            </View>
            <Text style={styles.actionText}>Share Health Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleCreateAppointment}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
              <Ionicons name="calendar" size={20} color="white" />
            </View>
            <Text style={styles.actionText}>Create Appointment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: colors.warning }]}>
              <Ionicons name="image" size={20} color="white" />
            </View>
            <Text style={styles.actionText}>Send Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: colors
