import ImagePicker from 'react-native-image-picker';
import { Platform } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

export const IPOptions = {
  title: 'Add a picture to this Bonsai...',
  allowsEditing: true,
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'woodlog',
    cameraRoll: 'false'
  }
};

export const imgPickerResponse = function (noteID, cb = null) {
  ImagePicker.showImagePicker(IPOptions, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      // You can display the image using either data...
      let source; // = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true, isURL: false};

      if (Platform.OS === 'ios') {
        source = {uri: response.uri.replace('file://', ''), isStatic: true};
      } else {
        source = {uri: response.uri, isStatic: true};
      }
      const uriSplit = response.uri.split('/');
      const fileName = uriSplit[uriSplit.length - 1];

      if(cb !== null) {
        return cb(noteID, fileName);
      }
    }
  })
};

export const addInCalendar = function (id, title, settings) {
  return new Promise((resolve, reject) => {
    RNCalendarEvents.authorizeEventStore()
    .then(status => {
      if(status === 'denied' || status === 'undetermined') {
        console.log('Access to event calendar denied');
        reject('Access to event calendar denied');
        return;
      }

      if(id !== '-1') {
        settings.id = id;
      }

      RNCalendarEvents.saveEvent(title, settings)
      .then(idEvent => {
        resolve(idEvent);
      })
      .catch(error => {
        console.error('Event Error', error);
        reject(error)
      });
    })
    .catch(error => {
      console.error('Event Error', error);
      reject(error)
    });
  })
}

export const removeInCalendar = function (id) {
  return new Promise((resolve, reject) => {
    RNCalendarEvents.authorizeEventStore()
    .then(status => {
      RNCalendarEvents.removeEvent(id).then(success => {
        resolve(success);
      });
    })
    .catch(error => {
      console.error('Event Error');
      reject(error)
    });
  });
}

/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}

export function compareArrays(a1, a2) {
  if(a1.length !== a2.length) return false;
  for (var i = 0; i < a1.length; i++) {
    if(a1[i] !== a2[i]) return false;
  }
  return true;
}

export function findIDInList (list, id, isOutside = false) {
  if(isNaN(id)) console.error('ID should be an integer', id);
  let aId = -1;
  for (var i = 0; i < list.length; i++) {
    if (parseInt(isOutside ? list[i] : list[i].id, 10) === parseInt(id, 10)) {
      aId = i;
      break;
    }
  }

  return aId;
} 

export function getMaxID(ids) {
  let maxID = -1;
  for (var i = 0; i < ids.length; i++) {
    maxID = Math.max(maxID, ids[i]);
  }

  return maxID;
}