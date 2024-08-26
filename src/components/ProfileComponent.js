import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { normalizeFontSize } from '../styles/responsive';
import fonts from '../styles/fonts';
import theme from '../styles/theme';
import Button from './ButtonComponent';

const ProfileComponent = ({ avatarUrl, name, rating, onViewProfile }) => {
  return (
    <View style={styles.container}>
      {/* Avatar and Name Section */}
      <View style={styles.avatarContainer}>
        {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.ratingContainer}>
            {rating && <Icon
              name={'star'}
              size={20}
              color="gold"
            />}
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
      </View>

      {onViewProfile && <Button
        onPress={onViewProfile}
        title={'View Profile'}
        customStyle={{ borderRadius: 8, width: '35%', height: 40, marginBottom: 0, marginTop: 0 }}
        textCustomStyle={{ fontSize: normalizeFontSize(12) }}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.textHeading,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.fontsType.bold,
    color: theme.colors.white
  },
  rating: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.fontsType.medium,
    color: theme.colors.labelColors,
    marginHorizontal: 5
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProfileComponent;
