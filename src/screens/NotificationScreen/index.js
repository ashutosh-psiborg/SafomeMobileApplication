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
import React, {useState, useRef, useCallback, useEffect} from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import BlackSettingsIcon from '../../assets/icons/BlackSettingsIcon';
import {DimensionConstants} from '../../constants/DimensionConstants';
import Spacing from '../../components/Spacing';
import CustomCard from '../../components/CustomCard';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import fetcher from '../../utils/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../components/Loader';

const NotificationScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const swipeableRefs = useRef({});
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);
  const [isSnoozed, setIsSnoozed] = useState({});

  const buttons = ['All', 'SOS', 'GeoFence', 'Battery'];

  useFocusEffect(
    useCallback(() => {
      const getStoredDeviceId = async () => {
        try {
          const storedDeviceId = await AsyncStorage.getItem(
            'selectedDeviceMongoId',
          );
          if (storedDeviceId) {
            setDeviceId(storedDeviceId);
          }
        } catch (error) {
          console.error('Failed to retrieve device ID:', error);
        }
      };
      getStoredDeviceId();
    }, []),
  );

  const {
    data: notificationData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `/notification/getAll?device=${deviceId}`,
      }),
    enabled: !!deviceId,
    select: data => data?.data?.results || [],
  });

  const {
    data: getSnooze,
    isLoading: getSnoozeLoading,
    error: getSnoozeError,
    refetch: getSnoozeRefetch,
  } = useQuery({
    queryKey: ['getSnooze', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `/notification/getSnooze/${deviceId}`,
      }),
    enabled: !!deviceId,
    select: data => data?.data || [],
  });

  useEffect(() => {
    const result = {};
    getSnooze?.forEach(item => {
      const type = item.notificationType;
      result[type] = item.value; // Store the snooze duration (value) for each type
    });
    setIsSnoozed(result);
  }, [getSnooze]);

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationId =>
      fetcher({
        method: 'DELETE',
        url: `/notification/deleteByID/${notificationId}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', deviceId]);
      getSnoozeRefetch();
    },
    onError: err => {
      console.error('Error deleting notification:', err);
      Alert.alert('Error', 'Failed to delete notification. Please try again.');
    },
  });

  const deleteAllNotification = useMutation({
    mutationFn: () =>
      fetcher({
        method: 'DELETE',
        url: `/notification/deleteAll?deviceId=${deviceId}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', deviceId]);
      getSnoozeRefetch();
    },
    onError: err => {
      console.error('Error deleting notification:', err);
      Alert.alert('Error', 'Failed to delete notification. Please try again.');
    },
  });

  const markReadMutation = useMutation({
    mutationFn: notificationId =>
      fetcher({
        method: 'PATCH',
        url: `/notification/markRead?id=${notificationId}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', deviceId]);
    },
    onError: err => {
      console.error('Error marking notification as read:', err);
      Alert.alert(
        'Error',
        'Failed to mark notification as read. Please try again.',
      );
    },
  });

  const snoozeNotificationMutation = useMutation({
    mutationFn: ({notificationId, duration, type}) => {
      const hours = {
        '1hr': 1,
        '12hr': 12,
        '24hr': 24,
        always: 24 * 7,
      };
      return fetcher({
        method: 'PATCH',
        url: '/notification/snooze',
        data: {
          deviceId: deviceId,
          notificationType: type,
          value: hours[duration],
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', deviceId]);
      getSnoozeRefetch();
    },
    onError: err => {
      console.error('Error snoozing notification:', err);
      Alert.alert('Error', 'Failed to snooze notification. Please try again.');
    },
  });

  const unsnoozeNotificationMutation = useMutation({
    mutationFn: ({type}) =>
      fetcher({
        method: 'PATCH',
        url: '/notification/snooze',
        data: {
          deviceId: deviceId,
          notificationType: type,
          value: 0, // Set to 0 to unsnooze
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', deviceId]);
      getSnoozeRefetch();
    },
    onError: err => {
      console.error('Error unsnoozing notification:', err);
      Alert.alert(
        'Error',
        'Failed to unsnooze notification. Please try again.',
      );
    },
  });

  const filteredNotifications =
    notificationData?.filter(notification => {
      if (selectedButton === 0) return true;
      return notification.type === buttons[selectedButton];
    }) || [];

  const unreadCount = notificationData?.filter(n => !n.isRead).length || 0;

  const finalizeDelete = id => {
    setUndoVisible(false);
    setPendingDelete(null);
    deleteNotificationMutation.mutate(id, {
      onSuccess: () => {
        animatedOpacity.setValue(1);
      },
    });
  };

  const handleDelete = id => {
    setPendingDelete(id);
    setUndoVisible(true);
    setCountdown(3);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          // finalizeDelete(id);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDeleteAll = () => {
    deleteAllNotification.mutate();
  };

  const handleUndo = () => {
    clearInterval(timerRef.current);
    setUndoVisible(false);
    setPendingDelete(null);
  };

  const handleSnooze = (id, duration, type) => {
    if (swipeableRefs.current[id]) {
      swipeableRefs.current[id].close();
    }
    snoozeNotificationMutation.mutate({notificationId: id, duration, type});
  };

  const handleUnsnooze = (id, type) => {
    if (swipeableRefs.current[id]) {
      swipeableRefs.current[id].close();
    }
    unsnoozeNotificationMutation.mutate({type});
  };

  const handleMarkRead = id => {
    markReadMutation.mutate(id);
  };

  const handleReadAll = () => {
    const visibleNotificationIds = filteredNotifications
      .filter(n => !n.isRead)
      .map(n => n._id);

    if (visibleNotificationIds.length === 0) return;

    visibleNotificationIds.forEach(id => {
      markReadMutation.mutate(id);
    });
  };

  const getNotificationIcon = type => {
    switch (type) {
      case 'Battery':
        return (
          <MaterialCommunityIcons name="battery-low" size={35} color="black" />
        );
      case 'GeoFence':
        return <MaterialIcons name="share-location" size={35} color="black" />;
      case 'SOS':
        return <MaterialIcons name="crisis-alert" size={35} color="black" />;
      default:
        return <Feather name="bell" size={35} color="black" />;
    }
  };

  const renderLeftActions = (id, type) => {
    const snoozeValue = isSnoozed[type];
    if (snoozeValue) {
      const timeText =
        snoozeValue === 24 * 7
          ? 'Always'
          : `${snoozeValue}hr${snoozeValue > 1 ? 's' : ''}`;
      return (
        <View style={[styles.actionContainer, styles.snoozeAction]}>
          <Text style={styles.snoozeTitle}>Snoozed: {timeText}</Text>
          <TouchableOpacity
            style={styles.unsnoozeButton}
            onPress={() => handleUnsnooze(id, type)}>
            <Text style={styles.unsnoozeText}>Unsnooze</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={[styles.actionContainer, styles.snoozeAction]}>
        <Text style={styles.snoozeTitle}>Snooze for:</Text>
        <View style={styles.snoozeOptionsContainer}>
          <TouchableOpacity
            style={styles.snoozeOption}
            onPress={() => handleSnooze(id, '1hr', type)}>
            <Text style={styles.snoozeOptionText}>1hr</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.snoozeOption}
            onPress={() => handleSnooze(id, '12hr', type)}>
            <Text style={styles.snoozeOptionText}>12hr</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.snoozeOption}
            onPress={() => handleSnooze(id, '24hr', type)}>
            <Text style={styles.snoozeOptionText}>24hr</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.snoozeOption}
            onPress={() => handleSnooze(id, 'always', type)}>
            <Text style={styles.snoozeOptionText}>Always</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRightActions = id => (
    <View style={[styles.actionContainer, styles.deleteAction]}>
      {undoVisible ? (
        <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
          <Text style={styles.undoText}>Undo {countdown}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(id)}>
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const hasUnreadNotifications = filteredNotifications.some(n => !n.isRead);

  const renderNotificationCard = notification => {
    const icon = getNotificationIcon(notification.type);
    return (
      <Swipeable
        ref={ref => (swipeableRefs.current[notification._id] = ref)}
        renderLeftActions={() =>
          renderLeftActions(notification._id, notification.type)
        }
        renderRightActions={() => renderRightActions(notification._id)}>
        <CustomCard
          style={[
            styles.card,
            notification.isRead ? styles.readCard : styles.unreadCard,
          ]}>
          <TouchableOpacity
            onPress={() =>
              !notification.isRead && handleMarkRead(notification._id)
            }
            style={styles.notificationContent}>
            <View style={styles.notificationLeft}>
              {icon}
              <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                  {!notification.isRead && (
                    <>
                      <Spacing width={DimensionConstants.ten} />
                      <View style={styles.unreadDot} />
                    </>
                  )}
                </Text>
                <Text style={styles.notificationDescription}>
                  {notification.message}
                </Text>
                <View style={styles.metaContainer}>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </CustomCard>
      </Swipeable>
    );
  };

  if (
    isLoading ||
    getSnoozeLoading ||
    deleteNotificationMutation.isLoading ||
    markReadMutation.isLoading ||
    snoozeNotificationMutation.isLoading ||
    unsnoozeNotificationMutation.isLoading
  ) {
    return (
      <MainBackground noPadding style={styles.background}>
        <Loader />
      </MainBackground>
    );
  }

  if (error || getSnoozeError) {
    return (
      <MainBackground noPadding style={styles.background}>
        <CustomHeader
          title={'Notifications'}
          backPress={() => navigation.goBack()}
          backgroundColor={'#fff'}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Failed to load notifications</Text>
        </View>
      </MainBackground>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainBackground noPadding style={styles.background}>
        <CustomHeader
          title={'Notifications'}
          backPress={() => navigation.goBack()}
          backgroundColor={'#fff'}
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

            <View style={styles.sectionHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.sectionTitle}>UnRead</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{unreadCount}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                {hasUnreadNotifications && (
                  <TouchableOpacity
                    onPress={handleReadAll}
                    disabled={!hasUnreadNotifications}
                    style={{
                      borderWidth: 1,
                      borderColor: 'green',
                      borderRadius: 15,
                      paddingVertical: DimensionConstants.two,
                      paddingHorizontal: DimensionConstants.five,
                      flexDirection: 'row',
                      gap: DimensionConstants.three,
                    }}>
                    <MaterialCommunityIcons
                      name="check-all"
                      color="green"
                      size={18}
                    />
                    <Text style={[styles.sectionTitleTwo, {color: 'green'}]}>
                      Read All
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleDeleteAll}
                  style={{
                    borderWidth: 1,
                    borderColor: 'red',
                    borderRadius: 15,
                    paddingVertical: DimensionConstants.two,
                    paddingHorizontal: DimensionConstants.five,
                    flexDirection: 'row',
                    gap: DimensionConstants.one,
                  }}>
                  <MaterialIcons name="delete" color="red" size={18} />
                  <Text style={[styles.sectionTitleTwo, {color: 'red'}]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
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
                  key={notification._id}
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
  sectionTitle: {
    fontSize: DimensionConstants.fifteen,
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
  card: {
    borderRadius: DimensionConstants.twelve,
    marginBottom: DimensionConstants.twelve,
    marginHorizontal: DimensionConstants.two,
    height: DimensionConstants.ninety,
    justifyContent: 'center',
  },
  unreadCard: {
    backgroundColor: 'rgba(237, 247, 255, 1)',
  },
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
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DimensionConstants.sixteen,
    marginBottom: DimensionConstants.twelve,
  },
  snoozeAction: {
    backgroundColor: '#FFA500',
    width: DimensionConstants.twoHundred,
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
  unsnoozeButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  unsnoozeText: {
    color: '#FFA500',
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
  undoContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF310C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  undoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default NotificationScreen;
