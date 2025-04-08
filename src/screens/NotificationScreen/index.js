import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import React, {useState, useRef} from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import BlackSettingsIcon from '../../assets/icons/BlackSettingsIcon';
import {DimensionConstants} from '../../constants/DimensionConstants';
import Spacing from '../../components/Spacing';
import CustomCard from '../../components/CustomCard';
import BlueBellIcon from '../../assets/icons/BlueBellIcon';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NotificationScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Out from geofence',
      description: 'Pet Bella out from geofence',
      time: '09:45 am',
      category: 'Safe zone',
      isRead: false,
      isSnoozed: false,
      snoozeDuration: null,
      icon: <MaterialIcons name="share-location" size={35} color="black" />,
    },
    {
      id: 2,
      message: 'Low battery',
      description: 'Battery level is low',
      time: '08:30 am',
      category: 'Battery',
      isRead: false,
      isSnoozed: false,
      snoozeDuration: null,
      icon: (
        <MaterialCommunityIcons name="battery-low" size={35} color="black" />
      ),
    },
    {
      id: 3,
      message: 'Safe zone alert',
      description: 'Your pet entered safe zone',
      time: '07:15 am',
      category: 'Safe zone',
      isRead: true,
      isSnoozed: false,
      snoozeDuration: null,
      icon: <MaterialIcons name="share-location" size={35} color="black" />,
    },
    {
      id: 4,
      message: 'SOS Alert',
      description: 'Your pet triggered SOS alert',
      time: '06:20 am',
      category: 'SOS',
      isRead: true,
      isSnoozed: false,
      snoozeDuration: null,
      icon: <MaterialIcons name="crisis-alert" size={35} color="black" />,
    },
  ]);

  // Buttons for filtering notifications
  const buttons = ['All', 'SOS', 'Safe zone', 'Battery'];
  const swipeableRefs = useRef({});
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  // Filter notifications based on selected category
  const filteredNotifications = notifications.filter(notification => {
    // "All" tab (index 0) shows all notifications
    if (selectedButton === 0) return true;
    // Category tabs (indices 1-3) show notifications of that category
    return notification.category === buttons[selectedButton];
  });

  // Get count of unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Delete notification with confirmation and animation
  const handleDelete = id => {
    // Show confirmation alert before deletion
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Proceed with delete animation after confirmation
            Animated.timing(animatedOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setNotifications(
                notifications.filter(notification => notification.id !== id),
              );
              animatedOpacity.setValue(1);
            });
          },
        },
      ],
    );
  };

  // Snooze notification with specific duration
  const handleSnooze = (id, duration) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? {
              ...notification,
              isSnoozed: true,
              snoozeDuration: duration,
            }
          : notification,
      ),
    );
    
    if (swipeableRefs.current[id]) {
      swipeableRefs.current[id].close();
    }
  };

  // Unsnooze notification
  const handleUnsnooze = id => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? {...notification, isSnoozed: false, snoozeDuration: null}
          : notification,
      ),
    );
  };

  // Mark all currently visible notifications as read
  const handleReadAll = () => {
    // Get IDs of all currently visible notifications based on filter
    const visibleNotificationIds = filteredNotifications
      .filter(n => !n.isRead)
      .map(n => n.id);

    if (visibleNotificationIds.length === 0) {
      // No unread notifications to mark as read
      return;
    }

    // Mark all visible notifications as read
    setNotifications(
      notifications.map(notification =>
        visibleNotificationIds.includes(notification.id)
          ? {...notification, isRead: true}
          : notification,
      ),
    );
  };

  // Render left action (Snooze options)
  const renderLeftActions = id => (
    <View style={[styles.actionContainer, styles.snoozeAction]}>
      <Text style={styles.snoozeTitle}>Snooze for:</Text>
      <View style={styles.snoozeOptionsContainer}>
        <TouchableOpacity
          style={styles.snoozeOption}
          onPress={() => handleSnooze(id, '1hr')}>
          <Text style={styles.snoozeOptionText}>1hr</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.snoozeOption}
          onPress={() => handleSnooze(id, '12hr')}>
          <Text style={styles.snoozeOptionText}>12hr</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.snoozeOption}
          onPress={() => handleSnooze(id, '24hr')}>
          <Text style={styles.snoozeOptionText}>24hr</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.snoozeOption}
          onPress={() => handleSnooze(id, 'always')}>
          <Text style={styles.snoozeOptionText}>Always</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render right action (Delete)
  const renderRightActions = id => (
    <View style={[styles.actionContainer, styles.deleteAction]}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleDelete(id)}>
        <Feather name="trash-2" size={20} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // Check if there are any unread notifications in the current filter
  const hasUnreadNotifications = filteredNotifications.some(n => !n.isRead);

  // Render notification card based on whether it's snoozed or not
  const renderNotificationCard = notification => {
    if (notification.isSnoozed) {
      // Snoozed notification card style
      return (
        <CustomCard
          key={notification.id}
          style={[styles.card, styles.snoozedCard]}>
          <View style={styles.notificationContent}>
            <View style={styles.notificationLeft}>
              {notification?.icon}
              <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>
                  {notification.message}
                  <Spacing width={DimensionConstants.ten} />
                  <Feather name="clock" size={14} color="#889CA3" />
                </Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
                <View style={styles.metaContainer}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                    {notification.snoozeDuration && (
                      <Text style={styles.snoozeDuration}>
                        Snoozed: {notification.snoozeDuration}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.categoryChip}
                    onPress={() => handleUnsnooze(notification.id)}>
                    <Text style={styles.categoryText}>Unsnooze</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </CustomCard>
      );
    } else {
      // Regular notification card with swipe actions
      return (
        <Swipeable
          ref={ref => (swipeableRefs.current[notification.id] = ref)}
          renderLeftActions={() => renderLeftActions(notification.id)}
          renderRightActions={() => renderRightActions(notification.id)}>
          <CustomCard
            style={[
              styles.card,
              notification.isRead ? styles.readCard : styles.unreadCard,
            ]}>
            <View style={styles.notificationContent}>
              <View style={styles.notificationLeft}>
                {notification.icon}
                <View style={styles.textContainer}>
                  <Text style={styles.notificationTitle}>
                    {notification.message}
                    {!notification.isRead && (
                      <>
                        <Spacing width={DimensionConstants.ten} />
                        <View style={styles.unreadDot} />
                      </>
                    )}
                  </Text>
                  <Text style={styles.notificationDescription}>
                    {notification.description}
                  </Text>
                  <View style={styles.metaContainer}>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </CustomCard>
        </Swipeable>
      );
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainBackground noPadding style={styles.background}>
        <CustomHeader
          title={'Notifications'}
          backPress={() => navigation.goBack()}
          backgroundColor={'#fff'}
          onIconPress={() =>
            navigation.navigate('MainApp', {screen: 'Settings'})
          }
          icon={<BlackSettingsIcon marginRight={DimensionConstants.ten} />}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    selectedButton === index && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedButton(index)}>
                  <Text
                    style={[
                      styles.buttonText,
                      selectedButton === index && styles.selectedButtonText,
                    ]}>
                    {button}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Spacing height={DimensionConstants.twentyFour} />

            {/* Section header with count */}
            <View style={styles.sectionHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.sectionTitle}>Today</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{unreadCount}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleReadAll}
                disabled={!hasUnreadNotifications}
                style={{opacity: hasUnreadNotifications ? 1 : 0.5}}>
                <Text
                  style={[
                    styles.sectionTitleTwo,
                    {color: hasUnreadNotifications ? '#000' : '#889CA3'},
                  ]}>
                  Read All
                </Text>
              </TouchableOpacity>
            </View>

            <Spacing height={DimensionConstants.fourteen} />

            {filteredNotifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="bell-off" size={50} color="#889CA3" />
                <Text style={styles.emptyText}>No notifications</Text>
              </View>
            ) : (
              filteredNotifications.map(notification => (
                <Animated.View
                  key={notification.id}
                  style={{opacity: animatedOpacity}}>
                  {renderNotificationCard(notification)}
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>
      </MainBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.ten,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: DimensionConstants.six,
    backgroundColor: '#fff',
    borderRadius: DimensionConstants.twentyFour,
    padding: DimensionConstants.four,
  },
  button: {
    height: DimensionConstants.thirtyFive,
    flex: 1,
    borderRadius: DimensionConstants.twenty,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  selectedButton: {
    backgroundColor: '#FF310C',
    shadowColor: '#FF310C',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#565656',
    fontSize: DimensionConstants.twelve,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderTwo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '600',
    color: '#0279E1',
  },
  sectionTitleTwo: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: '#0279E1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  unreadCountText: {
    fontSize: 14,
    color: '#FF310C',
    fontWeight: '500',
    marginLeft: 8,
  },
  card: {
    borderRadius: DimensionConstants.twelve,
    marginBottom: DimensionConstants.twelve,
    marginHorizontal: DimensionConstants.two,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    height: DimensionConstants.ninety,
    justifyContent: 'center',
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {},
  readCard: {},
  snoozedCard: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: DimensionConstants.sixteen,
    flex: 1,
  },
  notificationTitle: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '600',
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0279E1',
    marginLeft: 20,
  },
  notificationDescription: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '400',
    color: '#889CA3',
    marginTop: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'column',
  },
  notificationTime: {
    fontSize: DimensionConstants.twelve,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  snoozeDuration: {
    fontSize: DimensionConstants.ten,
    color: '#889CA3',
    fontStyle: 'italic',
    marginTop: 2,
  },
  categoryChip: {
    backgroundColor: '#0279E1',
    paddingHorizontal: DimensionConstants.ten,
    paddingVertical: DimensionConstants.five,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Enhanced snooze action styles
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DimensionConstants.sixteen,
    marginBottom: DimensionConstants.twelve,
  },
  snoozeAction: {
    backgroundColor: '#FFA500',
    width: DimensionConstants.twoHundred, // Wider snooze panel
    padding: 10,
  },
  snoozeTitle: {
    color: '#fff',
    fontSize: DimensionConstants.fourteen,
    fontWeight: '600',
    marginBottom: 6,
  },
  snoozeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  snoozeOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snoozeOptionText: {
    color: '#fff',
    fontSize: DimensionConstants.twelve,
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: '#FF310C',
    width: 100,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  actionText: {
    color: '#fff',
    fontSize: DimensionConstants.twelve,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#889CA3',
    fontWeight: '500',
  },
});

export default NotificationScreen;