import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import Spacing from '../../../../components/Spacing';
import CustomCard from '../../../../components/CustomCard';
import FAQIcon from '../../../../assets/icons/FAQIcon';
import {useSelector} from 'react-redux';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import RightArrowIcon from '../../../../assets/icons/RightArrowIcon';

const FAQScreenStyles = theme => ({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: DimensionConstants.sixteen,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DimensionConstants.ten,
  },
  headerText: {
    fontSize: DimensionConstants.sixteen,
    color: theme.text,
    marginLeft: DimensionConstants.ten,
    flex: 1,
  },
  faqCard: {
    padding: DimensionConstants.sixteen,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DimensionConstants.ten,
  },
  questionText: {
    flex: 1,
    fontSize: DimensionConstants.sixteen,
    color: theme.text,
    fontWeight: '500',
    marginRight: DimensionConstants.ten,
  },
  answerText: {
    fontSize: DimensionConstants.fourteen,
    color: theme.grey,
    marginTop: DimensionConstants.five,
    lineHeight: DimensionConstants.twenty,
  },
  separator: {
    height: 1,
    backgroundColor: theme.lightGrey,
    marginVertical: DimensionConstants.five,
  },
});

const FAQScreen = () => {
  const navigation = useNavigation();
  const {appStrings} = useSelector(state => state.language);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = FAQScreenStyles(theme);

  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      question: appStrings?.settings?.faq?.q1 || 'How do I reset my password?',
      answer:
        appStrings?.settings?.faq?.a1 ||
        'To reset your password, go to the Security settings and use the "Change Password" section by entering your current password and new password.',
    },
    // {
    //   question:
    //     appStrings?.settings?.faq?.q2 || 'What is Two-Factor Authentication?',
    //   answer:
    //     appStrings?.settings?.faq?.a2 ||
    //     'Two-Factor Authentication (2FA) adds an extra layer of security by requiring a second form of verification beyond your password.',
    // },
    {
      question: appStrings?.settings?.faq?.q3 || 'How do I contact support?',
      answer:
        appStrings?.settings?.faq?.a3 ||
        'You can contact support through the "About Us" section in settings or email us at support@example.com.',
    },
    {
      question:
        appStrings?.settings?.faq?.q4 || 'Can I change my subscription plan?',
      answer:
        appStrings?.settings?.faq?.a4 ||
        'Yes, you can modify your subscription plan in the Subscription settings section of the app.',
    },
  ];

  const toggleFAQ = index => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <MainBackground noPadding style={{backgroundColor: theme.otpBox}}>
      <CustomHeader
        title={appStrings?.settings?.faq?.text || 'FAQ'}
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Spacing height={DimensionConstants.ten} />

            <View style={styles.headerContainer}>
              <FAQIcon />
              <Text style={styles.headerText}>
                {appStrings?.settings?.faq?.description ||
                  'Frequently Asked Questions'}
              </Text>
            </View>

            <Spacing height={DimensionConstants.ten} />

            <CustomCard style={styles.faqCard}>
              {faqData.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.questionRow}
                    onPress={() => toggleFAQ(index)}>
                    <Text style={styles.questionText}>{item.question}</Text>
                    <RightArrowIcon
                      color={theme.text}
                      style={{
                        transform: [
                          {rotate: expandedFAQ === index ? '90deg' : '0deg'},
                        ],
                      }}
                    />
                  </TouchableOpacity>
                  {expandedFAQ === index && (
                    <Text style={styles.answerText}>{item.answer}</Text>
                  )}
                  {index < faqData.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </CustomCard>

            <Spacing height={DimensionConstants.sixty} />
          </View>
        </ScrollView>
      </View>
    </MainBackground>
  );
};

export default FAQScreen;
