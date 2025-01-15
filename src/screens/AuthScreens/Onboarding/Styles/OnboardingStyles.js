import { DimensionConstants ,width} from "../../../../constants/DimensionConstants";
import { StyleSheet } from 'react-native';

export const OnboardingStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    slide: {
      width,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    image: {
      width: 355,
      height: 355,
      resizeMode: 'contain',
    },
    slideContent: {
      width: '100%',
      paddingHorizontal: DimensionConstants.twentyFour,
      paddingBottom: DimensionConstants.forty,
    },
    text: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      textAlign: 'center',
      lineHeight: DimensionConstants.twentyTwo,
      color: '#889CA3',
    },
    textTitle: {
      fontSize: DimensionConstants.twentyFour,
      textAlign: 'center',
      marginTop: DimensionConstants.twenty,
      fontWeight: '700',
      fontFamily: 'Montserrat',
      color: '#323A51',
    },
    paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: DimensionConstants.twenty,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    dot: {
      height: DimensionConstants.six,
      width: DimensionConstants.six,
      borderRadius: DimensionConstants.three,
      backgroundColor: 'rgba(254, 96, 93, 0.2)',
      marginHorizontal: DimensionConstants.one,
    },
    activeDot: {
      backgroundColor: '#FE605D',
      width: DimensionConstants.eighteen,
      height: DimensionConstants.six,
    },
    skipButton: {
      flex: 1,
      alignItems: 'flex-end',
    },
    skipText: {
      color: '#889CA3',
      fontWeight: '500',
    },
  });