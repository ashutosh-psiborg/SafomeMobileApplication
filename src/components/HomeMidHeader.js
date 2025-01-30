import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const HomeMidHeader = ({ title, onPress, showViewAll = true }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontWeight: '700', fontSize: 14 }}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: '#808080', fontSize: 12, fontWeight: '500' }}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeMidHeader;
