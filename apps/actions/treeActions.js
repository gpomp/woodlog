import RNFS from 'react-native-fs';

import {findIDInList, getMaxID} from '../utils/utils';


export const CHANGETREE = "CHANGE_TREE";
export const SHOWTREE = "SHOW_TREE";
export const SHOWLIST = "SHOW_LIST";
export const RESET = "RESET_TREE";

export const SHOWNOTES = "SHOW_NOTES";
export const SAVENOTE = "SAVE_NOTE";
export const REMOVENOTE = "REMOVE_NOTE";

export const SHOWPHOTO = "SHOW_PHOTO";
export const SAVENEWPHOTO = "SAVE_NEW_PHOTO";
export const DELETEPHOTO = "DELETE_PHOTO";

export const change = (treeData, id) => ({
  type: CHANGETREE,
  payload: new Promise(resolve => {

    const tree = {
      key: 'tree',
      rawData: treeData,
      expires: null
    }

    global.storage.getIdsForKey('tree').then(ids => {
      tree.id = id === -1 ? ids.length : id;

      global.storage.save(tree);
      resolve(tree);
    });
  })
});



export const getList = () => ({
  type: SHOWLIST,
  payload: new Promise(resolve => {



    global.storage.getAllDataForKey('tree').then(ret => {
      resolve({data: ret});
    });
  })
});

export const reset = () => {
  return { type: RESET };
}


export const show = id => ({
  type: SHOWTREE,
  payload: new Promise(resolve => {

    global.storage.load({
      key: 'tree',
      id: id
    }).then(res => {
      resolve({rawData: res, id: id});
    });
  })
});

export const showNotes = ids => ({
  type: SHOWNOTES,
  payload: new Promise(resolve => {
    storage.getBatchDataWithIds({
      key: 'note', 
      ids
    }).then(res => {
      resolve({ notes: res, ids });
    });
  })
});

export const saveNote = (id, noteID, note, date, photoList) => ({
  type: SAVENOTE,
  payload: new Promise(resolve => {
    global.storage.getIdsForKey('note').then(ids => {
      if(ids === null) ids = [];
      const storageID = noteID > -1 ? noteID : getMaxID(ids) + 1;
      const noteEntry = {
        key: 'note',
        id: storageID,
        rawData: { note, date, photoList },
        expires: null
      }

      global.storage.save(noteEntry).then(noteSaved => {
        global.storage.load({
          key: 'tree',
          id
        }).then(tree => {
          const copy = Object.assign({}, tree);     
          const copyNote = Object.assign({}, noteEntry.rawData);  
          copyNote.id = storageID;
          if(noteID !== -1) {
            resolve({data: copyNote});
          } else {
            copy.notes.push(storageID);

            global.storage.save({
              key: 'tree',
              id,
              rawData: copy
            }).then(treeSaved => {
              resolve({data: copyNote});
            });

          }
        });
      });
    });
  })
});

export const removeNote = (id, noteID) => ({
  // pass array id
  type: REMOVENOTE,
  payload: new Promise(resolve => {
    global.storage.remove({
      key: 'note',
      id: noteID
    }).then(notes => {
      global.storage.load({
        key: 'tree',
        id
      }).then(tree => {
        const copy = Object.assign({}, tree);

        const listI = findIDInList(copy.notes, noteID, true);
        
        if(listI === -1) console.error('List ID should be > 0');
        copy.notes.splice(listI, 1);
          
        global.storage.save({
          key: 'tree',
          id,
          rawData: copy
        }).then(trees => {
          resolve({id: noteID});
        });
      });
    });
  })
});

export const showPhotos = (photos) => ({
  type:SHOWPHOTO,
  payload: new Promise(resolve => {
    storage.getBatchDataWithIds({
      key: 'img', 
      ids: photos
    }).then(res => {
      resolve({ data: res});
    });
  })
});

export const savePhoto = (src) => ({
  type: SAVENEWPHOTO,
  payload: new Promise(resolve => {

    global.storage.getIdsForKey('img').then(ids => {

      const img = {
        key: 'img',
        id: getMaxID(ids) + 1,
        rawData: { src: src },
        expires: null
      }

      global.storage.save(img);
      resolve({id: img.id});
    });
  })
});

export const removePhoto = (id) => ({
  type: DELETEPHOTO,
  payload: new Promise(resolve => {
    // Get the img url
    checkPhotoList(id).then(isUsed => {
      if(isUsed) {
        resolve({id});
        return;
      }

      global.storage.load({
        key: 'img',
        id
      }).then(res => {
        // Remove image from storage
        global.storage.remove({
          key: 'img', id
        }).then(res => {
          if(res === null) {
            resolve({id});
            return;
          }
          RNFS.unlink(res.src)
          .then(() => {
            resolve({id});
          }).catch(err => {
            resolve({id});
          });
        });     
      }).catch(err => {
        resolve({id});
      });
    });
  })
});

const checkPhotoList = (id) => {
  return new Promise(resolve => {
    global.storage.getAllDataForKey('tree').then(ret => {
      let count = 0;
      for (var i = 0; i < ret.length; i++) {
        for (var j = 0; j < ret[i].photos.length; j++) {
          if(ret[i].photos[j] === id) {
            count++;
            if(count >= 2) {
              resolve(true);
              return;
            }
          }
        }
      }

      resolve(false);
    });
  })
  
}