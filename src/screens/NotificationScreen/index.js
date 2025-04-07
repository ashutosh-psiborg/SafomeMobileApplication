import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
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
      icon: <MaterialIcons name="crisis-alert" size={35} color="black" />,
    },
  ]);

  // Removed "snoozed" from buttons array
  const buttons = ['All', 'SOS', 'Safe zone', 'Battery'];
  const swipeableRefs = useRef({});
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  // Filter notifications based on selected category, but keep snoozed notifications in their categories
  const filteredNotifications = notifications.filter(notification => {
    // "All" tab (index 0) shows all notifications
    if (selectedButton === 0) return true;

    // Category tabs (indices 1-3) show notifications of that category
    return notification.category === buttons[selectedButton];
  });

  // Get count of unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Delete notification with animation
  const handleDelete = id => {
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
  };

  // Snooze notification
  const handleSnooze = id => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? {...notification, isSnoozed: true}
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
          ? {...notification, isSnoozed: false}
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

    // Show toast or feedback (optional)
    // Toast.show({
    //   type: 'success',
    //   text1: 'All notifications marked as read',
    // });
  };

  // Render left action (Snooze)
  const renderLeftActions = id => (
    <View style={[styles.actionContainer, styles.snoozeAction]}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleSnooze(id)}>
        <Feather name="clock" size={20} color="#fff" />
        <Text style={styles.actionText}>Snooze</Text>
        <Text style={styles.actionText}>24 hrs</Text>
      </TouchableOpacity>
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
                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
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
                {/* {unreadCount > 0 && (
                  <Text style={styles.unreadCountText}>
                    ({unreadCount} unread)
                  </Text>
                )} */}
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
    // color: '#0279E1',
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
  unreadCard: {
    // borderLeftWidth: 3,
    // borderLeftColor: '#0279E1',
  },
  readCard: {
    // opacity: 0.8,
  },
  snoozedCard: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: DimensionConstants.five,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(2, 121, 225, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  sosIconContainer: {
    backgroundColor: 'rgba(255, 49, 12, 0.1)',
  },
  batteryIconContainer: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
  },
  safeZoneIconContainer: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
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
  notificationTime: {
    fontSize: DimensionConstants.twelve,
    color: 'rgba(0, 0, 0, 0.5)',
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
  swipeIndicator: {
    marginLeft: 10,
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: DimensionConstants.sixteen,
    marginBottom: DimensionConstants.twelve,
  },
  snoozeAction: {
    backgroundColor: '#FFA500', // Orange color for snooze
  },
  deleteAction: {
    backgroundColor: '#FF310C',
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
